import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './badge.scss';

class Badge extends Component {
  // constructor (props) {
  //   super(props);
  //   this.state = {

  //   }
  // }
  // componentDidMount() {

  // }
  
  render() {
    return (
      <span styleName="badge" style={{display: this.props.itemNum? "block": "none"}}>
        {this.props.itemNum}
      </span>
    );
  }
}

export default CSSModules(Badge, styles, {allowMultiple: true});