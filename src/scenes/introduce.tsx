import { Circle, Line, Txt } from "@motion-canvas/2d";
import { ColorTheme } from "/src/theme";
import {
  all,
  createRef,
  Reference,
  ThreadGenerator,
} from "@motion-canvas/core";
import { makeThemedScene, ThemedScene } from "./themed";

export interface IntroduceScene extends ThemedScene {
  divider: Reference<Line>;
  serial: Reference<Txt>;
  chapter: Reference<Txt>;
  sections: Reference<Txt>[];

  highlight(index: number): ThreadGenerator;
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
    this.sections = [];

    this.view.add([
      <Line
        ref={this.divider}
        points={[this.top(0.1), this.bottom(0.1)]}
        lineWidth={4}
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

    let above = this.chapter;
    let maxLength = above().width();
    for (const section of sections) {
      const sectionTxt = createRef<Txt>();
      this.view.add([
        <Txt
          ref={sectionTxt}
          fill={theme.primary}
          paddingLeft={64}
          paddingTop={16}
          fontSize={32}
          topLeft={above().bottomLeft}
        >
          {section}
        </Txt>,
        <Circle
          fill={sectionTxt().fill}
          size={16}
          position={() => sectionTxt().topLeft().add([16, 32])}
        />,
      ]);
      if (sectionTxt().width() > maxLength) maxLength = sectionTxt().width();
      this.sections.push(sectionTxt);
      above = sectionTxt;
    }

    this.divider().x(this.rightX(maxLength + 32));

    this.highlight = function* (this: IntroduceScene, index: number) {
      yield* all(
        this.serial().fill(this.serial().fill(), 0).to(theme.dimmed, 0.8),
        this.chapter().fill(this.chapter().fill(), 0).to(theme.dimmed, 0.8),
        ...this.sections.map((s, i) => {
          if (i === index) {
            return s().fill(s().fill(), 0).to(theme.primary, 0.8);
          } else {
            return s().fill(s().fill(), 0).to(theme.dimmed, 0.8);
          }
        })
      );
    };

    if (runner) {
      yield* runner.call(this);
    }
  });
}
