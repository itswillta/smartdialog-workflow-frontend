import { Component } from 'solid-js';
import { EdgeProps } from '../../../../solid-flowy/lib';
import EdgeWithContextMenu from './EdgeWithContextMenu';
import EdgeWithStartIndicator from './EdgeWithStartIndicator';

const EdgeWithStartIndicatorWithContextMenu: Component<EdgeProps> = (props) => {
  return <EdgeWithContextMenu EdgeComponent={EdgeWithStartIndicator} edgeProps={props} />;
};

export default EdgeWithStartIndicatorWithContextMenu;
