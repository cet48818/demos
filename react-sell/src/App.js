import React, { Component } from 'react';
// import {
//   BrowserRouter as Router,
//   Route,
//   Redirect,
//   NavLink
// } from 'react-router-dom';
import {
  HashRouter as Router,
  Route,
  Link,
  Control  
} from 'react-keeper';
import CSSModules from 'react-css-modules';
// import logo from './logo.svg';
import styles from './App.scss';
import Header from './components/Header/Header';
import Goods from './components/Goods/Goods';
import Ratings from './components/Ratings/Ratings';
import axios from 'axios';

class App extends Component {

  constructor () {
    super();
    this.state = {
      seller: {},
      shouldRender: false
    }
  }

  componentDidMount () {
    axios.get('//neodemo.duapp.com/api/seller')
    .then((res) => {
      if (!res.errno) {
        this.setState({
          seller: res.data.data,
          shouldRender: true
        })
      }
    });
  }
  
  indexFilter () {
    Control.go('/goods');
  }

  render() {
    // 防止在没有取到异步数据的情况下渲染
    if (!this.state.shouldRender) return false;

    return (
      /*<Router>
        <div className="container">
          <Header seller={this.state.seller} />
          <ul styleName="tab">
            <li styleName="tab-item"><NavLink to="/goods" activeClassName="tab-active">商品</NavLink></li>
            <li styleName="tab-item"><NavLink to="/ratings" activeClassName="tab-active">评价</NavLink></li>
          </ul>
          <Route exact path="/" render={()=>(<Redirect to="/goods" />)} />
          <Route path="/goods" component={() => {return <Goods seller={this.state.seller.carriageLadder} />}} />
          <Route path="/ratings" component={Ratings} />
        </div>
      </Router>*/
      <Router path="/>">
        <div className="container">
          <Header seller={this.state.seller} />
          <ul styleName="tab">
            <li styleName="tab-item"><Link to="/goods" activeClassName="tab-active">商品</Link></li>
            <li styleName="tab-item"><Link to="/ratings" activeClassName="tab-active">评价</Link></li>
          </ul>
          <Route exact path="/>" enterFilter={ this.indexFilter } />
          <Route index cache path="/goods" component={() => {return <Goods deliveryPrice={this.state.seller.deliveryPrice
} minPrice={this.state.seller.minPrice} />}} />
          <Route cache path="/ratings" component={() => {return <Ratings seller={this.state.seller}/>}} />
        </div>
      </Router>
    );
  }
}

export default CSSModules(App, styles, {allowMultiple: true});
