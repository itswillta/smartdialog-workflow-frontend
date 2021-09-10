export const hexagonAsTRBL = shape => ({
  top: shape.y - shape.topPeakHeight,
  right: shape.x + shape.width,
  bottom: shape.y + shape.height + shape.topPeakHeight,
  left: shape.x,
});
