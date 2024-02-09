export function strSlicer(
  str: string,
  start = 0,
  end = 32,
  suffix = "..."
): string {
  return str.slice(start, end) + suffix;
}
