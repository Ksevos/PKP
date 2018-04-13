//@ts-check
import React, {Component} from 'react';
import Enum from '../../CustomObjects/Enum'
import './Button.css';

class PointSelectionButton extends Component{
    constructor(props){
        super(props);
        this.state = {toggled: false};
    }
    render(){
        return(
            <div>
                <button className = "PointSelectionButton" 
                        style = {{
                            backgroundColor: this.state.toggled ? Enum.Theme.BUTTON_TOGGLED : Enum.Theme.BUTTON_DEFAULT,
                            borderColor: this.state.toggled ? Enum.Theme.BUTTON_TOGGLED : Enum.Theme.BUTTON_DEFAULT
                        }}
                        onClick = { event => {
                            this.setState(prevState => { return {toggled: !prevState.toggled}});
                            this.props.onClick(!this.state.toggled);
                        }}
                />
            </div>
        );
    }
}

export default PointSelectionButton;