

export function cloneCrop (c) {
  const [zoom, center] = c;
  const [ x, y ] = center;
  return [ zoom, [ x, y ]];
}
export function cloneValue (v) {
  return {
    from: cloneCrop(v.from),
    to: cloneCrop(v.to)
  };
}

export function centerEquals (a, b) {
  return !a && !b || a && b && a[0]===b[0] && a[1]===b[1];
}

export function rectGrow (rect, size) {
  return [
    rect[0] - size[0], rect[1] - size[1],
    rect[2] + 2 * size[0], rect[3] + 2 * size[1] ];
}

export function rectRound (rect) {
  return [
    Math.round(rect[0]),
    Math.round(rect[1]),
    Math.round(rect[2]),
    Math.round(rect[3])
  ];
}

export function rectEquals (a, b) {
  return !a && !b || a && b && a[0]===b[0] && a[1]===b[1] && a[2]===b[2] && a[3]===b[3];
}

export function rectContains (rect, point) {
  return rect[0] <= point[0] &&
         point[0] <= rect[0]+rect[2] &&
         rect[1] <= point[1] &&
         point[1] <= rect[1]+rect[3] ;
}

export function dot (a, b) {
  return [ a[0] * b[0], a[1] * b[1] ];
}

export function distance (a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx*dx+dy*dy);
}

export function manhattan (a, b) {
  return Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
}
