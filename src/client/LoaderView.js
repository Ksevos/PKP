//@ts-check

import React, { Component } from 'react';
import './LoaderView.css';
import Axios from 'axios';

class LoaderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
			file: null
		};
  }
  
 onFormSubmit(e){
		e.preventDefault(); // Stop form submit
		
    if (this.state.file) {
      let data = new FormData();
			data.append('file', this.state.file);
			Axios.post("http://localhost:4000/storage", data);
    }
  }
  render() {
		return(
            <form onSubmit={(e) =>{this.onFormSubmit(e)}}>
                <h1>File Upload</h1>
                <input type="file" name="dataFile" onChange={(e)=>{this.setState({file:e.target.files[0]})}} />
                <button type="submit">Upload</button>
            </form>
		);
  }
}

export default LoaderView;
