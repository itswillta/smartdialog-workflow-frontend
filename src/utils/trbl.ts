import { Shape, TRBL } from 'solid-flowy/lib';

export const hexagonAsTRBL = (shape: Shape): TRBL => ({
  top: shape.y - shape.topPeakHeight,
  right: shape.x + shape.width,
  bottom: shape.y + shape.height + shape.topPeakHeight,
  left: shape.x,
});
