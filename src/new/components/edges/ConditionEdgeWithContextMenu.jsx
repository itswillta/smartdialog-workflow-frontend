import React from 'react';
import EdgeWithContextMenu from './EdgeWithContextMenu';
import ConditionEdge from './ConditionEdge';

export default React.memo(edgeProps => (
  <EdgeWithContextMenu EdgeComponent={ConditionEdge} edgeProps={edgeProps} />
));
