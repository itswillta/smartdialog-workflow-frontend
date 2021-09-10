/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */

import moment from 'moment';
import md5 from 'md5';
import {
  getIncomingEdges,
  getOutgoingEdges,
  getSourceNode,
  getTargetNode,
} from 'react-flowy';
import { isNodeInLoop } from '../utils/nodes';

const joinRecursiveNodeScripts = recursiveScripts => {
  const actualScripts = [];

  const join = recursiveScript => {
    if (!Array.isArray(recursiveScript[0])) {
      actualScripts.push(recursiveScript);

      return;
    }

    return recursiveScript.map(rs => join(rs));
  };

  join(recursiveScripts);

  return actualScripts;
};

const generateNodeScriptsRecursive = ({
  currentNode,
  currentScript,
  nodes,
  edges,
}) => {
  if (!currentNode) currentNode = nodes.find(node => node.type === 'startNode');

  if (!currentScript) currentScript = [currentNode];
  else {
    currentScript = [...currentScript, currentNode];
  }

  const outcomingEdges = getOutgoingEdges(edges)(currentNode);

  if (
    currentNode.type === 'localTerminateNode' ||
    currentNode.type === 'globalTerminateNode' ||
    outcomingEdges.length === 0
  ) {
    return [...currentScript, currentNode];
  }

  if (currentNode.type !== 'conditionNode') {
    return outcomingEdges.map(outcomingEdge => {
      const targetNode = getTargetNode(nodes)(outcomingEdge);

      return generateNodeScriptsRecursive({
        currentNode: targetNode,
        currentScript,
        nodes,
        edges,
      });
    });
  }

  const loopTimes =
    joinRecursiveNodeScripts(currentScript)[0].filter(
      node => node.id === currentNode.id,
    ).length - 1;

  if (currentNode.data.loopCount && loopTimes >= currentNode.data.loopCount) {
    const loopEndEdge = outcomingEdges.find(
      outcomingEdge => outcomingEdge.label === 'LOOP END',
    );
    const loopEndTargetNode = getTargetNode(nodes)(loopEndEdge);

    // The node that is connected not by the edge with the "LOOP END" label but
    // by either TRUE/FALSE edge that allows escaping the loop.
    let otherEscapeNode;

    outcomingEdges.forEach(outcomingEdge => {
      const targetNode = getTargetNode(nodes)(outcomingEdge);

      if (
        outcomingEdge.label === 'LOOP END' ||
        isNodeInLoop(nodes, edges)(targetNode)
      )
        return;

      otherEscapeNode = targetNode;
    });

    if (otherEscapeNode) {
      return [
        generateNodeScriptsRecursive({
          currentNode: otherEscapeNode,
          currentScript,
          nodes,
          edges,
        }),
        generateNodeScriptsRecursive({
          currentNode: loopEndTargetNode,
          currentScript,
          nodes,
          edges,
        }),
      ];
    }

    return generateNodeScriptsRecursive({
      currentNode: loopEndTargetNode,
      currentScript,
      nodes,
      edges,
    });
  }

  return getOutgoingEdges(edges)(currentNode)
    .filter(outcomingEdge => outcomingEdge.label !== 'LOOP END')
    .map(outcomingEdge => {
      const targetNode = getTargetNode(nodes)(outcomingEdge);

      return generateNodeScriptsRecursive({
        currentNode: targetNode,
        currentScript,
        nodes,
        edges,
      });
    });
};

const getConditionValue = ({ nodes, edges, nodeScript, node, index }) => {
  let conditionValue;

  getIncomingEdges(edges)(nodeScript[index + 1]).forEach(incomingEdge => {
    if (getSourceNode(nodes)(incomingEdge).id !== node.id) return;

    conditionValue = incomingEdge.label;
  });

  if (conditionValue === 'LOOP END') {
    getOutgoingEdges(edges)(node).forEach(outcomingEdge => {
      const targetNode = getTargetNode(nodes)(outcomingEdge);

      if (!isNodeInLoop(nodes, edges)(targetNode)) return;

      conditionValue = outcomingEdge.label;
    });
  }

  return conditionValue;
};

export const generateNodeScripts = ({ nodes, edges }) => {
  const recursiveNodeScripts = generateNodeScriptsRecursive({ nodes, edges });

  return joinRecursiveNodeScripts(recursiveNodeScripts);
};

export const generateScriptsFromNodeScript = ({
  nodeScript,
  intents,
  actions,
  slots,
}) => {
  let mainMessages = nodeScript
    .map((node, index) => {
      if (node.type === 'intentNode') {
        const intent = intents.find(({ id }) => id === node.data.intent);

        return {
          intent: intent.name,
          displayName: intent.displayName,
          sender: 'User',
          listSlot: [],
          parameters: [],
        };
      }

      if (node.type === 'actionNode') {
        const action = actions.find(({ id }) => id === node.data.action);

        return {
          action: { name: action.name },
          displayName: action.displayName,
          sender: 'Agent',
          listSlot: [],
          parameters: [],
        };
      }

      if (node.type === 'conditionNode') {
        const listSlot = [];
        const parameters = [];

        const conditionValue = getConditionValue({ nodeScript, node, index });

        node.data.conditions.forEach(cond => {
          const slot = slots.find(e => e.id === cond.parameter.id);

          listSlot.push(slot);

          const parameter = {
            displayName: `${slot.displayName}${cond.operator}${cond.value}`,
            value: conditionValue,
            name: md5(slot.name + cond.operator + cond.value),
            dataType: 7,
            text: '',
            customData: [
              {
                dataType: 4,
                displayName: slot.displayName,
                name: slot.name,
                operation: cond.operator,
                value: cond.value,
              },
            ],
          };

          parameters.push(parameter);
        });

        return {
          type: 'condition',
          forIndex: index - 1,
          listSlot,
          parameters,
        };
      }

      if (node.type === 'subWorkflowNode') {
        return node.data.listScript.map(subWorkflowScript => ({
          mainMessages: subWorkflowScript.mainMessages,
          terminate: subWorkflowScript.terminate,
          index,
        }));
      }

      return null;
    })
    .filter(Boolean);

  mainMessages = mainMessages.filter((message, index) => {
    if (message.type !== 'condition') return true;

    mainMessages[index - 1].listSlot = message.listSlot;
    mainMessages[index - 1].parameters = message.parameters;

    return false;
  });

  let hasMultipleScripts = false;

  const currentMainMessages = [];
  const subWorkflowMessageBranches = [];
  const isTerminated = [];

  mainMessages.forEach(mainMessage => {
    if (Array.isArray(mainMessage)) {
      hasMultipleScripts = true;

      if (currentMainMessages.length) {
        mainMessage.forEach((_, index) => {
          subWorkflowMessageBranches[index] = [currentMainMessages];
        });
      }

      mainMessage.forEach((subWorkflow, index) => {
        subWorkflow.mainMessages.forEach(subWorkflowMainMessage => {
          if (!subWorkflowMessageBranches[index])
            subWorkflowMessageBranches[index] = [];

          subWorkflowMessageBranches[index].push(subWorkflowMainMessage);
        });

        if (subWorkflow.terminate) isTerminated[index] = true;
      });
    } else {
      if (hasMultipleScripts) {
        subWorkflowMessageBranches.forEach((messages, index) => {
          if (isTerminated[index]) return;

          messages.push(mainMessage);
        });

        return;
      }

      currentMainMessages.push(mainMessage);
    }
  });

  const terminate =
    nodeScript[nodeScript.length - 1].type === 'globalTerminateNode';

  if (hasMultipleScripts) {
    return {
      hasMultipleScripts,
      scripts: subWorkflowMessageBranches.map(messageBranch => ({
        mainMessages: messageBranch,
        terminate,
      })),
    };
  }

  return { hasMultipleScripts: false, scripts: [{ mainMessages, terminate }] };
};

export const processRawScripts = ({ scripts, workflowName, agentId }) =>
  scripts.map((script, index) => {
    const name = `${workflowName} - #${index + 1} - ${moment().format(
      'DD-MM-YYYY',
    )}`;

    return {
      ...script,
      name,
      agentId,
      isInteract: false,
    };
  });

export const generateProcessedScripts = ({
  nodes,
  edges,
  intents,
  actions,
  slots,
  workflowName,
  agentId,
}) => {
  const nodeScripts = generateNodeScripts({ nodes, edges });
  let scripts = [];

  nodeScripts.forEach(nodeScript => {
    const { scripts: rawScripts } = generateScriptsFromNodeScript({
      nodeScript,
      intents,
      actions,
      slots,
    });

    scripts = scripts.concat(rawScripts);
  });

  const processedScripts = processRawScripts({
    scripts,
    workflowName,
    agentId,
  });

  return processedScripts;
};
