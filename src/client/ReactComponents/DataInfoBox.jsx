//@ts-check

import React, {Component} from 'react';
import './DataInfoBox.css';

/**
 * Info box to show data bounds
 */
class DataInfoBox extends Component{ 
    render(){
        return(
            <div className="DataInfoBox">
                <h4>Data bounds</h4>
                <p id="X">X: [ {this.props.bounds.xMin}; {this.props.bounds.xMax}]</p>
                <p id="Y">Y: [ {this.props.bounds.yMin}; {this.props.bounds.yMax}]</p>
                <p id="Z">Z: [ {this.props.bounds.zMin}; {this.props.bounds.zMax}]</p>
            </div>
        )
    }
}

export default DataInfoBox;