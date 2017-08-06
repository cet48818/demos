import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './supportStyle.scss'

class Header extends Component {
  constructor () {
    super();
    this.state = {
      supportList: []
    }
  }
  render() {
    let supportList = this.props.supportList;
    let mode = this.props.mode;
    const typeList = [['新', '#70bc46'], ['减', '#f07373'], ['赠', '#3cc791'], ['保', '#999'], ['准', '#57a9ff']];
    if (mode && Array.isArray(supportList)) {
      supportList = supportList.filter((item) => {
        return item.mode === mode;
      })
    }
    let list = !supportList
    ? '目前没有任何优惠'
    : supportList.map((item, index) => {
      let bgColor = typeList[item.type][1];
      let bgStyle = {background: bgColor};
      return (
        <li key={index}>
          <div styleName="support-icon" style={bgStyle}>{(typeList[item.type])[0]}</div>
          {item.description}
        </li>
      )
    });

    return (
      <ul styleName="support-list">
        {
          this.props.length
          ? list.slice(0, this.props.length)
          : list
        }
      </ul>
    );
  }
}

export default CSSModules(Header, styles);