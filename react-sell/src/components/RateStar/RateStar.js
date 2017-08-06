import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './rateStar.scss';
import ReactSVG from 'react-svg';
import star from './star-min.svg';
import starBg from './star-bg-min.svg';
import {px2rem} from '../../common/js/util';

class RateStar extends Component {
  render() {
    let starWidth = px2rem(this.props.width);
    let totalWidth = px2rem(this.props.totalWidth);
    let num;
    if (this.props.score) {
      num = this.props.score;
    }
    let starArr = [];
    // console.log(typeof num);
    while (num > 1) {
      num -= 1;
      starArr.push(1);
    }
    starArr.push(Number(num.toFixed(1))); // 带小数点的最后一位
    while (starArr.length < 5) {
      starArr.push(0); // 补足5位
    }

    let starList = starArr.map((item, index) => {
      return (
        <div styleName="ratestar-main-container" key={index} style={{width: starWidth, height: starWidth}}>
          {item > 0 ? (<div styleName="ratestar-container" style={{width: item * 100 + '%'}}>
            <ReactSVG path={star} style={{width: starWidth, height: starWidth}}/>
          </div>) : null}
          <div styleName="ratestar-bg-container">
            <ReactSVG path={starBg} style={{width: starWidth, height: starWidth}}/>
          </div>
        </div>
      )
    })

    return (
      <div styleName="ratestar-wrapper" style={{width: totalWidth}}>
        {starList}
      </div>
    );
  }
}

export default CSSModules(RateStar, styles);