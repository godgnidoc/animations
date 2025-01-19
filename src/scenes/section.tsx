import { Txt } from "@motion-canvas/2d";
import { ColorTheme } from "/src/theme";
import {
  createRef,
  Reference,
  ThreadGenerator,
} from "@motion-canvas/core";
import { makeThemedScene, ThemedScene } from "./themed";

export interface SectionScene extends ThemedScene {
  title: Reference<Txt>;
}

export function makeSectionScene(
  theme: ColorTheme,
  title: string,
  runner?: (this: SectionScene) => ThreadGenerator
) {
  return makeThemedScene(theme, function* (this: SectionScene) {
    this.title = createRef<Txt>();

    this.view.add(
      <Txt
        ref={this.title}
        fill={theme.secondary}
        paddingLeft={24}
        paddingTop={24}
        fontSize={32}
        topLeft={this.topLeft}
      >
        {title}
      </Txt>
    );

    if (runner) {
      yield* runner.call(this);
    }
  });
}
