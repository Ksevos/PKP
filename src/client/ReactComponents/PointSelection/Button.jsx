//@ts-check
import React, {Component} from 'react';
import Enum from '../../CustomObjects/Enum'
import './Button.css';
import Tooltip from '../Tooltip';

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
                    className = "PointSelectionButton" 
                    style = {{
                        backgroundColor: this.state.toggled ? Enum.Theme.BUTTON_TOGGLED : Enum.Theme.BUTTON_DEFAULT,
                        borderColor: this.state.toggled ? Enum.Theme.BUTTON_TOGGLED : Enum.Theme.BUTTON_DEFAULT
                    }}
                    onClick = { event => {
                        this.setState(prevState => { return {toggled: !prevState.toggled}});
                        this.props.onClick(!this.state.toggled);
                    }}/>
                {this.state.showTooltip 
                    ? <Tooltip position = {{x:180, y:-100}}
                        title = "Point Selection Button"
                        description = "When toggled, hover on a point to get it's index in the data array"/> 
                    : null}
            </div>
        );
    }
}

export default PointSelectionButton;