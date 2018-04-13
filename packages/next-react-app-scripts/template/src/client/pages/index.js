import React, { Component, Fragment } from 'react';

import Header from '../components/Header';

import './index.css';

class App extends Component {
  static async getInitialProps() {
    return {
      name: 'Next React App'
    };
  }

  render() {
    return (
      <Fragment>
        <Header />
        <div className="index__container">
          <div>Hello {this.props.name}.</div>
          <div>I am the "index.js" page. Modify me and see what happens.</div>
        </div>
      </Fragment>
    );
  }
}

export default App;
