import React, { Component } from 'react';
import Loader from 'react-loader-spinner';

class Spinner extends Component {
  render() {
    return (
      <div>
        <div className="uk-position-center">
          <Loader type="Oval" color="#8248ff" height="500" width="50" />
        </div>
      </div>
    );
  }
}

export default Spinner;
