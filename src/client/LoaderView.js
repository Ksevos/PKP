//@ts-check

import React, {Component} from 'react';
import './LoaderView.css';
import Axios from 'axios';
import {Link} from 'react-router-dom'

class LoaderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        };
    }

    onFormSubmit(e) {
        e.preventDefault(); // Stop from submit

        if (this.state.file) {
            let data = new FormData();
            data.append('dataFile', this.state.file);
            Axios.post("http://localhost:4000/storage", data);
        }
    }

    render() {
        return (
            <div className={'container h-100 justify-content-center'}>
                <form className={'jumbotron my-auto'} onSubmit={(e) => {
                    this.onFormSubmit(e)
                }}>
                    <h1>File Upload</h1>
                    <input type="file" name="dataFile" onChange={(e) => {
                        this.setState({file: e.target.files[0]})
                    }}/>
                    <button className={'btn btn-primary'} type="submit">Upload</button>
                </form>
                <br/>
                <Link to='viewer'>Viewer</Link>
            </div>
        );
    }
}

export default LoaderView;
