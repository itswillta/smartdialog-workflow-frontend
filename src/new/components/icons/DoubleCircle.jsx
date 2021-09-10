import React from 'react';
import { createSvgIcon } from '@material-ui/core';

export default createSvgIcon(
  <g>
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="transparent"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="12" cy="12" r="7" />
  </g>,
  'DoubleCircle',
);
