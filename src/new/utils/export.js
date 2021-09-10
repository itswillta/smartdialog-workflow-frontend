/* eslint-disable import/prefer-default-export */

import { toPng } from 'html-to-image';
import { getCanvasBounding } from './canvas';

export const exportAsPNG = async ({
  margin = 16,
  qualityLevel = 1,
  storeId,
}) => {
  const reactFlowyElement = document.querySelector('.react-flowy');
  const reactFlowyElementClone = reactFlowyElement.cloneNode(true);

  reactFlowyElementClone.className = 'react-flowy react-flowy--cloned';
  reactFlowyElementClone.style.background = '#f4f4f4';
  reactFlowyElementClone.style.fontFamily = 'Roboto';

  const { height, width } = reactFlowyElement.getBoundingClientRect();

  reactFlowyElement.style.display = 'none';

  const { top, right, bottom, left } = getCanvasBounding({ storeId });

  const widthScale = (width - margin * 2) / (right - left);
  const heightScale = (height - margin * 2) / (bottom - top);
  const scale = Math.min(widthScale, heightScale);

  const reactFlowyNodesElement = reactFlowyElementClone.querySelector(
    '.react-flowy__nodes',
  );
  const reactFlowyEdgesTransformerElement = reactFlowyElementClone.querySelector(
    '.react-flowy__edges__transformer',
  );

  const translateX = -(left - margin) * scale;
  const translateY = -(top - margin) * scale;

  reactFlowyElementClone.style.width = `${(right - left + margin * 2) *
    scale}px`;
  reactFlowyElementClone.style.height = `${(bottom - top + margin * 2) *
    scale}px`;
  reactFlowyNodesElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  reactFlowyEdgesTransformerElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

  reactFlowyElement.parentElement.appendChild(reactFlowyElementClone);

  const dataURL = await toPng(reactFlowyElementClone, {
    pixelRatio: qualityLevel,
  });

  reactFlowyElement.style.display = '';
  reactFlowyElementClone.parentElement.removeChild(reactFlowyElementClone);

  return dataURL;
};
