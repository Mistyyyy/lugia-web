/**
 *
 * create by ligx
 *
 * @flow
 */
import type { ExpandInfo, NodeId2ExtendInfo, NodeId2SelectInfo, } from 'sv-widget';
import animation from '../common/openAnimation';
import * as React from 'react';
import RcTree, { TreeNode, } from './rc-tree';
import classNames from 'classnames';
import ThemeProvider from '../common/ThemeProvider';
import ThrottleScroller from '../scroller/ThrottleScroller';
import * as Widget from '../consts/Widget';
import '../css/sv.css';
import './index.css';
import TreeUtils from './utils';

const defaultHeight = 250;
const menuItemHeight = 18;
type RowData = {
  key: string,
  title: string,
  pid?: string,
  children?: Array<RowData>,
  path?: string,
  isLeaf?: boolean,
};
type TreeProps = {
  getTheme: Function,
  start: number,
  end: number,
  query: string,
  showLine?: boolean;
  className?: string;
  /** 是否支持多选 */
  multiple?: boolean;
  /** 是否自动展开父节点 */
  autoExpandParent?: boolean;
  /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
  checkStrictly?: boolean;
  /** 是否支持选中 */
  checkable?: boolean;
  /** 默认展开所有树节点 */
  expandAll: boolean;
  /** 默认展开指定的树节点 */
  defaultExpandedKeys?: Array<string>;
  /** （受控）展开指定的树节点 */
  expandedKeys?: Array<string>;
  /** （受控）选中复选框的树节点 */
  checkedKeys?: Array<string> | { checked: Array<string>, halfChecked: Array<string> };
  /** 默认选中复选框的树节点 */
  defaultCheckedKeys?: Array<string>;
  /** （受控）设置选中的树节点 */
  selectedKeys?: Array<string>;
  /** 默认选中的树节点 */
  defaultSelectedKeys?: Array<string>;
  /** 展开/收起节点时触发 */
  onExpand?: Function,
  /** 点击复选框触发 */
  onCheck?: Function,
  /** 点击树节点触发 */
  onSelect?: Function,
  /** filter some AntTreeNodes as you need. it should return true */
  filterAntTreeNode?: Function,
  /** 异步加载数据 */
  loadData?: Function,
  /** 响应右键点击 */
  onRightClick?: Function,
  /** 设置节点可拖拽（IE>8）*/
  draggable?: boolean;
  /** 开始拖拽时调用 */
  onDragStart?: Function,
  /** dragenter 触发时调用 */
  onDragEnter?: Function,
  /** dragover 触发时调用 */
  onDragOver?: Function,
  /** dragleave 触发时调用 */
  onDragLeave?: Function,
  /** drop 触发时调用 */
  onDrop?: Function,
  prefixCls?: string;
  filterTreeNode?: Function,
  children: React.Node,
  data?: Array<RowData>,
  setDataLen: Function,
};

type TreeState = {
  start: number,
  expand: ExpandInfo,
  selectedInfo: NodeId2SelectInfo,
  expandedKeys: Array<string>,
}

class KTree extends React.Component<any, any> {

  static defaultProps = {
    prefixCls: 'sv-tree',
    checkable: false,
    expandAll: false,
    showIcon: false,
    openAnimation: animation,
  };

  utils: TreeUtils;

  constructor (props) {
    super(props);
  }

  render () {
    const {
      prefixCls = Tree.defaultProps.prefixCls,
      className,
      showLine,
      checkable,
      data,
      start,
      end,
      onExpand,
      utils,
      onSelect,
    } = this.props;

    const classString = classNames({
      [`${prefixCls}-show-line`]: !!showLine,
    }, className);
    if (data) {
      const out = {};
      const { rows, parentCount, } = utils.slice(data, start, end - start, out);
      const nodes = utils.generateTreeNode(rows);
      const top = -parentCount * 17;
      const treeNodes = this.loopNode(nodes);
      return <RcTree {...this.props}
                     onSelect={onSelect}
                     style={{ position: 'relative', top: `${top}px`, }}
                     className={classString}
                     onExpand={onExpand}
                     checkable={checkable ? <span className={`${prefixCls}-checkbox-inner`}/> : checkable}>
        {treeNodes}
      </RcTree>;
    }


  }


  loopNode = (data: Array<RowData>) => data.map(item => {
    const { children, key, title, isLeaf, } = item;
    if (children !== undefined) {
      return (
        <TreeNode key={key} title={title} isLeaf={isLeaf}>
          {this.loopNode(children)}
        </TreeNode>
      );
    }
    return <TreeNode key={key} title={title} isLeaf={isLeaf}/>;
  });

}

const ThrottleTree = ThrottleScroller(KTree, menuItemHeight);

class Tree extends React.Component<TreeProps, TreeState> {

  static displayName = Widget.Tree;
  static defaultProps = {
    expandAll: false,
    prefixCls: 'sv-tree',
    checkable: false,
    showIcon: false,
    query: '',
    openAnimation: animation,
  };

  static TreeNode: TreeNode;
  utils: TreeUtils;
  queryAllUtils: TreeUtils;

  constructor (props: TreeProps) {
    super(props);
    this.createTreeUtils(props);
    this.loadData(props, true);
  }

  componentWillReceiveProps (props: TreeProps) {
    this.loadData(props);
  }

  allExpandKeys: Array<string>;

  loadData (props, init: boolean = false) {

    const expand = this.getExpandInfo(props);
    let expandedKeys;
    const { expandAll, } = this.props;
    const notFirstAndNotQueryALl = !this.isQueryAll(props) && !init;
    if (notFirstAndNotQueryALl) {
      this.createTreeQueryUtils(props);
    }

    this.getUtils(props).search(expand, props.query);

    if (this.isQueryAll(props)) {
      if (this.allExpandKeys === undefined) {
        this.allExpandKeys = this.getExpandedKeys(expandAll, expand);
      }
      expandedKeys = this.allExpandKeys;
    } else {
      expandedKeys = this.getExpandedKeys(expandAll, expand);
    }

    if (init) {
      this.state = {
        start: 0,
        expandedKeys,
        expand,
        selectedInfo: {
          checked: {},
          value: {},
          halfchecked: {},
        },
      };
    } else {
      this.setState({
        start: 0,
        expandedKeys, expand,
      }, () => {
      });
    }
  }

  getExpandedKeys (expandAll: boolean, expand: ExpandInfo): Array<string> {
    return expandAll ? Object.keys(expand.id2ExtendInfo) : [];
  }

  allExpandInfo: ExpandInfo;

  getExpandInfo (props: TreeProps): ExpandInfo {
    const empty = { id2ExtendInfo: {}, };
    if (this.isQueryAll(props)) {
      if (this.allExpandInfo === undefined) {
        this.allExpandInfo = empty;
      }
      console.info(this.allExpandInfo);
      return this.allExpandInfo;
    }
    return empty;
  }


  shouldComponentUpdate (nexProps: TreeProps, nextState: TreeState) {
    const dataChanged = nexProps.data !== this.props.data;
    if (dataChanged) {
      this.createTreeUtils(nexProps);
    }
    const needUpdate = dataChanged
      || this.props.query !== nexProps.query
      || this.state.start !== nextState.start
      || nextState.expand !== this.state.expand
      || nextState.selectedInfo !== this.state.selectedInfo;
    return needUpdate;
  }

  createTreeUtils (props: TreeProps) {
    this.createTreeQueryAllUtils(props);
    this.createTreeQueryUtils(props);
  }

  createTreeQueryUtils (props: TreeProps) {
    const { data, expandAll = false, } = props;
    if (data) {
      this.utils = new TreeUtils(data, expandAll);
    }
  }

  createTreeQueryAllUtils (props: TreeProps) {
    const { data, expandAll = false, } = props;
    if (data) {
      this.queryAllUtils = new TreeUtils(data, expandAll);
    }
  }

  getUtils (props: TreeProps) {
    if (this.isQueryAll(props)) {
      return this.queryAllUtils;
    }
    return this.utils;
  }

  isQueryAll (props: TreeProps): boolean {
    const { query, } = props;
    return (query === '');
  }

  realyDatas: Array<RowData>;

  render () {
    const {
      prefixCls = Tree.defaultProps.prefixCls,
      className,
      showLine,
      checkable,
      data,
    } = this.props;

    const classString = classNames({
      [`${prefixCls}-show-line`]: !!showLine,
    }, className);
    const { children, query, } = this.props;
    const { expand, expandedKeys, selectedInfo, start, } = this.state;
    const { checked, halfchecked, } = selectedInfo;
    if (data) {
      const utils = this.getUtils(this.props);
      this.realyDatas = utils.search(expand, query);
      return <ThrottleTree {...this.props}
                           start={start}
                           onScroller={this.onScroller}
                           onCheck={this.onCheck}
                           data={this.realyDatas}
                           showLine={showLine}
                           checkedKeys={Object.keys(checked)}
                           halfCheckedKeys={Object.keys(halfchecked)}
                           mutliple={checkable}
                           utils={utils}
                           expandedKeys={expandedKeys}
                           onExpand={this.onExpand}></ThrottleTree>;
    }
    return <RcTree {...this.props} className={classString}
                   onExpand={this.onExpand}
                   checkedKeys={Object.keys(checked)}
                   halfCheckedKeys={Object.keys(halfchecked)}
                   checkable={checkable ? <span className={`${prefixCls}-checkbox-inner`}/> : checkable}>
      {children}
    </RcTree>;

  }

  onScroller = (start: number) => {
    console.info(start, this.state.start);
    this.setState({ start, });
  };


  onCheck = (_, event) => {
    const { node, checked, } = event;
    const { props, } = node;
    const { eventKey, } = props;
    const { expand, selectedInfo, } = this.state;
    const { halfchecked, value, checked: chk, } = selectedInfo;
    const utils = this.getUtils(this.props);
    const check = halfchecked[ eventKey ] === undefined && checked ? utils.selectNode : utils.unSelectNode;
    check.bind(utils)(eventKey, selectedInfo, expand.id2ExtendInfo);
    this.setState({ selectedInfo: { ...selectedInfo, }, });
  };


  onExpand = (expandedKeys: Array<string>, rowData: { expanded: boolean, node: Object, }) => {
    const { onExpand, data = [], expandAll, } = this.props;
    const { expanded, node, } = rowData;
    const { expand, } = this.state;


    const noeKey = node.props.eventKey;

    const { id2ExtendInfo, } = expand;
    const utils = this.getUtils(this.props);
    if (expanded) {
      utils.expandNode(noeKey, id2ExtendInfo);
    } else {
      utils.colapseNode(noeKey, id2ExtendInfo);
    }
    if (this.isQueryAll(this.props)) {
      this.allExpandKeys = expandedKeys;
    }
    this.setState({ expand: Object.assign({}, this.state.expand, { id2ExtendInfo, }), expandedKeys, });
    onExpand && onExpand(expandedKeys, data);
  };


  loopNode = (data: Array<RowData>) => data.map(item => {
    const { children, key, title, isLeaf, } = item;
    if (children !== undefined) {
      return (
        <TreeNode key={key} title={title} isLeaf={isLeaf}>
          {this.loopNode(children)}
        </TreeNode>
      );
    }
    return <TreeNode key={key} title={title} isLeaf={isLeaf}/>;
  });
}

const SvTree = ThemeProvider(Tree, Widget.Tree);

export default SvTree;
Tree.TreeNode = TreeNode;
