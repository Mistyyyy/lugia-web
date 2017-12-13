/**
 *
 * create by ligx
 *
 * @flow
 */
import '../common/shirm';

import React from 'react';
import InputTag from '../inputtag';
import Input from '../input';
import Trigger from '../trigger';
import Tree from '../tree';
import Theme from '../theme';
import '../css/sv.css';
import 'babel-polyfill';
import * as Widget from '../consts/Widget';
import ThemeProvider from '../common/ThemeProvider';
import styled from 'styled-components';
import Support from '../common/FormFieldWidgetSupport';
import AddIcon from '../icon/AddIcon';
import Refresh from '../icon/RefreshIcon';
import CheckIcon from '../icon/CheckIcon';
import ClearIcon from '../icon/ClearIcon';
import { FontSize, } from '../css';
import QueryInput, { QueryInputPadding, } from '../common/QueryInputContainer';

type TreeSelectProps = {
  data: Array<Object>,
  getTheme: Function,
  value?: Array<string>,
  displayValue?: Array<string>,
  svThemVersion?: number;
  onRefresh?: Function,
  displayField: string,
  defaultValue?: string,
  mutliple: boolean,
  onlySelectLeaf: boolean,
  igronSelectField?: string,
  onTrigger?: Function,
  onChange?: Function,
  onSelect?: Function,

  splitQuery?: string,
  onQuery?: Function,
  mode: 'local' | 'remote',
  throttle: number,
  limitCount: number,
  canInput: boolean,
  disabled: boolean,
  placeholder?: string,
  defaultDisplayValue?: string,
};
type TreeSelectState = {
  open: boolean,
  treeFilter: string,
  value: Array<string>,
  displayValue: Array<string>,
  query: string,
  selectAll: boolean,
  current: number,
  selectCount: number,
  end: number,
  start: number,
};
const SelectedIcon = 'SelectedIcon';
const Text = styled.span`
  color: white;
  font-size: ${FontSize};
  width: 100%;
  background: #108ee9;
  padding: 0.1rem;
  position: absolute;
  border-radius: 3px;
`;

const DefaultLimitCount = 999999;

class TreeSelect extends React.Component<TreeSelectProps, TreeSelectState> {
  static defaultProps = {
    getTheme () {
      return {};
    },
    mutliple: false,
    onlySelectLeaf: false,
    canInput: false,
    displayField: 'title',
    mode: 'local',
    throttle: 200,
    disabled: false,
  };

  state: TreeSelectState;
  inputTag: Object;
  treeTriger: Object;
  oldValue: string;
  treeVisible: boolean;
  treeCmp: Object;
  queryInput: Object;
  queryHandle: number;

  constructor (props: TreeSelectProps) {
    super(props);
    const { value, displayValue, } = this.getInitValue(props);
    this.state = {
      open: false,
      query: '',
      treeFilter: '',
      value,
      displayValue,
      selectCount: 0,
      current: -1,
      end: 0,
      start: 0,
      selectAll: false,
    };
    this.changeOldValue(value);
    this.treeVisible = false;
  }

  getInitValue (props: TreeSelectProps) {
    const { value, displayValue, } = Support.getCodeItemArray(props);
    return { value, displayValue: displayValue && displayValue.length > 0 ? displayValue : [...value,], };
  }

  shouldComponentUpdate (nexProps: TreeSelectProps, nextState: TreeSelectState) {
    const { props, } = this;
    const dataChanged = props.data !== nexProps.data;
    if (dataChanged === true) {
      return true;
    }
    const { state, } = this;
    return state.query !== nextState.query ||
      state.current !== nextState.current ||
      state.treeFilter !== nextState.treeFilter ||
      state.start !== nextState.start ||
      state.selectAll !== nextState.selectAll ||
      props.disabled !== nexProps.disabled ||
      props.mutliple !== nexProps.mutliple ||
      props.svThemVersion !== nexProps.svThemVersion ||
      state.selectCount !== nextState.selectCount ||
      state.value !== nextState.value ||
      state.displayValue !== nextState.displayValue;
  }

  componentWillReceiveProps (props: TreeSelectProps) {
    if (!Support.isNotLimit(props)) {

      if (props.value !== this.props.value || props.displayValue !== this.props.displayValue) {
        const { value, displayValue, } = this.getInitValue(props);
        this.setState({ value, displayValue, });
      }
    }
  }

  render () {
    const { props, state, } = this;
    const { data, placeholder, } = props;
    const { query, value, displayValue, selectCount, treeFilter, current, start, } = state;
    const getTree: Function = (cmp: Object) => {
      this.treeCmp = cmp;
    };
    const getQueryInput: Function = (cmp: Object) => {
      this.queryInput = cmp;
    };
    const tree = [<QueryInput key="queryContainer"><Input key="queryInput" ref={getQueryInput} placeholder="输入查询条件"
                                                           value={query}
                                                           onChange={this.onQueryInputChange}
                                                           suffix={this.getSuffix()}
                                                           onKeyDown={this.onQueryInputKeyDown}/></QueryInput>,
      <Tree data={data}
            key="tree"
            {...props}
            className="sv"
            current={current}
            start={start}
            onScroller={this.onScroller}
            query={treeFilter}
            ref={getTree}
            value={value}
            onChange={this.onTreeChange}
            displayValue={displayValue}>
      </Tree>,];

    if (this.isMutliple()) {
      let str = `已选择${selectCount}个结点`;
      const { limitCount, } = props;
      if (limitCount != undefined) {
        str += `,最多可选${limitCount}个结点`;
      }
      tree.push(<Text key="selInfo">{str}.</Text>);
    }

    const getTreeTriger: Function = (cmp: Object) => {
      this.treeTriger = cmp;
    };
    const getInputTag: Function = (cmp: Object) => {
      this.inputTag = cmp;
    };
    const { disabled, } = this.props;
    return <Theme config={this.getTheme()} key="treesel_theme">
      <Trigger popup={tree}
               onPopupVisibleChange={this.onTreePopupVisibleChange}
               align="bottomLeft"
               key="trigger"
               ref={getTreeTriger}
               action={disabled ? [] : ['click',]}
               hideAction={['click',]}>
        <InputTag key="inputtag"
                  onFocus={this.onFocus}
                  disabled={disabled}
                  value={value} displayValue={displayValue} onChange={this.onInputTagChange}
                  mutliple={this.isMutliple()}
                  placeholder={placeholder}
                  ref={getInputTag}
                  onPopupVisibleChange={this.onInputTagPopupVisibleChange}/>
      </Trigger>
    </Theme>;
  }

  onFocus = () => {

  };

  getSuffix = () => {
    const result = [];
    if (this.isCanInput()) {
      result.push(<AddIcon key="add" onClick={this.onAdd} viewClass={SelectedIcon}></AddIcon>);
    }
    if (this.isMutliple()) {
      result.push(<CheckIcon checked={this.state.selectAll} key="selAll" onClick={this.onSelectAll}
                             viewClass={SelectedIcon}></CheckIcon>);
    }
    result.push(<Refresh key="refresh" onClick={this.onRefresh} viewClass={SelectedIcon}></Refresh>);
    result.push(<ClearIcon key="clear" onClick={this.onClearQuery} viewClass={SelectedIcon}></ClearIcon>);
    return result;
  };
  onClearQuery = () => {
    this.setState({
      query: '',
      treeFilter: '',
    });
  };
  onRefresh = () => {
    const { props, } = this;
    if (Support.isNotLimit(props)) {
      this.setValue([], [], {
        query: '',
        treeFilter: '',
        start: 0,
      });
    }
    this.setState({ query: '', treeFilter: '', start: 0, });
    const { onRefresh, } = props;
    onRefresh && onRefresh();
  };

  isMutliple () {
    const { mutliple, } = this.props;
    return mutliple;
  }

  isCanInput () {
    const { canInput, } = this.props;
    return canInput;
  }

  onQueryInputKeyDown = (e: Object) => {
    const isEnter = e.keyCode === 13;
    if (isEnter) {
      this.appendValue();
    }
    const isDown = e.keyCode === 40;
    if (isDown) {
      this.setState({ current: Math.min(this.state.current + 1, this.getViewData().length - 1), });
    }
    const isUp = e.keyCode === 38;
    if (isUp) {
      this.setState({ current: Math.max(this.state.current - 1, 0), });
    }
    const isLeft = e.keyCode === 37;
    const tree = this.getTree();
    if (!tree) {
      return;
    }
    const currentRow = this.getCurrentRow();
    if (!currentRow) {
      return;
    }
    const { key, isLeaf = false, } = currentRow;

    if (isLeft) {
      if (isLeaf) {
        return;
      }
      tree.collapse(key);
    }
    const isRight = e.keyCode === 39;
    if (isRight) {
      tree.expand(key);
    }
    const isShift = e.keyCode === 16;
    const isCtrl = e.keyCode === 17;
    if (isShift || isCtrl) {
      if (this.isMutliple()) {
        tree.check(key, !tree.isChecked(key), isShift);
      } else {
        tree.select([key,]);
      }
    }
  };

  getCurrentRow (): Object | null {
    const data = this.getTree().getViewData();
    if (data && data[ this.state.current ]) {
      return data[ this.state.current ];
    }
    return null;
  }

  onAdd = () => {
    this.appendValue();
  };

  appendValue () {
    const inputValue = this.state.query;
    if (inputValue && inputValue.trim() && this.isCanInput() && !this.isLimit()) {
      clearTimeout(this.queryHandle);
      if (this.isMutliple()) {
        const { value = [], displayValue = [], } = this.state;

        // TODO:存在问题
        value.push(inputValue);
        displayValue.push(inputValue);
        this.setValue([...value,], [...displayValue,], {
          query: '',
          treeFilter: '',
        });
      } else {
        this.setValue([inputValue,], [inputValue,], {
          query: '',
          treeFilter: '',
        });
      }
    }
  }

  isLimit (): boolean {
    const { limitCount = DefaultLimitCount, } = this.props;
    return this.state.value.length >= limitCount;
  }

  componentDidUpdate () {
    this.setState({ selectAll: this.isSelectAll(), });
  }

  onSelectAll = () => {

    const selectAll = !this.isSelectAll();
    const { onSelect, } = this.props;
    if (selectAll === true) {
      const { displayField, } = this.props;
      const data = this.getQueryData();
      const { value, displayValue, } = this.state;
      let cnt = 0;

      let { limitCount = DefaultLimitCount, } = this.props;
      const notInTreeCount = Object.keys(this.getNotInTree()).length;
      limitCount = limitCount - notInTreeCount;

      for (let i = 0; i < data.length; i++) {
        const { key, [ displayField ]: title, } = data[ i ];
        if (cnt >= limitCount) break;
        if (!this.canSelect(key)) continue;
        value.push(key);
        displayValue.push(title);
        cnt++;
      }
      onSelect && onSelect({ value, displayValue, });
      this.setValue(value, displayValue, {});
    } else {
      //TODO: 这里修改了getInputTagValueObject方法的值.
      const valueObj = this.getInputTagValueObject();
      const items = this.getQueryData();
      const len = items.length;
      for (let i = 0; i < len; i++) {
        const { key, } = items[ i ];
        const item = valueObj[ key ];
        if (item) {
          delete valueObj[ key ];
        }
      }
      const valArray = Object.keys(valueObj);
      const dispArray = [];
      for (let i = 0; i < valArray.length; i++) {
        dispArray.push(valueObj[ valArray[ i ] ].text);
      }
      onSelect && onSelect({ value: [], displayValue: [], });
      this.setValue(valArray, dispArray, {});
    }
  };

  canSelect (row: Object): boolean {
    const tree = this.getTree();
    return tree && tree.canSelect(row);
  }

  getNotInTree (): Object {
    const tree = this.getTree();
    if (!tree) {
      return {};
    }
    return tree.getNotInTree();
  }

  getViewData (): Array<Object> {
    if (this.treeCompontIsEmpty()) {
      return [];
    }
    return this.getTree().getViewData();
  }

  getQueryData (): Array<Object> {
    if (this.treeCompontIsEmpty()) {
      return [];
    }
    return this.getTree().getQueryData();
  }

  getTree () {
    return this.treeCmp.getThemeTarget();
  }

  isSelectAll (): boolean {
    if (this.treeCompontIsEmpty()) {
      return false;
    }
    return this.getTree().isSelectAll();
  }

  treeCompontIsEmpty () {
    return !this.treeCmp || !this.treeCmp.getThemeTarget();
  }

  onQueryInputChange = value => {
    if (value === this.state.query) {
      return;
    }
    if (this.queryHandle) {
      clearTimeout(this.queryHandle);
    }

    this.setState({ query: value, });
    const callback = () => {
      const { onQuery, mode, } = this.props;
      onQuery && onQuery(value);
      if (mode === 'local') {
        this.setState({ treeFilter: value, });
      } else {
        this.setState({ treeFilter: '', });
      }
    };

    const { throttle = -1, } = this.props;
    if (throttle > 0) {
      this.queryHandle = setTimeout(callback, throttle);
    } else {
      callback();
    }
  };

  onInputTagPopupVisibleChange = (visible: boolean) => {
    if (visible) {
      this.setTreePopupVisible(false);
    }
  };

  onTreePopupVisibleChange = (visible: boolean) => {
    const { state, } = this;
    const { value, } = state;
    if (visible) {
      const { onTrigger, } = this.props;
      onTrigger && onTrigger();
      let { selectCount, } = state;
      this.changeOldValue(value);
      if (this.isMutliple()) {
        selectCount = this.getInputTagCount();
      }
      this.setState({ query: '', treeFilter: '', selectCount, }, () => {
        if (this.queryInput && this.queryInput.getThemeTarget()) {
          this.queryInput.getThemeTarget().focus();
        }
      });
    } else {
      this.onChange();
      this.changeOldValue(value);
    }
    this.treeVisible = visible;
  };

  onInputTagChange = ({ value, displayValue, }: Object) => {
    this.setValue(value, displayValue, {}, () => {
      if (this.treeVisible === false) {
        this.onChange();
      }
    });
  };

  getInputTagCount (): number {

    const inputTag = this.getInputTag();
    if (!inputTag) {
      return 0;
    }
    return inputTag.getCount();
  }

  getInputTagValueObject (): Object {
    const inputTag = this.getInputTag();
    if (!inputTag) {
      return {};
    }
    return inputTag.getValueObject();
  }

  getInputTag () {
    if (!this.inputTag) {
      return null;
    }
    return this.inputTag.getThemeTarget();
  }

  onTreeChange = (value: Array<string>, displayValue: Array<string>) => {
    const { onSelect, } = this.props;
    onSelect && onSelect({ value, displayValue, });
    this.setValue(value, displayValue, {}, () => {
      if (!this.isMutliple()) {
        this.setTreePopupVisible(false);
      }
    });
  };

  setValue (value: Array<string>, displayValue: Array<string>, other: Object, callback = () => {}) {
    const realyVal = [];
    const realDisp = [];
    if (value && value.length > 0) {
      const len = value.length;
      const isHas = {};
      for (let i = 0; i < len; i++) {
        const key = value[ i ];
        const title = displayValue[ i ];
        if (isHas[ key ]) {
          continue;
        }
        isHas[ key ] = true;
        realyVal.push(key);
        realDisp.push(title);
      }
    }
    this.setState({
      value: realyVal,
      displayValue: realDisp, ...other,
      selectCount: realyVal.length,
    }, callback);
  }

  setTreePopupVisible (visible: boolean) {
    if (this.treeTriger && this.treeTriger.getThemeTarget()) {
      this.treeTriger.getThemeTarget().setPopupVisible(visible);
    }
  }

  onChange = () => {
    if (this.oldValue !== this.state.value) {
      const { onChange, } = this.props;
      const { value, displayValue, } = this.state;
      onChange && onChange({ value, displayValue, });
    }
  };

  getRows (valArray: Array<any> = []): Array<Object> {
    if (!valArray || valArray.length <= 0) {
      return [];
    }
    const tree = this.getTree();
    if (!tree) {
      return [];
    }
    return tree.getRows(valArray);
  }

  changeOldValue (value: any) {
    this.oldValue = value;
  }

  getTheme (): Object {
    const { getTheme = () => ({}), } = this.props;
    const theme = getTheme();
    const { width, } = theme;
    const queryInputConfig = {};
    if (width) {
      queryInputConfig.width = width - 2 * QueryInputPadding;
    }
    return {
      [ Widget.Tree ]: theme,
      [ Widget.Trigger ]: theme,
      [ Widget.InputTag ]: theme,
      [ SelectedIcon ]: { color: '#d9d9d9', hoverColor: '#108ee9', },
      [ Widget.Input ]: Object.assign({}, theme, queryInputConfig),
    };
  }

  onScroller = (start: number) => {
    this.setState({ start, });
  };

  componentDidCatch () {
    this.setState({ start: 0, });
  }
}

export default ThemeProvider(TreeSelect, Widget.TreeSelect);
