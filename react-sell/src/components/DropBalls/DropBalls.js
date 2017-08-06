import React, { Component } from 'react';
import styles from './dropBalls.scss';
import CSSModules from 'react-css-modules';
import _ from 'lodash';
import {TweenLite, Power0} from "gsap";
import CustomEase from '../../common/js/CustomEase.js';

class DropBalls extends Component {
  componentWillEnter(callback) {
    // 找到所有设为true的小球
    let ball = this.props.ball;
    if (ball.show) {
      let rect = ball.el.getBoundingClientRect();
      let elRect = this.el.getBoundingClientRect();
      // x轴和y轴偏移
      let xDir = rect.left - elRect.left;
      // window.innerHeight, 浏览器视口高度; 或document.documentElement.clientHeight
      let yDir = -(window.innerHeight - rect.top) + (window.innerHeight - elRect.top);  
      this.el.style.transform = `translate3d(0, ${yDir}px, 0)`;
      // this.el.style.transition = '';
      let inner = this.el.querySelector('.ball-inner');
      // inner.style.transition = '';
      inner.style.transform = `translate3d(${xDir}px, 0, 0)`;
    }
    callback()
  }

  componentDidEnter() {
    // let ball = this.props.ball;
    // let rf = this.el.offsetHeight
    // this.el.style.transition = 'all 3s cubic-bezier(.49, -.29, .75, .41)';
    // this.el.style.transform = `translate3d(0, 0, 0)`;
    TweenLite.to(this.el, .5, {
      ease: CustomEase.create("custom", ".49, -.29, .75, .41"),
      // ease: CustomEase.create("custom", "M0,0,C0.146,-0.11,0.33,-0.152,0.522,-0.078,0.641,-0.031,0.832,0.19,1,1"),
      y: 0,
      z: 0
    });
    // this.el.style.transform = 'translate3d(0, 0, 0)';
    let inner = this.el.querySelector('.ball-inner');
    // inner.style.transition = 'all 3s linear';
    // inner.style.transform = 'translate3d(0, 0, 0)';
    TweenLite.to(inner, .5, {
      ease:  Power0.easeNone,
      x: 0,
      z: 0,
      onComplete: this.props.animateCallback
    });
    // inner.style.transform = `translate3d(0, 0, 0)`;
    // this.props.animateCallback();
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }


  render() {

    return (
      <div ref={(el)=>{this.el = el;}} styleName="ball" key={this.props.index}>
        <div styleName="ball-inner"></div>
      </div>
    );
  }
}

export default CSSModules(DropBalls, styles, {allowMultiple: true});