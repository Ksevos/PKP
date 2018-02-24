//@ts-check

import React, { Component } from 'react';
import Visualization from './Visualization';
import LoaderView from './LoaderView';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loaderView: new LoaderView(),
        visualization: new Visualization()
    };
  }

  render() {
    return (
        <div className="App">
            <LoaderView/>
            <Visualization/>
        </div>
    );
  }

}

export default App;
