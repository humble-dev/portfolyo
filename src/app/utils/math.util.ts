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

export function scrollTween(
  scrollPosition: number,
  viewportSize: number,
  elementSize: number,
  elementPosition: number,
  minValue: number,
  maxValue: number,
  minOffset: number = minValue,
  maxOffset: number = maxValue,
): number {
  let inStart = elementPosition - viewportSize + minOffset;
  const inEnd = elementPosition + elementSize + maxOffset;

  if (elementPosition < viewportSize) {
    inStart = 0;
    minValue = 0;
  }

  return clamp(
    mapRange(
      scrollPosition,
      inStart,
      inEnd,
      minValue,
      maxValue,
    ),
    Math.min(minValue, maxValue),
    Math.max(maxValue, minValue),
  );
}
