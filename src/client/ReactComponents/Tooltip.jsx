//@ts-check
import React, {Component} from 'react';

import './Tooltip.css';

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
                <p>{this.props.title}</p>
                <p>{this.props.description}</p>
            </div>
        );
    }
}

export default Tooltip;