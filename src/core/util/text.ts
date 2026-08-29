/** Kürzt für Kartenbeschriftungen. */
export function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`
}

export function firstLine(text: string, max = 48): string {
  return clip(text.split('\n')[0] ?? '', max)
}
