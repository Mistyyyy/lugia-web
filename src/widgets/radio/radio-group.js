/**
 *
 * create by guorg
 *
 * @flow
 *
 */
import * as React from 'react';
import ThemeProvider from '../theme-provider';
import Radio from './radio';
import CheckButton from '../check-button/button';
import Widget from '../consts';
import translateData, {
  didUpdate,
  getItems,
  handleCreate,
  getMapData,
} from '../common/translateData';
import Theme from '../theme';
import { Group } from '../checkbox/checkbox-group';
import { getValueAndDisplayValue } from '../checkbox/checkbox-group';

type RadioGroupProps = {
  defaultValue?: string,
  disabled?: boolean,
  data?: Array<Object>,
  value?: string,
  onChange?: Function,
  size?: string,
  displayField?: string,
  valueField?: string,
  displayValue?: string,
  children?: any,
  getTheme: Function,
  styles: 'default' | 'vertical',
  cache?: boolean,
  childType?: 'default' | 'button',
  size?: 'default' | 'small' | 'large' | 'bigger',
};
type RadioGroupState = {
  value: string,
  displayValue: string,
  dataLength: number,
};

export default ThemeProvider(
  class extends React.Component<RadioGroupProps, RadioGroupState> {
    oldItem: Object;
    cancelItem: Array<Object>;
    dataItem: Object;
    constructor(props) {
      super(props);
      const { displayValue } = getValueAndDisplayValue(props, null);
      getMapData(props, [displayValue], this);
    }

    static getDerivedStateFromProps(props, state) {
      const { data = [] } = props;
      const dataLength = data.length;
      return {
        ...getValueAndDisplayValue(props, state),
        dataLength,
      };
    }
    shouldComponentUpdate(nextProps: RadioGroupProps, nextState: RadioGroupState) {
      return didUpdate(nextProps, nextState, this, (_, nextState) => nextState.displayValue);
    }

    render() {
      const { displayValue = '' } = this.state;
      const disV = typeof displayValue === 'string' ? [displayValue] : [];
      const { cache = true, getTheme, childType = 'default' } = this.props;
      if (!cache) {
        getMapData(this.props, disV, this);
      }
      return (
        <Theme config={this.getChildTheme()}>
          <Group themes={getTheme()} childType={childType}>
            {handleCreate(this, 'radio')}
          </Group>
        </Theme>
      );
    }

    hasValueProps() {
      return 'value' in this.props;
    }

    getChildDom = (item: Object, isCancel: boolean): any => {
      const {
        disabled,
        valueField = 'value',
        displayField = 'text',
        styles = 'default',
        childType = 'default',
        size = 'default',
      } = this.props;
      const { value } = this.state;
      const config = {};
      isCancel ? (config.cancel = true) : (config.disabled = disabled || item.disabled);
      const itemValue = item[valueField];
      if (childType === 'button') {
        return (
          <CheckButton
            type="radio"
            value={itemValue}
            checked={value === itemValue}
            onChange={this.handleChange(item)}
            {...config}
            size={size}
            hasValue={this.hasValueProps()}
          >
            {item[displayField]}
          </CheckButton>
        );
      }
      return (
        <Radio
          onChange={this.handleChange(item)}
          key={itemValue}
          value={itemValue}
          checked={itemValue === value}
          styles={styles}
          {...config}
        >
          {item[displayField]}
        </Radio>
      );
    };
    handleChange = (item?: Object) => (e: Event, val: string) => {
      const { onChange } = this.props;
      const { value } = this.state;
      if (val === value) {
        return;
      }
      const { items } = getItems([value], false, this);
      const obj = {
        newValue: val,
        oldValue: value,
        newItem: item,
        event: e,
        oldItem: items && items[0],
        newDisplayValue: val,
      };
      onChange && onChange(obj);
      const notHasValue = !this.hasValueProps();
      if (notHasValue) {
        this.cancelItem = [];
        this.setState({
          value: val,
        });
      }
    };

    getChildTheme(): Object {
      const { getTheme } = this.props;
      return {
        [Widget.Radio]: getTheme(),
        [Widget.CheckButton]: getTheme(),
      };
    }
  },
  Widget.RadioGroup
);