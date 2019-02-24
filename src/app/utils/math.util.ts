export function mapRange(
  value: number,
  inStart: number,
  inEnd: number,
  outMin: number,
  outMax: number,
): number {
  return outMin + (outMax - outMin) / (inEnd - inStart) * (value - inStart);
}

export function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(Math.max(value, min), max);
}

export function parallax(
  scrollPosition: number,
  viewportSize: number,
  elementSize: number,
  elementPosition: number,
  minValue: number,
  maxValue: number,
  minOffset: number = minValue,
  maxOffset: number = maxValue,
): number {
  const inStart = Math.max(elementPosition - viewportSize + minOffset, 0);
  const inEnd = elementPosition + elementSize + maxOffset;

  return clamp(
    mapRange(
      scrollPosition,
      inStart,
      inEnd,
      inStart === 0 ? 0 : minValue,
      maxValue,
    ),
    Math.min(minValue, maxValue),
    Math.max(maxValue, minValue),
  );
}
