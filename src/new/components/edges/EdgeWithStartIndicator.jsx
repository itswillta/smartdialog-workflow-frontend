import React from 'react';
import clsx from 'clsx';

import { StandardEdge } from 'react-flowy';

export default React.memo(({ edge, ...rest }) => (
  <>
    <circle
      className={clsx(
        'edge__start-indicator',
        edge.isInvalid ? 'edge__start-indicator--invalid' : '',
      )}
      cx={edge.waypoints[0].x}
      cy={edge.waypoints[0].y}
      r="4"
    />
    <StandardEdge edge={edge} {...rest} />
  </>
));
