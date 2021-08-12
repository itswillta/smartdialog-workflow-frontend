import { Component, Show } from 'solid-js';
import { initializeSolidFlowyStore } from 'solid-flowy/lib';

import logo from './logo.svg';
import styles from './App.module.css';
import Workflow from './components/Workflow';

const App: Component = () => {
  const storeId = initializeSolidFlowyStore();

  return (
    <div class={styles.App}>
      <Show when={storeId} fallback={null}>
        <Workflow storeId={storeId} />
      </Show>
    </div>
  );
};

export default App;
