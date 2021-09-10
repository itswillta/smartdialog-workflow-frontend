import { Component } from 'solid-js';

import ConditionNodeShellHeader from './ConditionNodeShellHeader';
import ConditionNodeShellBody from './ConditionNodeShellBody';
import IconButton from '../../../common/IconButton/IconButton';
import MoreHorizIcon from '../../../icons/MoreHorizIcon';
import '../ConditionNode.scss';

const ConditionNodeShell: Component = () => {
  return (
    <div class={'condition-node__container'}>
      <svg
        style={{
          position: 'absolute',
          top: -39,
          left: 0,
          filter: 'drop-shadow(rgba(0, 0, 0, 0.1) 0px -1px 2px)',
        }}
        width="366"
        height="40"
        viewBox="0 0 366 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M183 0L366 40H0 0Z" fill="#ffffff" fill-opacity="1" />
        <path d="M183 0L366 40H0 0Z" fill="#2e7d32" fill-opacity="1" />
      </svg>
      <svg
        style={{
          position: 'absolute',
          bottom: -39,
          left: 0,
          filter: 'drop-shadow(rgba(0, 0, 0, 0.2) 0px 4px 2px)',
        }}
        width="366"
        height="40"
        viewBox="0 0 366 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M183 40L0 0L366 0L183 40Z" fill="#ffffff" fill-opacity="1" />
      </svg>
      <ConditionNodeShellHeader />
      <ConditionNodeShellBody />
      <footer class="condition-node__footer">
        <div>
          <IconButton class="condition-node__foter-more-options-button" aria-label="more options">
            <MoreHorizIcon />
          </IconButton>
        </div>
      </footer>
    </div>
  );
};

export default ConditionNodeShell;
