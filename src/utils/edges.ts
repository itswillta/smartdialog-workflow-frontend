import { isPointInShape, Point, Shape } from 'solid-flowy/lib';

interface Segment {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

type SegmentDirection = 'vertical-bottom' | 'vertical-top' | 'horizontal-right' | 'horizontal-left';

export const getFirstSegment = (waypoints: Point[]): Segment => {
  if (waypoints.length < 2) return null;

  return {
    sourceX: waypoints[0].x,
    sourceY: waypoints[0].y,
    targetX: waypoints[1].x,
    targetY: waypoints[1].y,
  };
};

export const getSegmentDirection = (segment: Segment): SegmentDirection => {
  if (segment.targetX === segment.sourceX) {
    if (segment.targetY > segment.sourceY) return 'vertical-bottom';
    if (segment.targetY < segment.sourceY) return 'vertical-top';
  }

  if (segment.targetX > segment.sourceX) return 'horizontal-right';
  if (segment.targetX < segment.sourceX) return 'horizontal-left';
};

export const calculateLabelPosition = ({
  label,
  firstSegmentDirection,
  shapeType,
  shape,
  waypoints,
}: {
  label: string;
  firstSegmentDirection: SegmentDirection;
  shapeType: string;
  shape: Shape;
  waypoints: Point[];
}) => {
  const labelSize = label.length * 6;

  switch (firstSegmentDirection) {
    case 'vertical-top': {
      return { textX: waypoints[0].x + 12, textY: waypoints[0].y - 24 };
    }
    case 'vertical-bottom': {
      return { textX: waypoints[0].x + 12, textY: waypoints[0].y + 24 };
    }
    case 'horizontal-left': {
      const textPosX = waypoints[0].x - 12 - labelSize;
      let textPosY = waypoints[0].y - 12;

      if (isPointInShape(shapeType)({ x: textPosX + labelSize, y: textPosY }, shape)) {
        textPosY = waypoints[0].y + 24;
      }

      return { textX: textPosX, textY: textPosY };
    }
    case 'horizontal-right': {
      const textPosX = waypoints[0].x + 12;
      let textPosY = waypoints[0].y - 12;

      if (isPointInShape(shapeType)({ x: textPosX, y: textPosY }, shape)) {
        textPosY = waypoints[0].y + 24;
      }

      return { textX: textPosX, textY: textPosY };
    }
    default:
      return { textX: waypoints[0].x, textY: waypoints[0].y };
  }
};
