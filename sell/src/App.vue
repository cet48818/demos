<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <keep-alive exclude="ratings">
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import vHeader from './components/header/header.vue'
  import axios from 'axios'
  import {urlParse} from 'common/js/util'
  // 表示无错误
  const ERR_OK = 0
  export default {
    data () {
      return {
        seller: {
          // 从url取得商家id
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        }
      }
    },
    created () {
      // 获取商家数据的ajax方法
      axios
      .get('/api/seller?id=' + this.seller.id)
      .then((response) => {
        if (response.data.errno === ERR_OK) {
          // 取到seller
          // this.seller = response.data.data
          // 给seller添加id
          this.seller = Object.assign({}, this.seller, response.data.data)
          // console.log(this.seller.id)
          return this.seller
        }
      })
    },
    components: {
      // 'v-header': header
      vHeader
    }
  }
</script>

<style lang="scss">
  // 使用mixin不能省略依赖否则编译出错
  @import "./common/scss/mixin";
  #app {
    .tab {
      display: flex;
      height: 40px;
      line-height: 40px;
      // border-bottom: 1px solid rgba(7, 17, 27, .1);
      @include border-1px(rgba(7, 17, 27, .1));
      .tab-item {
        flex: 1;
        text-align: center;
        & > a {
          display: block;
          font-size: 14px;
          color: rgb(77, 85, 93);
          &.active {
            color: rgb(240, 20, 20);
          }
        }
      }
    }
  }
</style>
