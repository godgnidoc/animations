import { Circle, Line, Txt } from "@motion-canvas/2d";
import { ColorTheme } from "/src/theme";
import {
  all,
  createRef,
  createRefArray,
  Reference,
  ReferenceArray,
  ThreadGenerator,
  waitFor,
} from "@motion-canvas/core";
import { makeThemedScene, ThemedScene } from "./themed";

export interface IntroduceScene extends ThemedScene {
  divider: Reference<Line>;
  serial: Reference<Txt>;
  chapter: Reference<Txt>;
  sections: ReferenceArray<Txt>;

  /**
   * 高亮指定章节标题
   *
   * @param index 章节索引
   * @param duration 动画时长
   */
  outline(index: number, duration: number): ThreadGenerator;

  /**
   * 选择指定章节标题
   *
   * @param index 章节索引
   * @param duration 动画时长
   */
  choose(index: number, duration: number): ThreadGenerator;
}

export function makeIntroduceScene(
  theme: ColorTheme,
  serial: string,
  chapter: string,
  sections: string[],
  runner?: (this: IntroduceScene) => ThreadGenerator
) {
  return makeThemedScene(theme, function* (this: IntroduceScene) {
    this.divider = createRef<Line>();
    this.serial = createRef<Txt>();
    this.chapter = createRef<Txt>();
    this.sections = createRefArray<Txt>();

    this.view.add([
      <Line
        ref={this.divider}
        points={[this.top(0.1), this.bottom(0.1)]}
        lineWidth={2}
        stroke={theme.dimmed}
      />,
      <Txt
        ref={this.chapter}
        fill={theme.primary}
        paddingLeft={24}
        fontSize={48}
        topLeft={this.divider().topRight}
      >
        {chapter}
      </Txt>,
      <Txt
        ref={this.serial}
        fill={theme.primary}
        paddingTop={128}
        paddingRight={24}
        fontSize={64}
        bottomRight={this.chapter().bottomLeft}
      >
        {serial}
      </Txt>,
    ]);

    let above = this.chapter();
    let maxLength = above.width();
    for (const section of sections) {
      this.view.add(
        <Txt
          ref={this.sections}
          fill={theme.primary}
          paddingLeft={64}
          paddingTop={16}
          fontSize={32}
          topLeft={above.bottomLeft}
        >
          {section}
        </Txt>
      );
      const sectionTxt = this.sections[this.sections.length - 1];
      this.view.add(
        <Circle
          fill={sectionTxt.fill}
          size={16}
          position={() => sectionTxt.topLeft().add([16, 32])}
        />
      );
      if (sectionTxt.width() > maxLength) maxLength = sectionTxt.width();
      above = sectionTxt;
    }

    this.divider().x(this.rightX(maxLength + 32));

    this.outline = function (this: IntroduceScene, index, duration) {
      return this.highlight(
        [this.sections[index]],
        [this.serial, this.chapter, ...this.sections],
        duration
      );
    };

    this.choose = function* (this: IntroduceScene, index, duration) {
      const choosen = this.sections[index];

      yield* all(
        this.serial().position.y(this.topY(-1000), duration / 3),
        this.chapter().position.x(this.rightX(-1000), duration / 3),
        this.divider().position.y(
          this.bottomY(this.view.height() * 2),
          duration / 3
        ),
        ...this.view
          .findAll((n) => n instanceof Circle)
          .map((c) => this.hide(c, duration / 6)),
        ...this.sections.map((s) => {
          if (s === choosen) {
            return all(
              this.light(s, duration / 3),
              s.position(this.center, duration / 3),
              s.fontSize(128, duration / 3),
              s.padding.top(24, duration / 3),
              s.padding.left(24, duration / 3)
            );
          } else {
            return all(
              this.dim(s, duration / 3),
              s.position.x(this.rightX(-1000), duration / 3)
            );
          }
        })
      );

      yield* waitFor(duration / 3);

      yield* all(
        choosen.topLeft(this.topLeft, duration / 3),
        choosen.fontSize(32, duration / 3),
        choosen.fill(theme.secondary, duration / 3)
      );
    };

    if (runner) {
      yield* runner.call(this);
    }
  });
}
