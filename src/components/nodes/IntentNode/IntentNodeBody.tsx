import { Component, createEffect, JSX } from 'solid-js';
import { Node, useSolidFlowyStoreById } from 'solid-flowy/lib';

import styles from './IntentNodeBody.module.css';

interface IntentNodeBodyProps {
  node: Node;
  storeId: string;
}

const IntentNodeBody: Component<IntentNodeBodyProps> = (props) => {
  const [state, { upsertNode }] = useSolidFlowyStoreById(props.storeId);

  const handleActionChange: JSX.DOMAttributes<HTMLInputElement>['onInput'] = (event) => {
    const updatedNode = { ...props.node, data: { ...props.node.data, intent: event.currentTarget.value }};

    upsertNode(updatedNode);
  };

  return (
    <main className={styles.Main}>
      <input className={styles.Input} value={props.node.data.intent} onInput={handleActionChange} placeholder="Intent" />
    </main>
  )
};

export default IntentNodeBody;
