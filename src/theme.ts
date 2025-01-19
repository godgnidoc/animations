/**
 * 颜色主题
 */
export interface ColorTheme {
  /**
   * 主要文本色
   */
  primary: string

  /**
   * 次要文本色
   */
  secondary: string

  /**
   * 背景色
   */
  background: string

  /**
   * 强调色
   */
  accent: string

  /**
   * 淡化色
   */
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

export const Transparent = '#0000'