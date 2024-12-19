import { Img, makeScene2D, View2D } from "@motion-canvas/2d";
import { ColorTheme } from "src/theme";
import {
  createRef,
  PossibleVector2,
  Reference,
  ThreadGenerator,
  Vector2,
} from "@motion-canvas/core";

import iconPng from "/images/icon.png";

export interface ThemedScene {
  theme: ColorTheme;
  view: View2D;
  cat: Reference<Img>;
  center(): Vector2;

  /**
   * 获取视图左侧边界坐标
   *
   * @param dist 向内偏移距离，大于等于 1 时为像素值，小于 1 时为屏幕宽度百分比
   */
  left(dist?: number): Vector2;

  /**
   * 获取视图右侧边界坐标
   *
   * @param dist 向内偏移距离，大于等于 1 时为像素值，小于 1 时为屏幕宽度百分比
   */
  right(dist?: number): Vector2;

  /**
   * 获取视图顶部边界坐标
   *
   * @param dist 向内偏移距离，大于等于 1 时为像素值，小于 1 时为屏幕高度百分比
   */
  top(dist?: number): Vector2;

  /**
   * 获取视图底部边界坐标
   *
   * @param dist 向内偏移距离，大于等于 1 时为像素值，小于 1 时为屏幕高度百分比
   */
  bottom(dist?: number): Vector2;

  /**
   * 获取视图左上角坐标
   *
   * @param dist 向内偏移距，大于等于 1 时为像素值，小于 1 时为屏幕宽高百分比
   */
  topLeft(dist?: PossibleVector2): Vector2;

  /**
   * 获取视图右上角坐标
   *
   * @param dist 向内偏移距，大于等于 1 时为像素值，小于 1 时为屏幕宽高百分比
   */
  topRight(dist?: PossibleVector2): Vector2;

  /**
   * 获取视图左下角坐标
   *
   * @param dist 向内偏移距，大于等于 1 时为像素值，小于 1 时为屏幕宽高百分比
   */
  bottomLeft(dist?: PossibleVector2): Vector2;

  /**
   * 获取视图右下角坐标
   *
   * @param dist 向内偏移距，大于等于 1 时为像素值，小于 1 时为屏幕宽高百分比
   */
  bottomRight(dist?: PossibleVector2): Vector2;

  /**
   * 获取视图左侧边界 x 坐标
   *
   * @param dist 向内偏移距离，大于等于 1 时为像素值，小于 1 时为屏幕宽度百分比
   */
  leftX(dist?: number): number;

  /**
   * 获取视图右侧边界 x 坐标
   *
   * @param dist 向内偏移距离，大于等于 1 时为像素值，小于 1 时为屏幕宽度百分比
   */
  rightX(dist?: number): number;

  /**
   * 获取视图顶部边界 y 坐标
   *
   * @param dist 向内偏移距离，大于等于 1 时为像素值，小于 1 时为屏幕高度百分比
   */
  topY(dist?: number): number;

  /**
   * 获取视图底部边界 y 坐标
   *
   * @param dist 向内偏移距离，大于等于 1 时为像素值，小于 1 时为屏幕高度百分比
   */
  bottomY(dist?: number): number;
}

/**
 * 创建一个带有主题的场景
 *
 * @param theme 颜色主题
 * @param runner 场景执行器
 * @returns 场景生成器
 */
export function makeThemedScene(
  theme: ColorTheme,
  runner: (this: ThemedScene) => ThreadGenerator
) {
  return makeScene2D(function* (view) {
    view.fill(theme.background);
    view.fontFamily("Fira Code");

    const scene: ThemedScene = {
      view,
      theme,
      cat: createRef<Img>(),
      center() {
        return new Vector2(0, 0);
      },
      left(dist = 0) {
        return new Vector2(scene.leftX(dist), 0);
      },
      right(dist = 0) {
        return new Vector2(scene.rightX(dist), 0);
      },
      top(dist = 0) {
        return new Vector2(0, scene.topY(dist));
      },
      bottom(dist = 0) {
        return new Vector2(0, scene.bottomY(dist));
      },
      topLeft(dist = [0, 0]) {
        const d = new Vector2(dist);
        return new Vector2(scene.leftX(d.x), scene.topY(d.y));
      },
      topRight(dist = [0, 0]) {
        const d = new Vector2(dist);
        return new Vector2(scene.rightX(d.x), scene.topY(d.y));
      },
      bottomLeft(dist = [0, 0]) {
        const d = new Vector2(dist);
        return new Vector2(scene.leftX(d.x), scene.bottomY(d.y));
      },
      bottomRight(dist = [0, 0]) {
        const d = new Vector2(dist);
        return new Vector2(scene.rightX(d.x), scene.bottomY(d.y));
      },
      leftX(dist = 0) {
        if (dist < 1) {
          return scene.view.width() * (dist - 0.5);
        } else {
          return scene.view.width() / -2 + dist;
        }
      },
      rightX(dist = 0) {
        if (dist < 1) {
          return scene.view.width() * (0.5 - dist);
        } else {
          return scene.view.width() / 2 - dist;
        }
      },
      topY(dist = 0) {
        if (dist < 1) {
          return scene.view.height() * (dist - 0.5);
        } else {
          return scene.view.height() / -2 + dist;
        }
      },
      bottomY(dist = 0) {
        if (dist < 1) {
          return scene.view.height() * (0.5 - dist);
        } else {
          return scene.view.height() / 2 - dist;
        }
      },
    };

    view.add(
      <Img
        ref={scene.cat}
        src={iconPng}
        width={128}
        height={128}
        bottomLeft={scene.bottomLeft}
      />
    );

    yield* runner.call(scene);
  });
}
