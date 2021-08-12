import { Component } from 'solid-js';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';

import styles from './IntentNode.module.css';
import IntentNodeBody from './IntentNodeBody';
import IntentNodeHeader from './IntentNodeHeader';

const IntentNode: Component<NodeComponentProps> = (props) => {
  return (
    <div className={styles.Container}>
      <div>
        <IntentNodeHeader node={props.node} storeId={props.storeId} />
        <IntentNodeBody node={props.node} storeId={props.storeId} />
      </div>
    </div>
  );
};

export default IntentNode;
