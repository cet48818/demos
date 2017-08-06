import React, { Component } from 'react';
import styles from './ratingsStyles.scss';
import CSSModules from 'react-css-modules';
import axios from 'axios';
import _ from 'lodash';
import {setStateAsync, px2rem, formTimeString} from '../../common/js/util';
import RateStar from '../RateStar/RateStar';
import InfiniteScroll from 'react-infinite-scroller';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import FullSizePic from '../FullSizePic/FullSizePic';
import { Scrollbars } from 'react-custom-scrollbars';

class Ratings extends Component {
  constructor (props) {
    super(props);
    // this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      initRatings: [], 
      ratings: [],
      shouldRender: false,
      tagType: ['全部', '满意', '不满意'],
      rateTag: ['有图', '味道好', '送货快', '分量足', '服务不错', '物美价廉', '食材新鲜', '包装精美', '干净卫生'],
      rateLengthList: [], // 记录每项数目
      tagSelect: 0,
      hasMoreItems: true,
      selectRatings: [],
      ratingsPage: [],
      pageLength: 6, // 每次加载条目数
      showLargePic: false,
      picUrl: '',
      targetImg: null,
      recommendArr: [],
      imgIndex: 0
    };
  }

  componentDidMount() {
    // debugger;
    axios.get('//neodemo.duapp.com/api/ratings')
      .then((res) => {
        if (!res.errno) {
          setStateAsync.call(this, {
            initRatings: res.data.data,
            ratings: res.data.data,
            shouldRender: true
          })
        }
      })
      .then(() => {
        // 计算每个tag的数目
        let rateLengthList = new Array(this.state.tagType.length + this.state.rateTag.length).fill(0);
        rateLengthList[0] = this.state.initRatings.length;
        this.state.initRatings.forEach((item, index) => {
          if (item.rateType === 0) {
            rateLengthList[1] += 1;
          } else if (item.rateType === 1) {
            rateLengthList[2] += 1;
          }
          if (item.tagType && item.tagType.length > 0) {
            item.tagType.forEach((tagItem, index) => {
              rateLengthList[tagItem + 3] += 1;
            })
          }
        });
        this.setState({
          rateLengthList: rateLengthList
        });
      })
      .then(() => {
        this.tagSwitch(this.state.tagSelect);
      })
  }

  tagSwitch(selectIndex) {
    this.setState({
      tagSelect: selectIndex,
      // selectRatings: selectRatings
    });
  }

  loadItems() {
    // if (!this.state.ratings.length) return;
    let ratings = Object.assign([], this.state.ratings);
    let ratingsPage = Object.assign([], this.state.ratingsPage);
    ratingsPage = ratingsPage.concat(ratings.splice(0, 6));
    if (ratings.length) {
      this.setStateAsync({
        ratingsPage: ratingsPage,
        ratings: ratings
      });
    } else {
      this.setState({
        ratingsPage: ratingsPage,
        ratings: ratings,
        hasMoreItems: false
      });
    }
  }

  openImg(img, commentItem, index, e) {
    // console.log(commentItem)
    this.setStateAsync({
      showLargePic: true,
      targetImg: e.target,
      picUrl: img,
      recommendArr: commentItem.recommend,
      imgIndex: index
    })
  }
  closeImg() {
    this.setState({
      showLargePic: false,
      targetImg: null,
      picUrl: '',
      recommendArr: [],
      imgIndex: 0
    });
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }
  FirstChild(props) {
    const childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || null;
  }

  render() {
    if (!this.state.shouldRender) return false;
    const loader = <div style={{textAlign: 'center', paddingTop: `${px2rem(10)}`, background: '#fff'}}>Loading ...</div>;
    let tagArr = this.state.tagType.concat(this.state.rateTag);
    let tagList = tagArr.map((item, index) => {
      return <li key={index} styleName={`tag-item ${index === 2 ? `negative-tag`: ``} ${index === this.state.tagSelect ? "tag-select": ``}`} onClick={this.tagSwitch.bind(this, index)}>{item}({this.state.rateLengthList[index]})</li>;
    });
    let tagSelect = this.state.tagSelect;

    // let userRatingList = [];
    let userRatingList = this.state.ratingsPage.map((commentItem, index) => {
      if (tagSelect === 1 && commentItem.rateType === 1) return; // 只取好评
      if (tagSelect === 2 && commentItem.rateType === 0) return; // 只取差评
      
      if (tagSelect > 2) {
        if (!commentItem.tagType || !commentItem.tagType.length) return;
        let selectFlag = false;
        for (let item of commentItem.tagType) {
          if (item + 3 === tagSelect) {
            selectFlag = true;
          }
        }
        if (!selectFlag) return;
      }
      return (
        <li key={index} styleName="user-comment-item">
          <div styleName="avatar-container">
            <img alt="头像" src={commentItem.avatar} />
          </div>
          
          <div styleName="comment-block-content">
            <div>
              <h4>{commentItem.username}</h4>
            </div>
            <div styleName="rate-container">
              <RateStar score={commentItem.score} width={10} totalWidth={55} />
            </div>
            <p styleName="comment-block">
              {commentItem.text}
            </p>
            {commentItem.reply && <div styleName="reply-container">商家回复: {commentItem.reply}</div>}
            {commentItem.images && commentItem.images.length ?
              (<ul styleName="comment-photo-container">
                {commentItem.images.map((img, index) => {
                  return (<li styleName="comment-photo-block" key={index}>
                    <img alt="实物照片" src={img} styleName="comment-photo" onClick={this.openImg.bind(this, img, commentItem, index)} />
                  </li>)
                })}
              </ul>  
              )
              : null
            }
            {commentItem.recommend.length ?
              (<ul styleName="comment-block-foods">
                {commentItem.recommend.map((listItem, index) => {
                  return <li styleName="comment-foods" key={index}>{listItem}</li>
                })}
              </ul>)
              : null
            }
          </div>
          <span styleName="rate-time">{formTimeString(commentItem.rateTime)}</span>
        </li>
      );
    })

    // for (let [index, commentItem] of this.state.ratingsPage.entries) {
    //   if (tagSelect === 1 && commentItem.rateType === 1) return; // 只取好评
    //   if (tagSelect === 2 && commentItem.rateType === 0) return; // 只取差评
      
    //   if (tagSelect > 2) {
    //     if (!commentItem.tagType || !commentItem.tagType.length) return;
    //     let selectFlag = false;
    //     for (let item of commentItem.tagType) {
    //       if (item + 3 === tagSelect) {
    //         selectFlag = true;
    //       }
    //     }
    //     if (!selectFlag) return;
    //   }
    //   userRatingList.push(
    //     <li key={index} styleName="user-comment-item">
    //       <div styleName="avatar-container">
    //         <img alt="头像" src={commentItem.avatar} />
    //       </div>
          
    //       <div styleName="comment-block-content">
    //         <div>
    //           <h4>{commentItem.username}</h4>
    //         </div>
    //         <div styleName="rate-container">
    //           <RateStar score={commentItem.score} width={10} totalWidth={55} />
    //         </div>
    //         <p styleName="comment-block">
    //           {commentItem.text}
    //         </p>
    //         {commentItem.reply && <div styleName="reply-container">商家回复: {commentItem.reply}</div>}
    //         {commentItem.images && commentItem.images.length ?
    //           (<ul styleName="comment-photo-container">
    //             {commentItem.images.map((img, index) => {
    //               return (<li styleName="comment-photo-block" key={index}>
    //                 <img alt="食物照片" src={img} styleName="comment-photo" onClick={this.openImg.bind(this, img, commentItem, index)} />
    //               </li>)
    //             })}
    //           </ul>  
    //           )
    //           : null
    //         }
    //         {commentItem.recommend.length ?
    //           (<ul styleName="comment-block-foods">
    //             {commentItem.recommend.map((listItem, index) => {
    //               return <li styleName="comment-foods" key={index}>{listItem}</li>
    //             })}
    //           </ul>)
    //           : null
    //         }
    //       </div>
    //       <span styleName="rate-time">{formTimeString(commentItem.rateTime)}</span>
    //     </li>
    //   );
    // }
    
    return (
      <div styleName="rating-container" ref={(ratingContainer)=>{this.ratingContainer = ratingContainer}}>
        <Scrollbars autoHide>
        {/*<div styleName="inner-container">*/}
        <div styleName="overview-container">
          <div styleName="overview-leftcol">
            <strong styleName="overview-score">{this.props.seller.foodScore}</strong>
            <div>综合评价</div>
            <div styleName="overview-compare">高于周边商家{this.props.seller.rankRate}</div>
          </div>
          <div styleName="overview-mid-line"></div>
          <div styleName="overview-rightcol">
            <div styleName="rightcol-row">
              <span styleName="row-title">服务态度</span>
              <div>
                <RateStar score={this.props.seller.serviceScore} width={10} totalWidth={55} />
              </div>
              <span styleName="overview-score">
                {this.props.seller.serviceScore}
              </span>
            </div>
            <div styleName="rightcol-row">
              <span styleName="row-title">菜品评价</span>
              <div>
                <RateStar score={this.props.seller.foodScore} width={10} totalWidth={55} />
              </div>
              <span styleName="overview-score">
                {this.props.seller.foodScore}
              </span>
            </div>
            <div styleName="rightcol-row">
              <span styleName="row-title">送达时间</span>
              <span styleName="overview-delivery-time">{this.props.seller.deliveryTime}分钟</span>
              <div></div>
            </div>
          </div>
        </div>
        <div styleName="rate-detail">
          <ul styleName="rate-tags">
          {tagList}
          </ul>
        </div>
        <InfiniteScroll
            loadMore={this.loadItems.bind(this)}
            hasMore={this.state.hasMoreItems}
            loader={loader}
            pageStart={0}
            useWindow={false}
          >
            <ul styleName="user-rating-list">
              {userRatingList}
            </ul>
          </InfiniteScroll>
        <div styleName="full-image-container" onClick={this.closeImg.bind(this)} style={{display: this.state.showLargePic? 'block':'none'}}>
          <TransitionGroup component={this.FirstChild.bind(this)} styleName="imgUrl-container">
            {this.state.picUrl ? <FullSizePic picUrl={this.state.picUrl} targetImg={this.state.targetImg} /> : null}
          </TransitionGroup>
          {this.state.recommendArr && this.state.recommendArr[this.state.imgIndex] ? <span styleName="imgUrl-name">{this.state.recommendArr[this.state.imgIndex]}</span>: null}
        </div>
        {/*</div>*/}
        </Scrollbars>
      </div>
    );
  }
}

export default CSSModules(Ratings, styles, {allowMultiple: true});
