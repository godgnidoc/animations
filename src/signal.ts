import { SignalValue } from "@motion-canvas/core"

export function $<TValue>(signalValue: SignalValue<TValue>): TValue {
  if (typeof signalValue === "function") {
    return (signalValue as Function)()
  }
  return signalValue
}