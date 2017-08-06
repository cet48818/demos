import React, { Component } from 'react';
import styles from './fullSizePic.scss';
import CSSModules from 'react-css-modules';
import {px2rem} from '../../common/js/util';

class FullSizePic extends Component {
  componentWillEnter(callback) {
    let targetImg = this.props.targetImg;
    let left = targetImg.getBoundingClientRect().left;
    let top = targetImg.getBoundingClientRect().top;
    this.inner.style.left = px2rem(left);
    this.inner.style.top = px2rem(top);
    callback();
  }

  componentDidEnter() {
    this.inner.style.width = '100%';
    this.inner.style.height = 'auto';
    this.inner.style.left = 0;
    this.inner.style.top = '50%';
    this.inner.style.transform = 'translate3D(0, -50%, 0)';
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }


  render() {
    return (
        <img styleName="fullsize-img" alt="食物照片" src={this.props.picUrl}  ref={(inner)=>{this.inner = inner}}/>
    );
  }
}

export default CSSModules(FullSizePic, styles, {allowMultiple: true});