//@ts-check

import React, { Component}  from 'react';

import './PointInfoBox.css';

/**
 * A box to show a single data point information
 */
class PointInfoBox extends Component {
    render(){
        return(
            <div className="PointInfoBox"
                style = {{
                    left: ((this.props.position.x + 1) / 2) * window.innerWidth + 'px',
                    bottom: ((this.props.position.y + 1 ) / 2) * window.innerHeight + 'px'
                }}>
                <p>Point spot in array is: {this.props.index}</p>
            </div>
        )
    }
}

export default PointInfoBox;