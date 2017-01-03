<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click="decreaseCart"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script>
  // import Vue from 'vue'
  import Bus from 'common/js/bus.js'
  export default {
    props: {
      food: Object
    },
    methods: {
      addCart (event) {
        if (!event._constructed) { // 阻止原生click事件, 使用BScroll派发click事件
          return
        }
        // this.$emit('increase')
        Bus.$emit('cartAdd', event.target)
        if (!this.food.count) {
          // this.food.count = 1
          // Vue 不能检测到对象属性的添加或删除
          // Vue.set(this.food, 'count', 1)
          this.$set(this.food, 'count', 1)
        } else {
          this.food.count += 1
        }
      },
      decreaseCart (event) {
        if (!event._constructed) { // 阻止原生click事件, 使用BScroll派发click事件
          return
        }
        // this.$emit('decrease')
        if (this.food.count) {
          this.food.count -= 1
        }
      }
    }
  }
</script>

<style lang="scss">
  .cartcontrol {
    font-size: 0;
    .cart-decrease,
    .cart-add {
      display: inline-block;
      padding: 6px;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
      // 动画开始
      &.move-enter-active {
        transition: all .4s linear;
        opacity: 1;
        transform: translate3d(0, 0, 0) rotate(180deg);
      }
      &.move-leave-active {
        transition: all .4s linear;
        opacity: 0;
        transform: translate3d(40px, 0, 0) rotate(-180deg);
      }
      &.move-enter {
        opacity: 0;
        transform: translate3d(24px, 0, 0) rotate(0);
      }
      &.move-leave {
        opacity: 1;
        transform: translate3d(0, 0, 0) rotate(0);
      }
      // 动画结束
    }
    .cart-count {
      display: inline-block;
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147, 153, 159);
    }
    .cart-add {
      display: inline-block;
    }
  }
</style>