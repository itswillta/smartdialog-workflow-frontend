import { Component, createSignal } from 'solid-js';
import { Node, useSolidFlowyStoreById } from 'solid-flowy/lib';
import { useI18n } from '@amoutonbrady/solid-i18n';

import InputIcon from '../../icons/InputIcon';
import IconButton from '../../common/IconButton/IconButton';
import MoreHorizIcon from '../../icons/MoreHorizIcon';
import Menu from '../../common/Menu/Menu';
import MenuItem from '../../common/Menu/MenuItem';
import './IntentNodeHeader.scss';

interface IntentNodeHeaderProps {
  node: Node;
  storeId: string;
}

const IntentNodeHeader: Component<IntentNodeHeaderProps> = (props) => {
  const [t] = useI18n();
  let anchorEl: HTMLButtonElement;
  const [state, { deleteElementById }] = useSolidFlowyStoreById(props.storeId);
  const [isOpen, setIsOpen] = createSignal(false);

  const handleClick = () => {
    setIsOpen(!isOpen());
  };

  const deleteNode = () => {
    deleteElementById(props.node.id);
  };

  return (
    <header class='intent-node-header'>
      <InputIcon class='intent-node-header__leading-icon' />
      <h3 class='intent-node-header__title'>{t('intent')}</h3>
      <IconButton class='intent-node-header__more-options-button' ref={anchorEl} onClick={handleClick}>
        <MoreHorizIcon class='intent-node-header__more-options-button__icon' />
      </IconButton>
      <Menu anchorEl={anchorEl} isOpen={isOpen()} onClose={() => setIsOpen(false)}>
        <MenuItem onClick={deleteNode}>{t('delete')}</MenuItem>
      </Menu>
    </header>
  );
};

export default IntentNodeHeader;
