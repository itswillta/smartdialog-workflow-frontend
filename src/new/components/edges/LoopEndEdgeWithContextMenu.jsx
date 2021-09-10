import React from 'react';
import EdgeWithContextMenu from './EdgeWithContextMenu';
import LoopEndEdge from './LoopEndEdge';

export default React.memo(edgeProps => (
  <EdgeWithContextMenu EdgeComponent={LoopEndEdge} edgeProps={edgeProps} />
));
