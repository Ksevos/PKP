//@ts-check
import React, {Component} from 'react';
import Enum from '../CustomObjects/Enum'
import './Button.css';
import Tooltip from './Tooltip';

/**
 * Button to toggle 2D mode on and off
 */
class DimensionToggleButton extends Component{
    constructor(props){
        super(props);
        this.state = {toggled: false, showTooltip: false};
    }

    componentDidMount(){
        document.getElementById("dimensionToggleButton")
            .addEventListener(
                "mouseover",
                event=>{
                    this.setState({showTooltip: true})
                });
        document.getElementById("dimensionToggleButton")
            .addEventListener(
                "mouseout",
                event=>{
                    this.setState({showTooltip: false})
                });
    }

    render(){
        return(
            <div id="dimensionToggleButton" >
                <button 
                    className = "Button" 
                    style = {{
                        backgroundColor: this.state.toggled ? Enum.Theme.BUTTON_TOGGLED_BACKGROUND : Enum.Theme.BUTTON_DEFAULT_BACKGROUND,
                        borderColor: this.state.toggled ? Enum.Theme.BUTTON_TOGGLED_BORDER : Enum.Theme.BUTTON_DEFAULT_BORDER,
                        color: this.state.toggled ? Enum.Theme.BUTTON_DEFAULT_BACKGROUND : Enum.Theme.BUTTON_TOGGLED_BORDER,
                        fontSize: 30,
                        fontWeight: 'bold'
                    }}
                    onClick = { event => {
                        this.setState(prevState => { return {toggled: !prevState.toggled}});
                        this.props.onClick(!this.state.toggled);
                    }}>
                    {this.state.toggled ? '2D' : '3D'}
                </button>
                {this.state.showTooltip 
                    ? <Tooltip position = {{x:185, y:-100}}
                        title = "2D/3D toggle button"
                        description = "Switch between 2D and 3D modes"/> 
                    : null}
            </div>
        );
    }
}

export default DimensionToggleButton;