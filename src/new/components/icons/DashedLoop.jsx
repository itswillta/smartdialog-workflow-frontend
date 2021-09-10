import React from 'react';
import clsx from 'clsx';

const DashedLoop = ({ className, ...rest }) => (
  <svg
    className={clsx('MuiSvgIcon-root', className)}
    focusable="false"
    viewBox="0 0 40 40"
    aria-hidden="true"
    {...rest}
  >
    <g>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeMiterlimit="10"
        d="M15.4,34.4c-1.6-0.5-3.1-1.2-4.5-2.2"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeMiterlimit="10"
        strokeDasharray="6.2822,1.8847"
        d="M9.4,31.1
              c-1.8-1.6-3.3-3.6-4.2-5.8"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeMiterlimit="10"
        d="M4.9,24.5C4.3,22.9,4,21.3,4,19.6"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeMiterlimit="10"
        d="M4,19.6c0-1.7,0.3-3.4,0.8-4.9"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeMiterlimit="10"
        strokeDasharray="9.8972,2.9692"
        d="M6.1,12
              c2.8-4.8,8.3-8.1,14.3-8c8.9,0.2,16.1,7.8,15.6,16.5c-0.2,2.5-1,5-2.3,7.1"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeMiterlimit="10"
        d="M32.8,28.8c-1,1.3-2.2,2.5-3.6,3.4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.1,36.8l-1-1.4c-1.2-1.6-2.4-3.2-3.6-4.9c-0.7-0.9-1.3-1.9-2-2.8l-0.7-0.9
          l-1.4,4.8L23,36.5l5.2,0.3l5.1,0.3C33.3,37,33.2,36.9,33.1,36.8z"
      />
    </g>
  </svg>
);

export default DashedLoop;
