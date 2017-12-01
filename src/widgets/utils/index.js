/**
 *
 * create by ligx
 *
 * @flow
 */
export function cacheOnlyFirstCall (targetFunc: Function) {

  let containerPos;


  return {
    func (...args: any) {
      if (containerPos) {
        return containerPos;
      }

      return containerPos = targetFunc(...args);
    },
    clearCache () {
      containerPos = undefined;
    },

  };
}

export function splitStr (str: string, sepator: string = ','): Array<string> {
  if (!str || str.trim().length === 0) {
    return [];
  }
  return str.split(sepator);
}

export function getElementPosition (e: Object) {

  let x = 0, y = 0;
  while ( e ) {
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent;
  }
  return { x, y, };
}