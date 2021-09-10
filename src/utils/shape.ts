import { isPointInRect, Point, Shape } from 'solid-flowy/lib';

const sign = (pointA: Point, pointB: Point, pointC: Point) =>
  (pointA.x - pointC.x) * (pointB.y - pointC.y) - (pointB.x - pointC.x) * (pointA.y - pointC.y);

export const isPointInTriangle =
  (point: Point) => (trianglePointA: Point, trianglePointB: Point, trianglePointC: Point) => {
    const d1 = sign(point, trianglePointA, trianglePointB);
    const d2 = sign(point, trianglePointB, trianglePointC);
    const d3 = sign(point, trianglePointC, trianglePointA);

    const hasNegative = d1 < 0 || d2 < 0 || d3 < 0;
    const hasPositive = d1 > 0 || d2 > 0 || d3 > 0;

    return !(hasNegative && hasPositive);
  };

export const isPointInHexagon = (point: Point, shape: Shape) => {
  const isPointInHexagonRect = isPointInRect(point, shape);

  if (isPointInHexagonRect) return true;

  const topPeak = {
    x: shape.x + shape.width / 2,
    y: shape.y - shape.topPeakHeight,
  };
  const topLeftPeak = { x: shape.x, y: shape.y };
  const topRightPeak = { x: shape.x + shape.width, y: shape.y };

  const isPointInTopTriangle = isPointInTriangle(point)(topLeftPeak, topPeak, topRightPeak);

  if (isPointInTopTriangle) return true;

  const bottomPeak = {
    x: shape.x + shape.width / 2,
    y: shape.y + shape.height + shape.bottomPeakHeight,
  };
  const bottomLeftPeak = { x: shape.x, y: shape.y + shape.height };
  const bottomRightPeak = {
    x: shape.x + shape.width,
    y: shape.y + shape.height,
  };

  return isPointInTriangle(point)(bottomLeftPeak, bottomPeak, bottomRightPeak);
};
