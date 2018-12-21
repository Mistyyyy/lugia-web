/**
 * create by szfeng
 *
 * @flow
 */
import * as React from 'react';
import Carousel from './index';
import styled from 'styled-components';
import Theme from '../theme';
import Widget from '../consts/index';

const data = [
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543751358232&di=f7fd14870cb6028086f7bb55d479df53&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F4%2F586b090b7f42b.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543751053813&di=7374346483180a4f42ea53227f866fcb&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2017-10-19%2F59e8072871e49.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543751112606&di=d22242ff68a6a20996cc4ac375d04776&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2018-07-20%2F5b517965781e5.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543751600594&di=be6d42fffdc5d235f4d2c83455885936&imgtype=0&src=http%3A%2F%2Fbbsfiles.vivo.com.cn%2Fvivobbs%2Fattachment%2Fforum%2F201601%2F24%2F175433rossj7cn74vksn4p.jpg',
];

const DemoWrap = styled.div`
  margin: 20px;
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: top;
`;

const getBackground = (props: Object) => {
  const { i } = props;
  const isEven = i % 2 === 0;
  return `background: ${isEven ? '#000033' : '#161651'}`;
};

const ItemWrap = styled.a`
  display: block;
  width: 100%;
  height: 100%;
  line-height: 350px;
  text-align: center;
  ${getBackground};
  color: #ccc;
  font-size: 14px;
`;

const H2 = styled.h2`
  padding: 10px 40px;
`;

const getImgWrap = () => {
  const len = data.length;
  const items = [];
  for (let i = 0; i < len; i++) {
    items.push(
      <ItemWrap i={i}>
        <Img src={data[i]} />
      </ItemWrap>
    );
  }
  return items;
};

class CarouselLimtDemo extends React.Component<any, any> {
  constructor() {
    super();
    this.state = { start: 0 };
  }

  onChange = (param: Object) => {
    const { newValue, oldValue } = param;
    // console.info('onAfter', oldValue, newValue);
    this.setState({ start: newValue });
  };

  render() {
    return (
      <DemoWrap>
        <h2>图片轮播图 start=2 从索引值为2的图开始</h2>
        <Carousel
          animationTime={500}
          autoPlay={true}
          delay={3000}
          start={this.state.start}
          onChange={this.onChange}
        >
          {getImgWrap()}
        </Carousel>
      </DemoWrap>
    );
  }
}

export default class SkeletonDemo extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    const config = { [Widget.Carousel]: { width: 700, height: 350 } };
    return (
      <div>
        <H2>3s自动切换</H2>
        <DemoWrap>
          <Theme config={config}>
            <Carousel autoPlay={true} delay={3000}>
              {this.getItemWrap()}
            </Carousel>
          </Theme>
        </DemoWrap>

        <H2>水平切换 指示器在外部 indicatorType=outside</H2>
        <DemoWrap>
          <Theme config={config}>
            <Carousel autoPlay={true} delay={3000} indicatorType={'outside'}>
              {this.getItemWrap()}
            </Carousel>
          </Theme>
        </DemoWrap>

        <H2>垂直切换 switchType === vertical indicatorType=vertical</H2>
        <DemoWrap>
          <Theme config={config}>
            <Carousel
              autoPlay={true}
              delay={3000}
              switchType={'vertical'}
              indicatorType={'vertical'}
            >
              {this.getItemWrap()}
            </Carousel>
          </Theme>
        </DemoWrap>

        <H2>透明度切换 switchType === fade indicatorType=vertical</H2>
        <DemoWrap>
          <Theme config={config}>
            <Carousel
              animationTime={1000}
              autoPlay={true}
              deafultStart={3}
              delay={3000}
              switchType={'fade'}
            >
              {this.getItemWrap()}
            </Carousel>
          </Theme>
        </DemoWrap>

        <h2>图片轮播图 deafultStart=2 从索引值为2的图开始</h2>
        <DemoWrap>
          <Theme config={config}>
            <Carousel autoPlay={true} delay={3000} deafultStart={2}>
              {getImgWrap()}
            </Carousel>
          </Theme>
        </DemoWrap>

        <h2>受限</h2>
        <CarouselLimtDemo />

        <h2>图片轮播图 switchType === fade 透明度切换</h2>
        <DemoWrap>
          <Theme config={config}>
            <Carousel autoPlay={true} switchType={'fade'} delay={3000} deafultStart={2}>
              {getImgWrap()}
            </Carousel>
          </Theme>
        </DemoWrap>
      </div>
    );
  }

  getItemWrap = () => {
    const len = 4;
    const items = [];
    for (let i = 0; i < len; i++) {
      const index = i + 1;
      items.push(<ItemWrap i={i}>{'Banner0' + index}</ItemWrap>);
    }
    return items;
  };
}
