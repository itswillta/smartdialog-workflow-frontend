/* eslint-disable no-param-reassign */
import findPathIntersections from 'path-intersection';
import { getLinePath } from 'react-flowy';

const GAP_THRESHOLD = 12;

export const getDockingPointForHexagon = (
  point,
  shape,
  detailedDockingDirection,
) => {
  point = { ...point, x: Math.round(point.x), y: Math.round(point.y) };

  const topPeak = {
    x: shape.x + shape.width / 2,
    y: shape.y - shape.topPeakHeight,
  };
  const topLeftPeak = { x: shape.x, y: shape.y };
  const topRightPeak = { x: shape.x + shape.width, y: shape.y };
  const bottomPeak = {
    x: shape.x + shape.width / 2,
    y: shape.y + shape.height + shape.bottomPeakHeight,
  };
  const bottomLeftPeak = { x: shape.x, y: shape.y + shape.height };
  const bottomRightPeak = {
    x: shape.x + shape.width,
    y: shape.y + shape.height,
  };

  if (detailedDockingDirection === 't') {
    point = { x: point.x, y: point.y + shape.height / 2 };

    if (point.x <= topLeftPeak.x || point.x >= topRightPeak.x) {
      point.x = topPeak.x;
    }

    const otherPoint = {
      x: point.x,
      y: point.y - shape.topPeakHeight * 2 - shape.height * 2,
    };
    const intersections = findPathIntersections(
      getLinePath([point, otherPoint]),
      getLinePath([topLeftPeak, topPeak, topRightPeak]),
    );

    return {
      dockingPoint: {
        original: point,
        ...{ x: intersections[0].x, y: intersections[0].y },
      },
      direction: 't',
    };
  }

  if (detailedDockingDirection === 'r') {
    if (point.y >= shape.y && point.y <= shape.y + shape.height) {
      return {
        dockingPoint: { original: point, x: shape.x + shape.width, y: point.y },
        direction: 'r',
      };
    }

    const otherPoint = { x: point.x + shape.width, y: point.y };

    if (point.y < shape.y) {
      if (point.y <= topPeak.y) {
        point = { x: point.x, y: topPeak.y + GAP_THRESHOLD };
      }

      const intersections = findPathIntersections(
        getLinePath([point, otherPoint]),
        getLinePath([topLeftPeak, topPeak, topRightPeak]),
      );

      return {
        dockingPoint: {
          original: point,
          ...{ x: intersections[0].x, y: intersections[0].y },
        },
        direction: 'r',
      };
    }

    if (point.y > shape.y + shape.height) {
      if (point.y >= bottomPeak.y) {
        point = { x: point.x, y: bottomPeak.y - GAP_THRESHOLD };
      }

      const intersections = findPathIntersections(
        getLinePath([point, otherPoint]),
        getLinePath([bottomLeftPeak, bottomPeak, bottomRightPeak]),
      );

      return {
        dockingPoint: {
          original: point,
          ...{ x: intersections[0].x, y: intersections[0].y },
        },
        direction: 'r',
      };
    }
  }

  if (detailedDockingDirection === 'b') {
    point = { x: point.x, y: point.y - shape.height / 2 };

    if (point.x <= bottomLeftPeak.x || point.x >= bottomRightPeak.x) {
      point.x = bottomPeak.x;
    }

    const otherPoint = {
      x: point.x,
      y: point.y + shape.topPeakHeight * 2 + shape.height * 2,
    };
    const intersections = findPathIntersections(
      getLinePath([point, otherPoint]),
      getLinePath([bottomLeftPeak, bottomPeak, bottomRightPeak]),
    );

    return {
      dockingPoint: {
        original: point,
        ...{ x: intersections[0].x, y: intersections[0].y },
      },
      direction: 'b',
    };
  }

  if (detailedDockingDirection === 'l') {
    if (point.y >= shape.y && point.y <= shape.y + shape.height) {
      return {
        dockingPoint: { original: point, x: shape.x, y: point.y },
        direction: 'l',
      };
    }

    const otherPoint = { x: point.x - shape.width, y: point.y };

    if (point.y < shape.y) {
      const intersections = findPathIntersections(
        getLinePath([point, otherPoint]),
        getLinePath([topLeftPeak, topPeak, topRightPeak]),
      );

      return {
        dockingPoint: {
          original: point,
          ...{ x: intersections[0].x, y: intersections[0].y },
        },
        direction: 'l',
      };
    }

    if (point.y > shape.y + shape.height) {
      const intersections = findPathIntersections(
        getLinePath([point, otherPoint]),
        getLinePath([bottomLeftPeak, bottomPeak, bottomRightPeak]),
      );

      return {
        dockingPoint: {
          original: point,
          ...{ x: intersections[0].x, y: intersections[0].y },
        },
        direction: 'l',
      };
    }
  }

  throw new Error(`Unexpected dockingDirection: <${detailedDockingDirection}>`);
};
