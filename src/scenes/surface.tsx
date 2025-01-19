import { Txt } from "@motion-canvas/2d";
import { ColorTheme } from "/src/theme";
import {
  all,
  createRef,
  DEFAULT,
  Reference,
  ThreadGenerator,
} from "@motion-canvas/core";
import { makeThemedScene, ThemedScene } from "./themed";

export interface SurfaceScene extends ThemedScene {
  serial: Reference<Txt>;
  chapter: Reference<Txt>;
  power: Reference<Txt>;

  leave(): ThreadGenerator;
}

export function makeSurfaceScene(
  theme: ColorTheme,
  serial: string,
  chapter: string,
  runner?: (this: SurfaceScene) => ThreadGenerator
) {
  return makeThemedScene(theme, function* (this: SurfaceScene) {
    this.serial = createRef<Txt>();
    this.chapter = createRef<Txt>();
    this.power = createRef<Txt>();
    this.leave = function* (this: SurfaceScene) {
      yield* all(
        this.serial().position.x(DEFAULT, 0).to(this.view.width(), 0.4),
        this.power().position.x(DEFAULT, 0).to(-this.view.width(), 0.4)
      );
    };

    this.view.add([
      <Txt ref={this.serial} fill={theme.primary} fontSize={128}>
        {serial}
      </Txt>,
      <Txt
        ref={this.chapter}
        fill={theme.primary}
        fontSize={48}
        topRight={this.serial().bottomRight}
      >
        {"————" + chapter}
      </Txt>,
      <Txt
        ref={this.power}
        fill={theme.secondary}
        fontSize={24}
        bottom={() => this.bottom(64)}
      >
        {"Powered by "}
        <Txt fill={theme.accent}>{"GodGnidoc"}</Txt>
      </Txt>,
    ]);

    if (runner) {
      yield* runner.call(this);
    }
  });
}
