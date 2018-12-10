/**
 *
 * create by guorg
 *
 * @flow
 *
 */
export function getTruthValue(
  target: string,
  props: Object,
  state?: Object,
  defaultTarget: string
) {
  const inProps = target in props;
  const result = inProps ? props[target] : state ? state[target] : props[defaultTarget] || [];

  return result;
}
export function getSourceDataAndTargetData(data: Object[], targetKeys: string[]): Object {
  const sourceData = [],
    targetData = [],
    mapData = {},
    sourceKeys = [],
    targetCheckKeys = [],
    sourceCheckKeys = [];

  if (data && data.length > 0) {
    data.forEach(item => {
      mapData[item.value] = item;
      const inTarget = targetKeys.includes(item.value);
      if (inTarget) {
        targetData.push(item);
        if (!item.disabled) {
          targetCheckKeys.push(item.value);
        }
      } else {
        sourceData.push(item);
        sourceKeys.push(item.value);
        if (!item.disabled) {
          sourceCheckKeys.push(item.value);
        }
      }
    });
  }
  return {
    sourceData,
    targetData,
    mapData,
    sourceKeys,
    targetCheckKeys,
    sourceCheckKeys,
  };
}
export function splitSelectKeys(mapData: Object, selectKey: string[]): Object {
  const validKeys = [],
    disabledKeys = [];
  if (selectKey && selectKey.length > 0) {
    selectKey.forEach(item => {
      const disabled = mapData[item].disabled;
      if (!disabled) {
        validKeys.push(item);
      } else {
        disabledKeys.push(item);
      }
    });
  }
  return { validKeys, disabledKeys };
}
export function isContained(a: Array<any>, b: string[]) {
  if (!(a instanceof Array) || !(b instanceof Array)) return false;
  if (a.length < b.length) return false;
  const aStr = a.toString();
  for (let i = 0, len = b.length; i < len; i++) {
    if (aStr.indexOf(b[i]) === -1) return false;
  }
  return true;
}
export function getTreeData(
  data: Object[],
  targetObj: Object,
  parentKey?: string,
  parentPath?: string[]
): Object {
  if (data && data.length) {
    const { target = [], mapData = {} } = targetObj;
    data.forEach(item => {
      const { children } = item;
      const newObj = {};
      newObj.key = item.value;
      newObj.title = item.text;
      let pidArr;
      if (!parentKey) {
        newObj.pid = undefined;
        newObj.path = undefined;
        pidArr = [];
      } else {
        if (parentPath) {
          newObj.pid = parentKey;
          if (parentPath.indexOf(parentKey) === -1) {
            parentPath.push(parentKey);
          }
          pidArr = [...parentPath];
          newObj.path = pidArr.join('/');
        }
      }
      if (!children || children.length === 0) {
        newObj.isLeaf = true;
        target.push(newObj);
        mapData[item.value] = item;
      } else {
        newObj.alwaysExpanded = item.alwaysExpanded;
        target.push(newObj);
        getTreeData(children, targetObj, item.value, pidArr);
      }
    });

    return targetObj;
  }

  return { target: [], mapData: {} };
}
export function getCancelItem(value: string[], mapData: Object, displayValue?: string[]): Object[] {
  const hasValue = value && value.length;
  if (hasValue) {
    const cancelItem = [];
    if (displayValue && displayValue.length) {
      value.forEach((item, index) => {
        if (!mapData[item]) {
          cancelItem.push({ text: item, value: displayValue && displayValue[index] });
        }
      });
    }
    return cancelItem;
  }
  return [];
}
