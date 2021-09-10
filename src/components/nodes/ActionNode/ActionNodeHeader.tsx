import { Component, createSignal } from 'solid-js';
import { Node, useSolidFlowyStoreById } from 'solid-flowy/lib';
import { useI18n } from '@amoutonbrady/solid-i18n';

import FlashIcon from '../../icons/FlashIcon';
import IconButton from '../../common/IconButton/IconButton';
import MoreHorizIcon from '../../icons/MoreHorizIcon';
import Menu from '../../common/Menu/Menu';
import MenuItem from '../../common/Menu/MenuItem';
import './ActionNodeHeader.scss';

interface ActionNodeHeaderProps {
  node: Node;
  storeId: string;
}

const ActionNodeHeader: Component<ActionNodeHeaderProps> = (props) => {
  let anchorEl: HTMLButtonElement;
  const [t] = useI18n();
  const [state, { deleteElementById }] = useSolidFlowyStoreById(props.storeId);
  const [isOpen, setIsOpen] = createSignal(false);

  const handleClick = () => {
    setIsOpen(!isOpen());
  };

  const deleteNode = () => {
    deleteElementById(props.node.id);
  };

  return (
    <header class='action-node-header'>
      <FlashIcon class='action-node-header__leading-icon' />
      <h3 class='action-node-header__title'>{t('action')}</h3>
      <IconButton class='action-node-header__more-options-button' ref={anchorEl} onClick={handleClick}>
        <MoreHorizIcon class='action-node-header__more-options-button__icon' />
      </IconButton>
      <Menu anchorEl={anchorEl} isOpen={isOpen()} onClickAway={() => setIsOpen(false)}>
        <MenuItem onClick={deleteNode}>Delete</MenuItem>
      </Menu>
    </header>
  );
};

export default ActionNodeHeader;
