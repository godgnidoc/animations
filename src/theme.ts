export interface ColorTheme {
  primary: string
  secondary: string
  background: string
  accent: string
  dimmed: string
}

const dark_colors = [
  "#d6dce5",
  "#adb9ca",
  "#8497b0",
  "#333f50",
  "#222a35"
]

export const dark: ColorTheme = {
  primary: dark_colors[0],
  secondary: dark_colors[1],
  accent: dark_colors[2],
  dimmed: dark_colors[3],
  background: dark_colors[4],
}