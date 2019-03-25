import { scrollTween } from '../utils/math.util';

export function parallaxHelper(
  scrollPosition: number,
  viewportSize: number,
  elementSize: number,
  elementPosition: number,
  speed: number = 0,
  direction: 'x' | 'y' = 'y',
): { x: number, y: number } {
  const absSpeed = Math.abs(speed);

  // Just assign the speed we want to interpolate with the speed
  // given by the user. Negative values will be treated exceptionally
  const minSpeed = speed <= 0 ? absSpeed : -absSpeed;
  const maxSpeed = speed <= 0 ? -absSpeed : absSpeed;

  // If we are moving the element horizontally, we don't want to include
  // the offset for the vertical axis, since we're assuming the element
  // won't change its vertical position
  const minOffset = direction === 'x' ? 0 : minSpeed;
  const maxOffset = direction === 'x' ? 0 : maxSpeed;

  // Use the parallax helper which will calculate the current
  // Position of the element. It's just a simplified function
  // using `mapRange` to move the position into a new range
  // of nubmers
  const translation = scrollTween(
    scrollPosition,
    viewportSize,
    elementSize,
    elementPosition,
    minSpeed,
    maxSpeed,
    minOffset,
    maxOffset,
  );

  return {
    x: direction === 'x' ? translation : 0,
    y: direction === 'y' ? translation : 0,
  };
}
