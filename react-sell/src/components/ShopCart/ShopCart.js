import React, { Component } from 'react';
import styles from './shopCartStyles.scss';
import CSSModules from 'react-css-modules';
import ReactSVG from 'react-svg';
import _ from 'lodash';
import CartControl from '../CartControl/CartControl';
import cart from './cart-min.svg';
import trash from './trash-min.svg';
import { CSSTransitionGroup } from 'react-transition-group';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Badge from '../Badge/Badge';
import DropBalls from '../DropBalls/DropBalls';

class ShopCart extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showShopCart: false, // 折叠
      itemNum: 0,
      totalPrice: 0, // 总价
      ballsList: [{show: false, el: null}, {show: false, el: null}, {show: false, el: null}, {show: false, el: null}, {show: false, el: null}],
      dropBalls: [],
      showDebounce: false
    };
  }

  clear() {
    this.props.clearItems();
    this.setStateAsync({
      itemNum: 0,
      totalPrice: 0
    })
    .then(() => {
      this.hideMask();
    })
  }

  toggleList() {
    let showFlag = false;
    for (let item of this.props.itemCountList) {
      if (item > 0) {
        showFlag = true;
        break;
      }
    }
    if (showFlag) {
      // this.shopCart.style.zIndex = 9;
      // this.setState((prevState) => ({
      //   showShopCart: !prevState.showShopCart
      // }))
      if (!this.state.showShopCart) {
        this.showMask();
      }
      else {
        this.hideMask();
      }
    }

  }
  
  // componentWillMount() {
  //   this.setState({
  //     showDebounce: false
  //   });
  // }

  componentWillReceiveProps (nextProps) { // 购物车清零时隐藏购物车
    if (!this.props.itemCountList.length) return;
    let num = 0;
    let price = 0;
    for (let [index,item] of nextProps.itemCountList.entries()) {
      if (item > 0) { // 购物车非空
        price += this.props.goodsList[index].price * item;
        num += item;
      }
    };
    if (num) {
      this.setStateAsync({
        itemNum: num,
        totalPrice: price
      });
    } else { // num为0
      this.setState({
        showShopCart: false,
        itemNum: 0,
        totalPrice: 0
      });
    }

    if (nextProps.ele && nextProps.drop) {
      let dropBalls = Object.assign([], this.state.dropBalls);
      for (let [index, ball] of this.state.ballsList.entries()) {
        if (!ball.show) {
          let list = Object.assign([], this.state.ballsList);
          list[index].show = true;
          list[index].el = nextProps.ele;
          dropBalls.push(ball);
          this.setStateAsync({
            // showDebounce: false,
            ballsList: list,
            dropBalls: dropBalls
          })
          .then(()=>{
            // console.log(this.state.ballsList)
          })
          break;
        }
      }
    }
  }
  
  showBalls() {
    console.log(this.state.ballsList)
    for (let i = 0; i < this.state.ballsList.length; i++) {
      let item = this.state.ballsList[i];
      if (item.show) {
        return true;
      }
    }
    return false;
  }

  showMask() {
    this.setState({showShopCart: true})
    this.shopCart.style.zIndex = '9';
  }
  hideMask() {
    this.setState({showShopCart: false})
    setTimeout(() => {
      this.shopCart.style.zIndex = '';
    }, 400)
  }
  
  cartControlCallback(...rest) {
    rest.push(true);
    // console.log(rest)
    this.props.callbackParent.apply(this, rest)
    // console.log(rest)
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  getAccountBtn() {
    // 结算按钮
    if (this.state.totalPrice === 0) {
      return `￥${this.props.minPrice}起送`;
    } else if (this.state.totalPrice < this.props.minPrice) {
      return `还差￥${this.props.minPrice - this.state.totalPrice}起送`;
    } else {
      return `去结算`;
    }
  }

  handleAccount() {
    if (this.state.totalPrice >= this.props.minPrice) {
      alert(`支付￥${this.state.totalPrice + this.props.deliveryPrice}`);
    }
  }

  animateCallback(index) {
    let ballsList = Object.assign([], this.state.ballsList);
    let dropBalls = Object.assign([], this.state.dropBalls);
    let ball = dropBalls.shift();
    if (ball) {
      ballsList[index].show = false;
      this.setStateAsync({
        dropBalls: dropBalls,
        ballsList: ballsList,
        showDebounce: true
      })
      .then(()=>{
        setTimeout(()=>{
          this.setState({
            showDebounce: false
          });
        }, 500);
      })
    }

  }

  render() {
    // let itemList = this.props.itemCountList.map((item, index) => {
    //   if (item > 0) {
    //     return (
    //       <li styleName="cart-item" key={index}>
    //         <span>{this.props.goodsList[index].name}</span>
    //         <span styleName="price">{this.props.goodsList[index].price}</span>
    //         <div styleName="cart-container">
    //           <CartControl initCount={item} foodIndex={index} callbackParent={this.cartControlCallback.bind(this)} />
    //         </div>
    //       </li>
    //     )
    //   }
    // });
    let itemList = [];
    for (let i = 0; i < this.props.itemCountList.length; i++) {
      let itemCountList = this.props.itemCountList;
      if (itemCountList[i] > 0) {
        itemList.push(
          <li styleName="cart-item" key={i}>
            <span>{this.props.goodsList[i].name}</span>
            <span styleName="price">{this.props.goodsList[i].price}</span>
            <div styleName="cart-container">
              <CartControl initCount={itemCountList[i]} foodIndex={i} callbackParent={this.cartControlCallback.bind(this)} />
            </div>
          </li>
        );
      } else {
        continue;
      }
    }

    // let balls = this.state.ballsList.map((item, index) => {
    //   return (item.show ? (<div styleName="ball" key={index}><div styleName="ball-inner"></div></div>) : '');
    // });

    return (
      <div styleName="shop-cart" ref={(shopCart) => {this.shopCart = shopCart}}>
        <div styleName="cart-area">
          <div styleName="price-area" onClick={this.toggleList.bind(this)}>
            <div styleName={"button-bg" + (this.state.totalPrice ? "": " non-price") + " " + (this.state.showDebounce ? "animated bounceIn": "")}>
              <div styleName="button">
                <ReactSVG
                  path={cart}
                  className="cart-svg"
                />
              </div>
            </div>
            <div styleName="badge-container">
              <Badge itemNum={this.state.itemNum} />
            </div>
            <div styleName="delivery-price-wrapper">
              <span styleName="main-price">￥{this.state.totalPrice}</span>
              <p styleName="delivery-price">配送费￥{this.props.deliveryPrice}</p>
            </div>
          </div>
          <div styleName={"account-btn" + (this.state.totalPrice >= this.props.minPrice ? "":" non")} onClick={this.handleAccount.bind(this)}>
            {this.getAccountBtn.call(this)}
          </div>
        </div>
        <div styleName={this.state.showShopCart ? "shopcart-detail visible": "shopcart-detail"}>
          <div styleName="title">
            <div styleName="cart-title-container">
            <div styleName="sep-line"></div>
            <span styleName="cart-title">购物车</span>
            </div>
            <a styleName="clear" onClick={(e) => {e.preventDefault();}}>
              <ReactSVG
                path={trash}
                className="trash-svg"
              />
              <span styleName="clear-span" onClick={this.clear.bind(this)}>清空</span>
            </a>
          </div>
          <div styleName="cart-items-container">
            <ul>
              {itemList}
            </ul>
          </div>
        </div>
        <CSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={400}
          transitionLeaveTimeout={400}
        >
          {this.state.showShopCart? <div styleName="cart-mask" onClick={this.hideMask.bind(this)}></div>: null}
        </CSSTransitionGroup>
          <TransitionGroup component="div" className="ball-container">
            {this.state.ballsList.map((item, index) => {
              return this.state.ballsList[index].show ? (
                <DropBalls key={index} ball={this.state.ballsList[index]} animateCallback={this.animateCallback.bind(this, index)} />
            ) : null
            })}
          </TransitionGroup>
      </div>
    );
  }
}

export default CSSModules(ShopCart, styles, {allowMultiple: true});