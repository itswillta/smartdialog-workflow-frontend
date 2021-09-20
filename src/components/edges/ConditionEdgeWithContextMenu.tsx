import { Component } from 'solid-js';
import { EdgeProps } from 'solid-flowy/lib';

import EdgeWithContextMenu from './EdgeWithContextMenu';
import ConditionEdge from './ConditionEdge';

const ConditionEdgeWithContextMenu: Component<EdgeProps> = (props) => {
  return <EdgeWithContextMenu EdgeComponent={ConditionEdge} edgeProps={props} />;
};

export default ConditionEdgeWithContextMenu;
