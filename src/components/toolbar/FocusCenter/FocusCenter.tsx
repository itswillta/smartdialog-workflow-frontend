import { Component } from 'solid-js';
import { useI18n } from '@amoutonbrady/solid-i18n';
import { useSolidFlowyStoreById } from 'solid-flowy/lib';

import Tooltip from '../../common/Tooltip/Tooltip';
import IconButton from '../../common/IconButton/IconButton';
import CenterFocusStrongIcon from '../../icons/CenterFocusStrongIcon';
import './FocusCenter.scss';

interface FocusCenterProps {
  storeId: string;
}

const FocusCenter: Component<FocusCenterProps> = (props) => {
  const [t] = useI18n();
  const [state, { zoomTo, translateTo }] = useSolidFlowyStoreById(props.storeId);

  const handleFocusCenter = () => {
    zoomTo(1);

    const firstNode = Object.values(state.nodes)[0];

    if (!firstNode) return;

    translateTo([firstNode.position.x, firstNode.position.y]);
  };

  return (
    <Tooltip title={t('focusCenter')}>
      <IconButton class="focus-center__icon-button" onClick={handleFocusCenter}>
        <CenterFocusStrongIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FocusCenter;
