/**
 *
 * create by wcx
 *
 * @flow
 */
import React from 'react';
import 'jest-styled-components';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ThemeProvider from '../index';
import Theme from '../../theme/';
import { delay } from '@lugia/react-test-utils';

Enzyme.configure({ adapter: new Adapter() });

describe('ThemeProvider', () => {
  const HelloMyButton = 'HelloMyButton';
  const HelloMyButtonTheme = 'HelloMyButtonTheme';
  const Button = ThemeProvider(
    class extends React.Component<any, any> {
      static displayName = HelloMyButton;

      render() {
        return <div />;
      }
    },
    HelloMyButtonTheme
  );
  const svThemeConfigTree = 'svThemeConfigTree';

  const getTheme = function(target: Object, widgetDisplayName: string) {
    return target
      .find(widgetDisplayName)
      .at(0)
      .props()
      .getTheme();
  };
  it('config: {}', () => {
    const config = {};
    const target = mount(
      <Theme config={config}>
        <Button />
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      [svThemeConfigTree]: {},
    });
  });

  it('config: {lgx: {}}', () => {
    const lgx = {};
    const config = { lgx };

    const target = mount(
      <Theme config={config}>
        <Button />
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      [svThemeConfigTree]: {
        lgx,
      },
    });
  });

  it('mutline theme, config: { HelloMyButton : {}}', () => {
    const btnConfigA = { width: 50 };
    const btnConfigB = { height: 100 };
    const configA = { [HelloMyButtonTheme]: btnConfigA };
    const configB = { [HelloMyButtonTheme]: btnConfigB };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Button />
        </Theme>
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...btnConfigA,
      ...btnConfigB,
      [svThemeConfigTree]: {
        [HelloMyButtonTheme]: {
          ...btnConfigA,
          ...btnConfigB,
        },
      },
    });
  });

  type TestCaseType = 'viewClass' | 'widgetName' | 'all';

  function testTheme(level: number, type: TestCaseType) {
    const viewClass = 'viewClass';

    function getConfig(i: number, type: TestCaseType) {
      const viewClassName = `${viewClass}_${i}`;
      const btnCfgClassName = `${HelloMyButtonTheme}_${i}`;

      const viewCfg = { hello: { viewClassName } };
      const btnCfg = { world: { btnCfgClassName } };

      const viewConfigVal = {
        [viewClass]: viewCfg,
      };

      const themeConfigVal = {
        [HelloMyButtonTheme]: btnCfg,
      };
      switch (type) {
        case 'viewClass':
          return viewConfigVal;
        case 'widgetName':
          return themeConfigVal;
        case 'all':
          return {
            ...viewConfigVal,
            ...themeConfigVal,
          };
        default:
      }
      return {};
    }

    it(`${type} level is ${level}`, () => {
      let element = <Button viewClass={viewClass} />;
      for (let i = 0; i < level; i++) {
        const config = getConfig(i, type);
        element = <Theme config={config}>{element}</Theme>;
      }

      const target = mount(element);

      function getRealyConfig(target: Object, type: TestCaseType) {
        switch (type) {
          case 'viewClass':
            return target[viewClass];
          case 'widgetName':
            return target[HelloMyButtonTheme];
          case 'all':
            return { ...target[viewClass], ...target[HelloMyButtonTheme] };
          default:
        }
      }

      function getExpectConfig(level: number, type: TestCaseType) {
        const target = getConfig(0, type);
        const realyConfig = getRealyConfig(target, type);
        return {
          ...realyConfig,
          [svThemeConfigTree]: target,
        };
      }

      expect(getTheme(target, HelloMyButton)).toEqual(getExpectConfig(level, type));
    });
  }

  for (let i = 1; i < 10; i++) {
    testTheme(i, 'widgetName');
    testTheme(i, 'viewClass');
    testTheme(i, 'all');
  }
  it('mutline theme,  config: { viewClass : {}}', () => {
    const btnConfigA = { helloA: 'a' };
    const btnConfigB = { helloB: 'b' };
    const viewClass = 'helloLIgx';
    const configA = { [viewClass]: btnConfigA };
    const configB = { [viewClass]: btnConfigB };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Button viewClass={viewClass} />
        </Theme>
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...btnConfigA,
      ...btnConfigB,
      [svThemeConfigTree]: {
        [viewClass]: {
          ...btnConfigA,
          ...btnConfigB,
        },
      },
    });
  });

  it('mutline theme,  config: { HelloMyButton: {}, viewClass : {}}', () => {
    const btnConfigA = { helloA: 'a' };
    const btnConfigB = { helloB: 'b' };
    const helloMyButtonA = { HelloMyButtonA: 'c' };
    const helloMyButtonB = { HelloMyButtonB: 'd' };

    const viewClass = 'helloLIgx';
    const configA = { [viewClass]: btnConfigA, [HelloMyButtonTheme]: helloMyButtonA };
    const configB = { [viewClass]: btnConfigB, [HelloMyButtonTheme]: helloMyButtonB };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Button viewClass={viewClass} />
        </Theme>
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...btnConfigA,
      ...btnConfigB,
      ...helloMyButtonA,
      ...helloMyButtonB,
      [svThemeConfigTree]: {
        [HelloMyButtonTheme]: { ...helloMyButtonA, ...helloMyButtonB },
        [viewClass]: {
          ...btnConfigA,
          ...btnConfigB,
        },
      },
    });
  });

  it('config: { HelloMyButton : {}}', () => {
    const btnConfig = { hello: '1' };
    const config = { [HelloMyButtonTheme]: btnConfig };

    const target = mount(
      <Theme config={config}>
        <Button />
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...btnConfig,
      [svThemeConfigTree]: {
        [HelloMyButtonTheme]: btnConfig,
      },
    });
  });

  it('config: { HelloMyButton : {}} viewClass: "viewClass"', () => {
    const btnConfig = { hello: '1' };
    const config = { [HelloMyButtonTheme]: btnConfig };

    const target = mount(
      <Theme config={config}>
        <Button viewClass="viewClass" />
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...btnConfig,
      [svThemeConfigTree]: {
        [HelloMyButtonTheme]: btnConfig,
      },
    });
  });

  it('config: { viewClass : {}}', () => {
    const viewClass = 'ligx';
    const btnConfig = { hello: '1' };
    const config = { [viewClass]: btnConfig };

    const target = mount(
      <Theme config={config}>
        <Button viewClass={viewClass} />
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...btnConfig,
      [svThemeConfigTree]: {
        [viewClass]: btnConfig,
      },
    });
  });

  it('config: { HelloMyButton : {}, viewClass : {}} is same', () => {
    const viewClass = 'ligx';

    const viewClassConfig = { viewClass: 'viewClass' };
    const btnConfig = { viewClass: 'btnTheme' };

    const config = { [viewClass]: viewClassConfig, [HelloMyButtonTheme]: btnConfig };

    const target = mount(
      <Theme config={config}>
        <Button viewClass={viewClass} />
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...viewClassConfig,
      [svThemeConfigTree]: {
        [viewClass]: viewClassConfig,
        [HelloMyButtonTheme]: btnConfig,
      },
    });
  });
  it('config: { HelloMyButton : {}, viewClass : {}} is different', () => {
    const viewClass = 'ligx';

    const viewClassConfig = { viewClass: 'viewClass' };
    const btnConfig = { btnTheme: 'btnTheme' };

    const config = { [viewClass]: viewClassConfig, [HelloMyButtonTheme]: btnConfig };

    const target = mount(
      <Theme config={config}>
        <Button viewClass={viewClass} />
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...viewClassConfig,
      ...btnConfig,
      [svThemeConfigTree]: {
        [viewClass]: viewClassConfig,
        [HelloMyButtonTheme]: btnConfig,
      },
    });
  });
  it('config:  3 level ', () => {
    const viewClass = 'ligx';

    const levelA = { color: { red: 5, green: 5, blue: 5 } };
    const levelB = { color: 'red' };
    const levelC = { color: { red: 5, green: 5, blue: 5 } };

    const configA = { [viewClass]: levelA };
    const configB = { [viewClass]: levelB };
    const configC = { [viewClass]: levelC };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Theme config={configC}>
            <Button viewClass={viewClass} />
          </Theme>
        </Theme>
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...levelC,
      [svThemeConfigTree]: {
        [viewClass]: levelC,
      },
    });
  });

  it('config:  3 level mixed', () => {
    const viewClass = 'ligx';
    const widthConfig = {
      width: 500,
    };
    const bgConfig = {
      background: 'red',
    };
    const levelA = { color: { red: 5, green: 5, blue: 5 }, ...bgConfig };
    const levelB = { color: 'red', ...widthConfig };
    const levelC = { color: { red: 5, green: 5, blue: 5 } };

    const configA = { [viewClass]: levelA };
    const configB = { [viewClass]: levelB };
    const configC = { [viewClass]: levelC };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Theme config={configC}>
            <Button viewClass={viewClass} />
          </Theme>
        </Theme>
      </Theme>
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...levelC,
      ...widthConfig,
      ...bgConfig,
      [svThemeConfigTree]: {
        [viewClass]: { ...levelC, ...widthConfig, ...bgConfig },
      },
    });
  });
});