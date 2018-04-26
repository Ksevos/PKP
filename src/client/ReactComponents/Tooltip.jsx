//@ts-check
import React, {Component} from 'react';

import './Tooltip.css';

/**
 * A box which shows description and title of an item
 */
class Tooltip extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="Tooltip"
                style = {{
                    left: this.props.position.x + 'px',
                    bottom: this.props.position.y + 'px'
                }}>
                <h2>{this.props.title}</h2>
                <p>{this.props.description}</p>
            </div>
        );
    }
}

export default Tooltip;