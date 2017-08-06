import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './cartControl.scss';
import ReactSVG from 'react-svg';
import addSVG from './add-min.svg';
import minusSVG from './minus-min.svg';
import _ from 'lodash';

class CartControl extends Component {
  constructor () {
    super();
    this.state = {
      count: 0

    }
  }
  componentDidMount() {
    this.setState({
      count: this.props.initCount
    })
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.initCount !== nextProps.initCount) {
    this.setState({
      count: nextProps.initCount
    })
    }
  }
  
  // handleAdd() {
  //   _.throttle(this.addCart.bind(this), 100, {'leading': true, 'trailing': false});
  // }

  addCart() { // +1
    // e.preventDefault();
    this.setStateAsync((prevState) => ({
      count: prevState.count + 1
    }))
    .then(() => {
      this.props.callbackParent(this.props.foodIndex, this.state.count, true, this.cartAddBtn);
    })
  }
  decreaseCart(e) { // -1
    // e.preventDefault();
    if (this.state.count > 0) {
      this.setStateAsync((prevState) => ({
        count: prevState.count - 1
      }))
      .then(() => {
        this.props.callbackParent(this.props.foodIndex, this.state.count, false, this.cartAddBtn);
      })
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }
  
  render() {
    let decreasePart =  
      (<div styleName={this.state.count? 'visible': 'un-visible'}>
        <div onClick={this.decreaseCart.bind(this)}>
        <ReactSVG
          path={minusSVG}
          styleName="control-SVG minus"
        />
        </div>
        <span styleName="cart-num">{this.state.count}</span>
      </div>
      );

    return (
      <div styleName="control-container">
        <div>
        {decreasePart}
        </div>
        <div onClick={_.debounce(this.addCart.bind(this), 60)} ref={(cartAddBtn) => {this.cartAddBtn = cartAddBtn;}}>
          {/*<div onClick={this.addCart.bind(this)} ref={(cartAddBtn) => {this.cartAddBtn = cartAddBtn;}}>*/}
          {/*<div onClick={this.handleAdd.bind(this)} ref={(cartAddBtn) => {this.cartAddBtn = cartAddBtn;}}>*/}
          <ReactSVG
            path={addSVG}
            styleName="control-SVG"
          />
        </div>
      </div>
    );
  }
}

export default CSSModules(CartControl, styles, {allowMultiple: true});