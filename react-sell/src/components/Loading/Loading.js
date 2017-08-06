import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './loading.scss';

import loadingImg from './loading.gif';

class Loading extends Component {
  
  render() {
    return (
      <div styleName='loading-container'>
        <img alt="载入中..."　src={loadingImg} />
      </div>
    );
  }
}

export default CSSModules(Loading, styles, {allowMultiple: true});