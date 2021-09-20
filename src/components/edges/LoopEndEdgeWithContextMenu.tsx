import { Component } from 'solid-js';
import { EdgeProps } from 'solid-flowy/lib';

import EdgeWithContextMenu from './EdgeWithContextMenu';
import LoopEndEdge from './LoopEndEdge';

const LoopEndEdgeWithContextMenu: Component<EdgeProps> = (props) => {
  return <EdgeWithContextMenu EdgeComponent={LoopEndEdge} edgeProps={props} />;
};

export default LoopEndEdgeWithContextMenu;
