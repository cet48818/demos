import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './headerStyle.scss';
import Supports from '../Supports/Supports';
import RateStar from '../RateStar/RateStar';
import closeSvg from './close-min.svg';
import { CSSTransitionGroup } from 'react-transition-group';
import leftArrow from './left-arrow.svg';

class Header extends Component {
  constructor () {
    super();
    this.state = {
      maskVisible: false,
      sellerDetail: false
    };
  }

  hideMask() {
    this.setState({
      maskVisible: false
    });
  }
  showMask() {
    this.setState({
      maskVisible: true
    });
  }
  
  showDetail() {
    this.setState({
      sellerDetail: true
    });
  }

  hideDetail() {
    this.setState({
      sellerDetail: false
    });
  }

  render() {
    let privilege;
    if (Array.isArray(this.props.seller.supports)) {
      privilege = this.props.seller.supports.filter((item) => {
        return item.mode === 'privilege';
      })
    }

    return (
      <div styleName='sell-header'>
        <div styleName='content-wrapper'>
          <div styleName='avatar'>
            <img src={this.props.seller.avatar} alt=""/>
          </div>
          <div styleName="header-content">
            <div styleName="seller-name">
              {this.props.seller.name}
            </div>
            <p styleName="seller-description">
              {this.props.seller.description} / {this.props.seller.deliveryTime}分钟送达 / 配送费￥{this.props.seller.deliveryPrice}
            </p>
            <p styleName="seller-bulletin">
              <span>公告 : </span>
              {this.props.seller.bulletin}
            </p>
          </div>
        </div>
        <div styleName="bulletin-wrapper" onClick={this.showMask.bind(this)}>
          <Supports supportList={this.props.seller.supports} length={1} />
          <div styleName="support-num">
            {
              privilege
              ? privilege.length
              : '0'
            }个活动
          </div>
        </div>
        <div styleName='back-btn' style={{background: `url('${leftArrow}') no-repeat`}}>
          <a href="#"></a>
        </div>
        <div styleName='seller-btn' onClick={this.showDetail.bind(this)} style={{background: `url('${leftArrow}') no-repeat`}}>
        </div>
        <div styleName='background-wrapper'>
          <img src={this.props.seller.headerBg} alt=""/>
        </div>
        <div styleName={this.state.maskVisible? "mask show-mask": "mask hide-mask"}>
          <div styleName="main-container">
            <h2 styleName="shopName">{this.props.seller.name}</h2>
            <div styleName="star-container">
              <RateStar score={this.props.seller.score} width={20} totalWidth={110} />
            </div>
            <div styleName="title-container">
              <span>优惠信息</span>
            </div>
            <Supports supportList={this.props.seller.supports} mode="privilege" />
            <div styleName="title-container">
              <span>商家公告</span>
            </div>
            <p>
              {this.props.seller.bulletin}
            </p>
          </div>
          <div styleName="close-btn" onClick={this.hideMask.bind(this)}>
            <img src={closeSvg} alt="close" />
          </div>
        </div>
        <CSSTransitionGroup
          transitionName="slide"
          transitionEnterTimeout={400}
          transitionLeaveTimeout={400}
        >
        {this.state.sellerDetail
        ?
        <div styleName="seller-detail-layer">
          <h1 styleName="detail-title">
            商家详情
            <div styleName="back-btn" onClick={this.hideDetail.bind(this)} style={{background: `url('${leftArrow}') no-repeat`}}></div>
          </h1>
          <div styleName="support-section section">
            <h2 styleName="head-title">活动与属性</h2>
            <Supports supportList={this.props.seller.supports} />
          </div>
          <div styleName="seller-pic section">
            <h2 styleName="head-title">商家实景</h2>
              <ul styleName="shop-img-list">
                <li styleName="pic-item">
                  <img src={this.props.seller.shopImages[0]} alt="门面" />
                  <span styleName="pic-description">门面(1)张</span>
                </li>
                <li styleName="pic-item">
                  <img src={this.props.seller.shopImages[1]} alt="大堂" />
                  <span styleName="pic-description">大堂(1)张</span>
                  </li>
              </ul>
          </div>
          <div styleName="shop-infos section">
            <h2 styleName="head-title">商家信息</h2>
              <div>
                <p styleName="info-item">{this.props.seller.infos[0]}</p>
                <p styleName="info-item">{this.props.seller.infos[1]}</p>
              </div>
          </div>
          <div styleName="shop-infos-last section"></div>
        </div>
        : null
        }
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default CSSModules(Header, styles, {allowMultiple: true});