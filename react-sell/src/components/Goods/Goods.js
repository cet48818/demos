import React, { Component } from 'react';
import styles from './goodsStyles.scss';
import CSSModules from 'react-css-modules';
import { Scrollbars } from 'react-custom-scrollbars';
import axios from 'axios';
import ReactSVG from 'react-svg';
import ReactTooltip from 'react-tooltip';
import ellipsis from './ellipsis-min.svg';
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import _ from 'lodash';
import CartControl from '../CartControl/CartControl';
import ShopCart from '../ShopCart/ShopCart';
import Badge from '../Badge/Badge';
import {px2rem} from '../../common/js/util';
import Loading from '../Loading/Loading';

class Goods extends Component {
  constructor (props) {
    super(props);
    // this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      goods: [],
      shouldRender: false,
      posList: [], // 记录右侧各个食品分类scrollTop的列表
      movePosition: 0, // 右侧列表的scrollTop
      // menuSelectedList: [], // 左侧列表是否在选中状态
      isAnimated: 0, // 如果值为1, scroll的时候不进行checkTop检测
      goodsList: [], // 食物列表
      // countList: [], // 购物车列表
      itemCountList: [], // 列表, 记录每一项的个数
      // showShopCart: false // 默认不显示
      badgeList: [],
      selectedItem: [],
      ele: null,
      drop: false,
      currentIndex: 0 // 左侧列表的index
    };
  }

  componentDidMount() {
    axios.get('//neodemo.duapp.com/api/goods')
      .then((res) => {
        if (!res.errno) {
          this.setState({
            goods: res.data.data,
            shouldRender: true
          })
        }
      })
      .then(()=> {
        // 获取全部商品数组
        // 初始化badgeList(全部是0)
        this.getGoodsList.call(this);
      })
      .then(() => {
        this.getCountList.call(this); // 初始化每项选中的个数的列表
        this.handleScrollStop();
      })
  }


  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  lazyForceCheck() {
    forceCheck(); // 用于lazyload
  }

  handleStyle(...rest) { // 点击左侧列表滚动
    let curIndex = rest[0];
    this.setStateAsync({
      currentIndex: curIndex,
      isAnimated: 1
    })

    const distance = Math.abs(this.state.posList[rest[0]]);
    let fullDistance = Math.abs(distance - this.state.movePosition); // 总运动距离
    if (fullDistance === 0) return;
    const duration = 300;
    const steps = Math.ceil(60/1000 * duration); // 运动的次数
    let moveOnce = fullDistance / steps; // 单次运动距离

    let movePosition = this.state.movePosition;
    function scrollBarMove() {
      // 向下
      if (this.state.movePosition < distance) {
        movePosition += moveOnce;
        if (movePosition < distance) {
          this.scrollBar.scrollTop(movePosition);
        } else {
          this.scrollBar.scrollTop(distance);
          this.setState({
            movePosition: distance
          })
        }

      } else if (this.state.movePosition > distance) {
        // 向上
        movePosition -= moveOnce;
        if (movePosition > distance) {
          this.scrollBar.scrollTop(movePosition)
        } else {
          this.scrollBar.scrollTop(distance)
          this.setState({
            movePosition: distance
          })
        }
      } else {
        this.setState({
          isAnimated: 0
        })
        return;
      }
      requestAnimationFrame(scrollBarMove.bind(this));
    }
    requestAnimationFrame(scrollBarMove.bind(this));
  }
  

  handleScrollStop() {
    // DOM操作; 获取scrollTop并注入到state
    let list = this.velocity.children;
    let posList = [];
    Array.from(list).forEach((item, index) => {
      posList.push(item.offsetTop)
    });
    this.setStateAsync({
      posList: posList
    })
  }

  getGoodsList() {
    let goodsArr = [];
    let badgeList = [];
    this.state.goods.forEach((outerItem, outerIndex) => {
      badgeList.push(0);
      outerItem.foods.forEach((item, index) => {
        goodsArr.push(item);
      });
    });
    this.setState({
      goodsList: goodsArr,
      badgeList: badgeList
    });
  }

  updateCountList(index, count, type, ele, shopCartMove) { // 如果最后个参数是false, 则执行动画
    // 更新itemCountList列表
    let countList = Object.assign([], this.state.itemCountList);
    countList[index] = count;
    // 更新badgeList
    let typeId = this.state.goodsList[index].typeId;
    let badgeList = Object.assign([], this.state.badgeList);
    if (type) {
      badgeList[typeId] += 1;
    } else {
      badgeList[typeId] -= 1;
    }
    
    if (!shopCartMove && type) {
      this.setStateAsync({
        badgeList: badgeList,
        itemCountList: countList,
        ele: ele,
        drop: true
      })
      .then(() => {
        this.setState({
          drop: false
        })
      })
    } else {
      this.setState({
        badgeList: badgeList,
        itemCountList: countList,
        drop: false
      });
    }
    
  }

  clearItems() {
    // 清空购物车
    let list = Object.assign([], this.state.itemCountList);
    list = list.map((item) => item = 0);
    let badgeList = Object.assign([], this.state.badgeList);
    badgeList = badgeList.map((item, index) => {
      return 0;
    });
    this.setStateAsync({
      itemCountList: list,
      badgeList: badgeList
    })
  }

  getCountList() {
    let countArr = [];
    this.state.goods.forEach((good) => {
      good.foods.forEach((item) => {
        countArr.push(0);
      })
    });
    this.setState({
      itemCountList: countArr
    });
  }

  checkTop (e) {
    e.preventDefault();
    if (!this.state.isAnimated) {
      let newScrollTop = this.scrollBar.getScrollTop();
      let posList = this.state.posList;
      let currentIndex;
      for (let [index, item] of posList.entries()) {
          if (newScrollTop <= 0) {
            currentIndex = 0;
            break;
          }
          if (newScrollTop > item && newScrollTop < posList[index + 1]) {
            currentIndex = index;
            break;
          }
          currentIndex = index
      }
      this.setStateAsync({
        currentIndex: currentIndex,
        movePosition: newScrollTop
      })
    } 
  }

  render() {
    if (!this.state.shouldRender) return <Loading />;
    let menuList = this.state.goods.map((item, index) => {
      return (
        <li styleName={"menu-item" + (index === this.state.currentIndex ? " menu-selected": "")} key={index} onClick={this.handleStyle.bind(this, index)}>
          <div styleName="badge-container">
            <Badge itemNum={this.state.badgeList.length ? this.state.badgeList[index]: 0} />
          </div>
          {index === 1 ? <img styleName="hot-img" alt="热门" src="//fuss10.elemecdn.com/5/da/3872d782f707b4c82ce4607c73d1ajpeg.jpeg" />: ''}
          <span>{item.name}</span>
        </li>
      )
    });

    let mainList = this.state.goods.map((item, subIndex) => {
      return (
        <li key={subIndex}>
          <h3 styleName="goods-title-container">
            <strong styleName="goods-title">
              {item.name}
            </strong>
            <p styleName="des">
              {item.desc}
            </p>
            <div styleName="tooltip-wrap" data-tip={item.name + ' ' + (item.desc ? item.desc : '')}>
              <ReactSVG styleName="ellipsis"
                path={ellipsis}
              />
              <ReactTooltip class="tooltip" place="bottom"/>
            </div>
          </h3>
          <ul>
            {item.foods.map((item, index) => {
              return (
                <LazyLoad key={index} height={px2rem(110)} offset={100} placeholder={<p className="holder-string">载入中...</p>}>
                  <li styleName="food-item">
                    
                    <div styleName="foodimg">
                      {/*<LazyLoad placeholder={<img src={loadingImg} />}>*/}
                      <img alt="图片" src={item.image} />
                      {/*</LazyLoad>*/}
                    </div>
                    <div styleName="food-condition">
                      <h4 styleName="food-name">
                        {item.name}
                      </h4>
                      {item.description? <span styleName="food-desc">{item.description}</span> : ''}
                      {item.sellCount? <p styleName="rate">月售{item.sellCount}份, 好评率{item.rating}%</p>: ''}
                      <strong styleName="price">
                        {item.price}
                      </strong>
                    </div>
                    <div styleName="cart-container">
                      <CartControl initCount={this.state.itemCountList[item.itemNum]} foodIndex={item.itemNum} callbackParent={this.updateCountList.bind(this)} />
                    </div>
                    
                  </li>
                </LazyLoad>
                
              )
            })}
          </ul>
        </li>
      )
    });

    return (
      <div>
        <div styleName="goods-container">
          <div styleName="menu-wrapper" ref={(test) => { this.test = test; }}>
            <Scrollbars autoHide>
              <ul styleName="menu" ref={(menu) => { this.menu = menu; }}>
                {menuList}
              </ul>
            </Scrollbars>
          </div>
          <div styleName="foods-wrapper">
            <Scrollbars autoHide onScroll={this.checkTop.bind(this)} onScrollStop={this.lazyForceCheck.bind(this)} ref={(scrollBar) => {this.scrollBar = scrollBar;}}
              renderTrackVertical={props => <div {...props} className="track-vertical"/>}
              renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
              >
              <ul styleName="foods" id="containerElement" ref={(velocity) => {this.velocity = velocity;}}>
                {mainList}
              </ul>
            </Scrollbars>
          </div>
        </div>
        <ShopCart itemCountList={this.state.itemCountList} goodsList={this.state.goodsList} callbackParent={this.updateCountList.bind(this)} clearItems={this.clearItems.bind(this)} deliveryPrice={this.props.deliveryPrice} minPrice={this.props.minPrice} ele={this.state.ele} drop={this.state.drop}/>
      </div>
    );
  }
}

export default CSSModules(Goods, styles, {allowMultiple: true});
