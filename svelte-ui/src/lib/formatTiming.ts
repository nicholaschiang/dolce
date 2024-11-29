export function formatTiming(time: number) {
  return `${time.toLocaleString(undefined, { maximumFractionDigits: 2 })}ms`;
}
