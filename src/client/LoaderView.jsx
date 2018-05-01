//@ts-check

import React, {Component, FormEvent} from 'react';
import './LoaderView.css';
import Axios from 'axios';
import SocketIOClient from 'socket.io-client';

/**
 * Page used to upload data
 */
class LoaderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            uploading: false,
            errorMessage: null
        };
        this.closeAlert = this.closeAlert.bind(this);
        //Listens for "dataUploaded" message from the server
        this.socket = SocketIOClient(process.env.BACKEND_URL || "http://localhost:4000");
        this.socket.on('dataUploaded', (message) => {
            if (this.props) {
                this.props.history.push('/viewer');
            }
        });
    }

    /**
     * Callback to upload button
     * @param {FormEvent} e 
     */
    onFormSubmit(e) {
        e.preventDefault(); // Stop from submit

        if (this.state.file) {
            this.setState({uploading: true});
            let data = new FormData();
            data.append('dataFile', this.state.file);
            Axios.post(process.env.BACKEND_URL || "http://localhost:4000" + "/storage", data).catch(error => {
                if(error.response)
                    if(error.response.data)
                        this.setState({uploading: false, errorMessage: error.response.data.message});
            });
        } else {
            this.setState({errorMessage: 'No file selected'});
        }
    }

    /**
     * Close error message
     */
    closeAlert() {
        this.setState({errorMessage: null});
    }

    render() {
        const errorMessage = this.state.errorMessage;
        return (
            <div className={'container h-100 justify-content-center jumbotron'}>
                {this.state.errorMessage ? <div className={'alert alert-danger'}>
                    <a className="close" onClick={this.closeAlert}>&times;</a>
                    {errorMessage}
                    </div> : null}
                <div className="row">
                    <div className="col-md-8">
                        <form className={'my-auto'} onSubmit={(e) => {
                            this.onFormSubmit(e)
                        }}>
                            <h1>File Upload</h1>
                            <input type="file" name="dataFile" onChange={(e) => {
                                this.setState({file: e.target.files[0]})
                            }}/>
                            <button className={'btn btn-primary'} type="submit">Upload</button>
                        </form>
                    </div>
                    <div className="col-md-4">
                        {this.state.uploading ? <div className='loader'></div> : null}
                    </div>
                </div>

                <br/>
            </div>
        );
    }
}

export default LoaderView;
