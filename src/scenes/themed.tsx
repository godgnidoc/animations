import {
  Img,
  Latex,
  makeScene2D,
  Node,
  Shape,
  Txt,
  View2D,
} from "@motion-canvas/2d";
import { ColorTheme, Transparent } from "/src/theme";
import {
  all,
  createRef,
  PossibleVector2,
  Reference,
  SignalValue,
  ThreadGenerator,
  Vector2,
} from "@motion-canvas/core";

import iconPng from "/images/icon.png";
import { $ } from "../signal";

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

  /**
   * 将一个节点点亮
   *
   * 递归处理全部子节点，对文本节点点亮 Fill，对其它节点点亮 Stroke
   *
   * @param node 要点亮的节点
   * @param duration 动画时长
   */
  light(node: SignalValue<Node>, duration: number): ThreadGenerator;

  /**
   * 将一个节点点亮，不带动画
   *
   * @param node 要点亮的节点
   */
  light(node: SignalValue<Node>): void;

  /**
   * 强调一个节点
   *
   * 递归处理全部子节点，对文本节点强调 Fill，对其它节点强调 Stroke
   *
   * @param node 要强调的节点
   * @param duration 动画时长
   */
  accent(node: SignalValue<Node>, duration?: number): ThreadGenerator;

  /**
   * 强调一个节点，不带动画
   *
   * @param node 要强调的节点
   */
  accent(node: SignalValue<Node>): void;

  /**
   * 将一个节点变暗
   *
   * 递归处理全部子节点，对文本节点变暗 Fill，对其它节点变暗 Stroke
   *
   * @param node 要变暗的节点
   * @param duration 动画时长
   */
  dim(node: SignalValue<Node>, duration?: number): ThreadGenerator;

  /**
   * 将一个节点变暗，不带动画
   *
   * @param node 要变暗的节点
   */
  dim(node: SignalValue<Node>): void;

  /**
   * 隐藏一个节点
   *
   * 递归处理全部子节点， 将节点的全部属性变为透明
   *
   * @param node 要隐藏的节点
   * @param duration 动画时长
   */
  hide(node: SignalValue<Node>, duration?: number): ThreadGenerator;

  /**
   * 隐藏一个节点，不带动画
   *
   * @param node 要隐藏的节点
   */
  hide(node: SignalValue<Node>): void;

  /**
   * 高亮一组节点，将这一组节点的其它兄弟节点变暗
   *
   * @param nodes 要高亮的节点
   * @param from 要高亮的节点的兄弟节点
   * @param duration 动画时长
   */
  highlight(
    nodes: SignalValue<Node>[],
    from: SignalValue<Node>[],
    duration: number
  ): ThreadGenerator;

  /**
   * 高亮一组节点，将这一组节点的其它兄弟节点变暗
   *
   * @param nodes 要高亮的节点
   * @param from 要高亮的节点的兄弟节点
   */
  highlight(nodes: SignalValue<Node>[], from: SignalValue<Node>[]): void;
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
        if (dist < 1 && dist > 0) {
          return scene.view.width() * (dist - 0.5);
        } else {
          return scene.view.width() / -2 + dist;
        }
      },
      rightX(dist = 0) {
        if (dist < 1 && dist > 0) {
          return scene.view.width() * (0.5 - dist);
        } else {
          return scene.view.width() / 2 - dist;
        }
      },
      topY(dist = 0) {
        if (dist < 1 && dist > 0) {
          return scene.view.height() * (dist - 0.5);
        } else {
          return scene.view.height() / -2 + dist;
        }
      },
      bottomY(dist = 0) {
        if (dist < 1 && dist > 0) {
          return scene.view.height() * (0.5 - dist);
        } else {
          return scene.view.height() / 2 - dist;
        }
      },
      light(node, duration?) {
        node = $(node);
        const { shape, txt } = collect(node);

        if (typeof duration === "number") {
          return all(
            ...shape.map((n) => n.stroke(theme.primary, duration)),
            ...shape.map((n) => n.fill(Transparent, duration)),
            ...txt.map((n) => n.stroke(Transparent, duration)),
            ...txt.map((n) => n.fill(theme.primary, duration))
          );
        } else {
          shape.map((n) => n.stroke(theme.primary));
          shape.map((n) => n.fill(Transparent));
          txt.map((n) => n.stroke(Transparent));
          txt.map((n) => n.fill(theme.primary));
        }
      },
      accent(node, duration?) {
        node = $(node);
        const { shape, txt } = collect(node);

        if (typeof duration === "number") {
          return all(
            ...shape.map((n) => n.stroke(theme.accent, duration)),
            ...shape.map((n) => n.fill(theme.accent, duration)),
            ...txt.map((n) => n.stroke(Transparent, duration)),
            ...txt.map((n) => n.fill(theme.primary, duration))
          );
        } else {
          shape.map((n) => n.stroke(theme.accent));
          shape.map((n) => n.fill(theme.accent));
          txt.map((n) => n.stroke(Transparent));
          txt.map((n) => n.fill(theme.primary));
        }
      },
      dim(node, duration?) {
        node = $(node);
        const { shape, txt } = collect(node);

        if (typeof duration === "number") {
          return all(
            ...shape.map((n) => n.stroke(theme.dimmed, duration)),
            ...shape.map((n) => n.fill(Transparent, duration)),
            ...txt.map((n) => n.stroke(Transparent, duration)),
            ...txt.map((n) => n.fill(theme.dimmed, duration))
          );
        } else {
          shape.map((n) => n.stroke(theme.dimmed));
          shape.map((n) => n.fill(Transparent));
          txt.map((n) => n.stroke(Transparent));
          txt.map((n) => n.fill(theme.dimmed));
        }
      },
      hide(node, duration?) {
        node = $(node);
        const { shape, txt } = collect(node);

        if (typeof duration === "number") {
          return all(
            ...shape.map((n) => n.stroke(Transparent, duration)),
            ...shape.map((n) => n.fill(Transparent, duration)),
            ...txt.map((n) => n.stroke(Transparent, duration)),
            ...txt.map((n) => n.fill(Transparent, duration))
          );
        } else {
          shape.map((n) => n.stroke(Transparent));
          shape.map((n) => n.fill(Transparent));
          txt.map((n) => n.stroke(Transparent));
          txt.map((n) => n.fill(Transparent));
        }
      },
      highlight(nodes, from, duration?) {
        if (typeof duration === "number") {
          return all(
            ...from.map((n) =>
              nodes.includes(n)
                ? scene.light(n, duration)
                : scene.dim(n, duration)
            )
          );
        } else {
          from.map((n) => (nodes.includes(n) ? scene.light(n) : scene.dim(n)));
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

function collect(node: Node) {
  const shape: Shape[] = [];
  const txt: (Txt | Latex)[] = [];

  if (node instanceof Txt || node instanceof Latex) {
    txt.push(node);
  } else {
    if (node instanceof Shape) shape.push(node);
    for (const child of node.children()) {
      const recursive = collect(child);
      shape.push(...recursive.shape);
      txt.push(...recursive.txt);
    }
  }

  return { shape, txt };
}
