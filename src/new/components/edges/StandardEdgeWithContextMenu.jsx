import React from 'react';
import { StandardEdge } from 'react-flowy';
import EdgeWithContextMenu from './EdgeWithContextMenu';

export default React.memo(edgeProps => (
  <EdgeWithContextMenu EdgeComponent={StandardEdge} edgeProps={edgeProps} />
));
