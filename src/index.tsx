import { render } from 'solid-js/web';

import './index.scss';
import './common.scss';
import App from './App';

export { bridgingFunctions, bridgingSignals, setBridgingSignals } from './App';

export const renderWorkflowApp = (rootId = 'workflow-app') => {
  render(() => <App />, document.getElementById(rootId));
};
