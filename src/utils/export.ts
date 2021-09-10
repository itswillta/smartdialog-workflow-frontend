import { toPng } from 'html-to-image';
import { getCanvasBounding } from './canvas';

export const exportAsPNG = async ({
  margin = 16,
  qualityLevel = 1,
  storeId,
}: {
  margin?: number;
  qualityLevel?: number;
  storeId: string;
}) => {
  const solidFlowyElement = document.querySelector('.solid-flowy') as HTMLElement;
  const solidFlowyElementClone = solidFlowyElement.cloneNode(true) as HTMLElement;

  solidFlowyElementClone.className = 'solid-flowy solid-flowy--cloned';
  solidFlowyElementClone.style.background = '#f4f4f4';
  solidFlowyElementClone.style.fontFamily = 'Roboto';

  const { height, width } = solidFlowyElement.getBoundingClientRect();

  solidFlowyElement.style.display = 'none';

  const { top, right, bottom, left } = getCanvasBounding({ storeId });

  const widthScale = (width - margin * 2) / (right - left);
  const heightScale = (height - margin * 2) / (bottom - top);
  const scale = Math.min(widthScale, heightScale);

  const solidFlowyNodesElement = solidFlowyElementClone.querySelector('.solid-flowy__nodes') as HTMLElement;
  const solidFlowyEdgesTransformerElement = solidFlowyElementClone.querySelector(
    '.solid-flowy__edges__transformer'
  ) as HTMLElement;

  const translateX = -(left - margin) * scale;
  const translateY = -(top - margin) * scale;

  solidFlowyElementClone.style.width = `${(right - left + margin * 2) * scale}px`;
  solidFlowyElementClone.style.height = `${(bottom - top + margin * 2) * scale}px`;
  solidFlowyNodesElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  solidFlowyEdgesTransformerElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

  solidFlowyElement.parentElement.appendChild(solidFlowyElementClone);

  const dataURL = await toPng(solidFlowyElementClone, {
    pixelRatio: qualityLevel,
  });

  solidFlowyElement.style.display = '';
  solidFlowyElementClone.parentElement.removeChild(solidFlowyElementClone);

  return dataURL;
};
