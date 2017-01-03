<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                  <!-- <cartcontrol :food="food" @increase="increaseCount(food)" @decrease="decreaseCount(food)"></cartcontrol> -->
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script>
  import axios from 'axios'
  import BScroll from 'better-scroll'
  import shopcart from 'components/shopcart/shopcart'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  const ERR_OK = 0
  export default {
    // props: {
    //   seller: Object
    // },
    props: ['seller'],
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0
      }
    },
    computed: {
      currentIndex () {
        for (let [index, item] of this.listHeight.entries()) {
          let height1 = item
          let height2 = this.listHeight[index + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return index
          }
        }
        return 0
      },
      selectFoods () {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created () {
      // 重复利用, 可抽象成组件
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      axios
      .get('/api/goods')
      .then((response) => {
        if (response.data.errno === ERR_OK) {
          this.goods = response.data.data
          this.$nextTick(() => {
            // scroll
            this._initScroll()
            this._calculateHeight()
          })
          return this.goods
        }
      })
    },
    methods: {
      // increaseCount (food) {
      //   if (!food.count) {
      //     // this.food.count = 1
      //     // Vue 不能检测到对象属性的添加或删除
      //     // Vue.set(this.food, 'count', 1)
      //     this.$set(food, 'count', 1)
      //   } else {
      //     food.count += 1
      //   }
      // },
      // decreaseCount (food) {
      //   if (food.count) {
      //     food.count -= 1
      //   }
      // },
      // drop (target) {
      //   console.log(target)
      // },
      selectMenu (index, event) {
        // 只使用BScroll派发的点击事件,阻止原生点击事件
        if (event._constructed) { // BScroll特有属性
          let foodList = this.$refs.foodsWrapper.querySelectorAll('.food-list-hook')
          let el = foodList[index]
          // scrollToElement是BScroll提供的接口
          this.foodsScroll.scrollToElement(el, 300)
          return
        }
      },
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true // 启用click事件
        })
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3 // 实时派发scroll事件
        })
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight () {
        let foodList = this.$refs.foodsWrapper.querySelectorAll('.food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let item of foodList) {
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    components: {
      shopcart,
      cartcontrol
    }
  }
</script>

<style lang="scss">
  @import "../../common/scss/mixin";
  .goods {
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
    .menu-wrapper {
      // flex-grow, flex-shrink 和 flex-basis, 默认0 1 auto
      flex: 0 0 80px;
      width: 80px;
      background: #f3f5f7;
      .menu-item {
        display: table;
        padding: 0 12px;
        height: 54px;
        width: 56px;
        line-height: 14px;
        &.current {
          position: relative;
          z-index: 10;
          margin-top: -1px;
          font-weight: 700;
          background: #fff;
          .text {
            @include border-none;
          }
        }
        .icon {
          display: inline-block;
          margin-right: 2px;
          width: 12px;
          height: 12px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          vertical-align: top;
          &.decrease {
            @include bg-image('decrease_3');
          }
          &.discount {
            @include bg-image('discount_3');
          }
          &.guarantee {
            @include bg-image('guarantee_3');
          }
          &.invoice {
            @include bg-image('invoice_3');
          }
          &.special {
            @include bg-image('special_3');
          }
        }
        .text {
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          @include border-1px(rgba(7, 17, 27, .1));
          font-size: 12px;
        }
      }
    }
    .foods-wrapper {
      // 可以伸展
      flex: 1;
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }
      .food-item {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        @include border-1px(rgba(7, 17, 27, 0.1));
        &:last-child {
          @include border-none;
          margin-bottom: 0;
        }
        .icon {
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          .name {
            margin: 2px 0 8px 0;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .desc,
          .extra {
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .desc {
            margin-bottom: 8px;
            line-height: 12px;
          }
          .extra {
            .count {
              margin-right: 12px;
            }
          }
          .price {
            font-weight: 700;
            line-height: 24px;
            .now {
              margin-right: 8px;
              font-size: 14px;
              color: rgb(240, 20, 20);
            }
            .old {
              text-decoration: line-through;
              font-size: 10px;
              color: rgb(147, 163, 159);
            }
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
</style>