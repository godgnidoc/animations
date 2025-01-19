import { initial, signal, Txt, TxtProps } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";

export interface TitleProps extends TxtProps {
  level?: SignalValue<number>;
}

export class Title extends Txt {
  @signal()
  @initial(1)
  public declare readonly level: SimpleSignal<number, this>;

  constructor(props: TitleProps) {
    super(props);

    this.fontSize(() => 52 - 4 * (this.level() - 1));
  }
}
