/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import chai from 'chai';
import 'jest-styled-components';
import Enzyme, { mount, } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestComponent, } from 'sv-test-utils';
import TreeSelect from '../';
import Trigger from '../../trigger';
import * as Widget from '../../consts/Widget';
import Theme from '../../theme';

Enzyme.configure({ adapter: new Adapter(), });

const { expect: exp, } = chai;
const rowData = [
  { key: '1', title: '1', },
  { key: '1.1', title: '1.1', pid: '1', path: '1', isLeaf: true, },
  { key: '1.2', title: '1.2', pid: '1', path: '1', },
  { key: '1.2.1', title: '1.2.1', pid: '1.2', path: '1/1.2', isLeaf: true, },
  { key: '1.2.2', title: '1.2.2', pid: '1.2', path: '1/1.2', },
  { key: '1.2.2.1', title: '1.2.2.1', pid: '1.2.2', path: '1/1.2/1.2.2', },
  { key: '1.2.2.1.1', title: '1.2.2.1.1', pid: '1.2.2.1', path: '1/1.2/1.2.2/1.2.2.1', isLeaf: true, },
  { key: '1.2.2.1.2', title: '1.2.2.1.2', pid: '1.2.2.1', path: '1/1.2/1.2.2/1.2.2.1', isLeaf: true, },
  { key: '1.2.2.2', title: '1.2.2.2', pid: '1.2.2', path: '1/1.2/1.2.2', isLeaf: true, },

  { key: '1.3', title: '1.3', pid: '1', path: '1', },
  { key: '1.3.1', title: '1.3.1', pid: '1.3', path: '1/1.3', },
  { key: '1.3.1.1', title: '1.3.1.1', pid: '1.3.1', path: '1/1.3/1.3.1', isLeaf: true, },
  { key: '1.3.1.2', title: '1.3.1.2', pid: '1.3.1', path: '1/1.3/1.3.1', isLeaf: true, },
  { key: '1.3.2', title: '1.3.2', pid: '1.3', path: '1/1.3', },
  { key: '1.3.2.1', title: '1.3.2.1', pid: '1.3.2', path: '1/1.3/1.3.2', isLeaf: true, },
  { key: '1.3.2.2', title: '1.3.2.2', pid: '1.3.2', path: '1/1.3/1.3.2', isLeaf: true, },
  { key: '1.3.3', title: '1.3.3', pid: '1.3', path: '1/1.3', isLeaf: true, },

  { key: '2', title: '2', },
  { key: '2.1', title: '2.1', pid: '2', path: '2', },
  { key: '2.1.1', title: '2.1.1', pid: '2.1', path: '2/2.1', isLeaf: true, },
  { key: '2.1.2', title: '2.1.2', pid: '2.1', path: '2/2.1', },
  { key: '2.1.2.1', title: '2.1.2.1', pid: '2.1.2', path: '2/2.1/2.1.2', isLeaf: true, },
  { key: '2.2', title: '2.2', pid: '2', path: '2', },
  { key: '2.2.1', title: '2.2.1', pid: '2.2', path: '2/2.2', },
  { key: '2.2.1.1', title: '2.2.1.1', pid: '2.2.1', path: '2/2.2/2.2.1', isLeaf: true, },
  { key: '2.2.1.2', title: '2.2.1.2', pid: '2.2.1', path: '2/2.2/2.2.1', isLeaf: true, },
  { key: '2.2.2', title: '2.2.2', pid: '2.2', path: '2/2.2', isLeaf: true, },

  { key: '3', title: '3', },
  { key: '3.1', title: '3.1', pid: '3', path: '3', isLeaf: true, },
  { key: '3.2', title: '3.2', pid: '3', path: '3', isLeaf: true, },
  { key: '4', title: '4', isLeaf: true, },
];

describe('TreeSelect', () => {
  it('输入框点击后，弹出面板', () => {
    const cmp = mount(<TreeSelect data={rowData}/>);
    cmp.children().at(0).simulate('click');
    cmp.instance().forceUpdate();
    cmp.update();
    exp(cmp.find(Trigger).length).to.be.equal(1);
  });
  it('getTheme 获取下拉树各部件的样式信息 并且 配置了组件的样式， 则组件要加上自部件的样式设置', () => {
    const styleConfig = {
      width: 500,
    };

    const expResult: Object = {
      [Widget.Tree]: styleConfig,
      [Widget.Trigger]: styleConfig,
      [Widget.InputTag]: styleConfig,
      [Widget.Input]: Object.assign({}, styleConfig, { width: styleConfig.width - 6, }),
    };

    createThemeCase(styleConfig, expResult);
  });
  it('未指定width', () => {
    const styleConfig = {};

    const expResult: Object = {
      [Widget.Tree]: {},
      [Widget.Trigger]: {},
      [Widget.InputTag]: {},
      [Widget.Input]: {},
    };

    createThemeCase(styleConfig, expResult);
  });

  function createThemeCase (styleConfig: Object, expResult: Object) {

    const config = {
        [Widget.TreeSelect]: styleConfig,
      }
    ;


    class TestDemo extends React.Component<any, any> {
      treeSelect: Object;

      render () {
        const getTreeSelect: Function = (cmp: Object) => this.treeSelect = cmp;
        return <Theme config={config}>
          <TreeSelect data={rowData} ref={getTreeSelect}/></Theme>;
      }
    }

    const Target = createTestComponent(TestDemo, target => {
      const resultTheme = target.treeSelect.target.getTheme();
      exp(resultTheme).to.be.eql(expResult);
    });
    const cmp = mount(<Target/>);
    exp(cmp.find(Widget.Theme).at(1).props().config).to.be.eql(expResult);

  }


});


