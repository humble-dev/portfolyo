export function getElementOffset(
  element: HTMLElement,
): { x: number, y: number } {
  let top = 0;
  let left = 0;

  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent as HTMLElement;
  } while (element);

  return {
    x: left,
    y: top,
  };
}
