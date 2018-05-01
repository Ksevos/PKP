//@ts-check
import React, {Component} from 'react';
import Enum from '../../CustomObjects/Enum'
import '../Button.css';
import Tooltip from '../Tooltip';
//@ts-ignore
import backgroundImageW from '../../../resources/icons/point_select_button_White.png';
//@ts-ignore
import backgroundImageB from '../../../resources/icons/point_select_button_Blue.png';

/**
 * Button to toggle point selection on and off
 */
class PointSelectionButton extends Component{
    constructor(props){
        super(props);
        this.state = {toggled: false, showTooltip: false};
    }

    componentDidMount(){
        document.getElementById("pointSelectionButton")
            .addEventListener(
                "mouseover",
                event=>{
                    this.setState({showTooltip: true})
                });
        document.getElementById("pointSelectionButton")
            .addEventListener(
                "mouseout",
                event=>{
                    this.setState({showTooltip: false})
                });
    }

    render(){
        return(
            <div id="pointSelectionButton" >
                <button 
                    className = "Button" 
                    style = {{
                        backgroundColor: this.state.toggled ? Enum.Theme.BUTTON_TOGGLED_BACKGROUND : Enum.Theme.BUTTON_DEFAULT_BACKGROUND,
                        backgroundImage: this.state.toggled ? `url(${backgroundImageW})`: `url(${backgroundImageB})`,
                        borderColor: this.state.toggled ? Enum.Theme.BUTTON_TOGGLED_BORDER : Enum.Theme.BUTTON_DEFAULT_BORDER
                    }}
                    onClick = { event => {
                        this.setState(prevState => { return {toggled: !prevState.toggled}});
                        this.props.onClick(!this.state.toggled);
                    }}/>
                {this.state.showTooltip 
                    ? <Tooltip position = {{x:100, y:-100}}
                        title = "Point Selection Button"
                        description = "When toggled, hover on a point to get it's index in the data array"/> 
                    : null}
            </div>
        );
    }
}

export default PointSelectionButton;