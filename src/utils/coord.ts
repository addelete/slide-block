import { __GridGapWidth__, __GridWidth__ } from './constant';

export type Coord = {
  x: number;
  y: number;
};

export enum RectTypeEnum {
  Grid = 'grid',
  VerticalGap = 'vertical-gap',
  HorizontalGap = 'horizontal-gap',
  PointGap = 'point-gap',
}

export type Rect = {
  type: RectTypeEnum;
  coord: Coord;
  render: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type Circle = {
  x: number;
  y: number;
  radius: number;
};

export class CoordUtil {
  static isEqual(c1: Coord, c2: Coord) {
    return c1.x === c2.x && c1.y === c2.y;
  }

  /**
   * 判断c2是否是c1的相邻坐标
   * @param c1 基准坐标
   * @param c2 与基准坐标比较的坐标
   * @returns
   */
  static isAdjacent(c1: Coord, c2: Coord) {
    return (
      (Math.abs(c1.x - c2.x) === 1 && c1.y === c2.y) ||
      (Math.abs(c1.y - c2.y) === 1 && c1.x === c2.x)
    );
  }

  /**
   * 相邻的坐标
   * @param c 坐标
   * @returns
   */
  static adjacentCoords(c: Coord) {
    return [
      { x: c.x - 1, y: c.y },
      { x: c.x + 1, y: c.y },
      { x: c.x, y: c.y - 1 },
      { x: c.x, y: c.y + 1 },
    ];
  }

  /**
   * 判断c2是否是c1的对角坐标
   * @param c1 基准坐标
   * @param c2 与基准坐标比较的坐标
   * @returns
   */
  static isOpposite(c1: Coord, c2: Coord) {
    return Math.abs(c1.x - c2.x) === 1 && Math.abs(c1.y - c2.y) === 1;
  }

  /**
   * 对角的坐标
   * @param c 坐标
   * @returns
   */
  static oppositeCoords(c: Coord) {
    return [
      { x: c.x - 1, y: c.y - 1 },
      { x: c.x + 1, y: c.y - 1 },
      { x: c.x - 1, y: c.y + 1 },
      { x: c.x + 1, y: c.y + 1 },
    ];
  }
  /**
   * 判断c2是否是c1周围的坐标
   * @param c1 基准坐标
   * @param c2 与基准坐标比较的坐标
   * @returns
   */
  static isAround(c1: Coord, c2: Coord) {
    return !CoordUtil.isEqual(c1, c2) && Math.abs(c1.x - c2.x) <= 1 && Math.abs(c1.y - c2.y) <= 1;
  }

  /**
   * 周围的坐标
   * @param c 坐标
   * @returns
   */
  static aroundCoords(c: Coord) {
    return [
      { x: c.x - 1, y: c.y },
      { x: c.x + 1, y: c.y },
      { x: c.x, y: c.y - 1 },
      { x: c.x, y: c.y + 1 },
      { x: c.x + 1, y: c.y + 1 },
      { x: c.x + 1, y: c.y - 1 },
      { x: c.x - 1, y: c.y - 1 },
      { x: c.x - 1, y: c.y + 1 },
    ];
  }

  static coord2Rect(coord: Coord, type: RectTypeEnum): Rect {
    return {
      type,
      coord,
      render: {
        x: {
          [RectTypeEnum.Grid]: coord.x * (__GridWidth__ + __GridGapWidth__) + __GridGapWidth__,
          [RectTypeEnum.VerticalGap]: coord.x * (__GridWidth__ + __GridGapWidth__),
          [RectTypeEnum.HorizontalGap]:
            coord.x * (__GridWidth__ + __GridGapWidth__) + __GridGapWidth__,
          [RectTypeEnum.PointGap]: coord.x * (__GridWidth__ + __GridGapWidth__),
        }[type],
        y: {
          [RectTypeEnum.Grid]: coord.y * (__GridWidth__ + __GridGapWidth__) + __GridGapWidth__,
          [RectTypeEnum.VerticalGap]:
            coord.y * (__GridWidth__ + __GridGapWidth__) + __GridGapWidth__,
          [RectTypeEnum.HorizontalGap]: coord.y * (__GridWidth__ + __GridGapWidth__),
          [RectTypeEnum.PointGap]: coord.y * (__GridWidth__ + __GridGapWidth__),
        }[type],
        width: {
          [RectTypeEnum.Grid]: __GridWidth__,
          [RectTypeEnum.VerticalGap]: __GridGapWidth__,
          [RectTypeEnum.HorizontalGap]: __GridWidth__,
          [RectTypeEnum.PointGap]: __GridGapWidth__,
        }[type],
        height: {
          [RectTypeEnum.Grid]: __GridWidth__,
          [RectTypeEnum.VerticalGap]: __GridWidth__,
          [RectTypeEnum.HorizontalGap]: __GridGapWidth__,
          [RectTypeEnum.PointGap]: __GridGapWidth__,
        }[type],
      },
    };
  }

  static coord2GridCenter(coord: Coord): Coord {
    return {
      x: coord.x * (__GridWidth__ + __GridGapWidth__) + __GridWidth__ / 2 + __GridGapWidth__,
      y: coord.y * (__GridWidth__ + __GridGapWidth__) + __GridWidth__ / 2 + __GridGapWidth__,
    };
  }

  static coord2HashCode(coord: Coord) {
    return coord.x + '_' + coord.y;
  }

  static coords2HashCode(coords: Coord[]) {
    const tmp = [...coords];
    tmp.sort((a, b) => {
      if (a.y === b.y) {
        return a.x - b.x;
      }
      return a.y - b.y;
    });
    return tmp.map((c) => CoordUtil.coord2HashCode(c)).join('#');
  }
}
