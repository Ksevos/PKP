//@ts-check

import React, { Component}  from 'react';

import './PointInfoBox.css';
class PointInfoBox extends Component {
    constructor(props){
        super(props);

        this.state = {
            pointIndex: -1
        };
    }

    setPointIndex(value){
        this.state.pointIndex = value;
    }

    render(){
        return(
            <div className="PointInfoBox">
                <p>Point spot in array is: {this.state.thing}</p>
            </div>
        )
    }
}

export default PointInfoBox;