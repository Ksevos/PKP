//@ts-check

import React, { Component } from 'react';
import './LoaderView.css';

class LoaderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "Downloaded data"
    };
  }

  render() {
    return (
        <div className="LoaderView">
            <input type="file" 
                   value = {this.state.data}
                   onChange = {event => {this.updateData(event)}}>
            </input>
            <p>{this.state.data}</p>
        </div>
    );
  }
  updateData(event){
  
    this.setState({
      data: event.target.value
    });
  }
}

export default LoaderView;
