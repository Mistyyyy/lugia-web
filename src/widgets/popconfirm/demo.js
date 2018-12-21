/**
 *
 * create by liangguodong on 2018/12/5
 *
 * @flow
 */
import * as React from 'react';
import Direction from '../button';
import Icon from '../icon';
import Switch from '../switch';
import notification from '../notification';
import styled from 'styled-components';
import Popconfirm from './popconfirm';
import Input from '../input/index';

const Wrapper = styled.div`
  margin: 100px;
`;
const IconWrapper = styled.div`
  border-radius: 50%;
  width: 14px;
  height: 14px;
`;
const HintIcon: Object = styled(Icon)`
  color: white;
`;
export class Condition extends React.Component<any, any> {
  state = {
    visible: false,
    condition: true,
  };

  changeCondition = (value: Object) => {
    const condition = value.oldValue === true;
    this.setState({ condition });
  };

  confirm = () => {
    this.setState({ visible: false });
    notification.success({ title: '操作成功 ' });
  };

  cancel = () => {
    this.setState({ visible: false });
    notification.error({ title: '取消操作' });
  };

  handleVisibleChange = (visible: Object) => {
    if (!visible) {
      this.setState({ visible });
      return;
    }
    if (this.state.condition === true) {
      this.confirm();
    } else {
      this.setState({ visible });
    }
  };

  render() {
    return (
      <div style={{ margin: 20 }}>
        <p> 触发弹出框</p>
        <Switch defaultChecked onChange={this.changeCondition} />
        <Popconfirm
          title="确定要删除吗?"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
          onConfirm={this.confirm}
          onCancel={this.cancel}
          okText="确定"
          cancelText="取消"
        >
          <Direction>删除任务</Direction>
        </Popconfirm>
      </div>
    );
  }
}

export const WrapperDemo = () => {
  const text = '确定删除这个选项吗?';
  return (
    <Wrapper>
      <div style={{ marginLeft: 50, whiteSpace: 'nowrap' }}>
        <Popconfirm placement="topLeft" title={text} action={'click'}>
          <Direction>TL</Direction>
        </Popconfirm>
        <Popconfirm placement="top" title={text}>
          <Direction>Top</Direction>
        </Popconfirm>
        <Popconfirm placement="topRight" title={text}>
          <Direction>TR</Direction>
        </Popconfirm>
      </div>
      <div style={{ width: 70, float: 'left' }}>
        <Popconfirm placement="leftTop" title={text}>
          <Direction>LT</Direction>
        </Popconfirm>
        <Popconfirm placement="left" title={text}>
          <Direction>Left</Direction>
        </Popconfirm>
        <Popconfirm placement="leftBottom" title={text}>
          <Direction>LB</Direction>
        </Popconfirm>
      </div>
      <div style={{ width: 70, marginLeft: 200 }}>
        <Popconfirm placement="rightTop" title={text}>
          <Direction>RT</Direction>
        </Popconfirm>
        <Popconfirm placement="right" title={text}>
          <Direction>Right</Direction>
        </Popconfirm>
        <Popconfirm placement="rightBottom" title={text}>
          <Direction>RB</Direction>
        </Popconfirm>
      </div>
      <div style={{ marginLeft: 50, clear: 'both', whiteSpace: 'nowrap' }}>
        <Popconfirm placement="bottomLeft" title={text}>
          <Direction>BL</Direction>
        </Popconfirm>
        <Popconfirm placement="bottom" title={text}>
          <Direction>Bottom</Direction>
        </Popconfirm>
        <Popconfirm placement="bottomRight" title={text}>
          <Direction>BR</Direction>
        </Popconfirm>
      </div>
      <br />
      <Popconfirm title={text} action={'focus'}>
        <Input placeholder={'聚焦弹出'} />
      </Popconfirm>
      <Popconfirm title={text} action={'hover'}>
        <Direction> 悬停</Direction>
      </Popconfirm>
      <Popconfirm title={text} action={'click'} cancelText="No" okText="yes" okType="danger">
        <Direction>点击</Direction>
      </Popconfirm>
      <br />
      <div>
        <Popconfirm
          title={text}
          action={'click'}
          cancelText="No"
          okText="yes"
          okType="danger"
          icon={
            <IconWrapper style={{ background: 'orange' }}>
              <HintIcon style={{ color: 'white' }} iconClass={'lugia-icon-reminder_exclamation'} />
            </IconWrapper>
          }
        >
          <Direction>提示</Direction>
        </Popconfirm>
        <Popconfirm
          title={text}
          action={'click'}
          cancelText="No"
          okText="yes"
          okType="danger"
          icon={
            <IconWrapper style={{ background: 'red' }}>
              <HintIcon style={{ color: 'white' }} iconClass={'lugia-icon-reminder_question'} />
            </IconWrapper>
          }
        >
          <Direction>危险操作</Direction>
        </Popconfirm>
      </div>
    </Wrapper>
  );
};
export default () => {
  return [
    <WrapperDemo />,
    <Wrapper>
      <Condition />
    </Wrapper>,
  ];
};
