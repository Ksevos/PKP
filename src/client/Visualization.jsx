//@ts-check

//For jsdoc only
/* eslint-disable */
import HoveredOnPointEventArgs from "./Events/HoveredOnPointEventArgs";
/* eslint-enable */

import React, {Component} from 'react';
import Toolbar from "./Toolbar/Toolbar";
import DataHandler from './DataHandler';
import {Link} from 'react-router-dom'
import Renderer from './Renderer/Renderer';

import PointSelectionInfoBox from './ReactComponents/PointSelection/InfoBox';
import PointSelectionButton from './ReactComponents/PointSelection/Button';
import DataInfoBox from './ReactComponents/DataInfoBox';

//CSS
import './Visualization.css';
import DimensionToggleButton from "./ReactComponents/DimensionToggleButton";

/**
 * Page used to visualize and interact with uploaded data
 */
class Visualization extends Component {
    constructor(props) {
        super(props);
        this.dataHandler = new DataHandler();
        this.state = {
            PointSelectionInfoBox: {
                show: false,
                position: {x:0,y:0},
                index: 0
            },
            dataInfoBox: {
                show: true,
                bounds: {
                    xMin: 0,
                    xMax: 0,
                    yMin: 0,
                    yMax: 0,
                    zMin: 0,
                    zMax: 0
                }
            }
        }
    }

    componentDidMount() {
        if(!this.threeRenderer)
            this.threeRenderer = new Renderer(this.mount.clientWidth, this.mount.clientHeight);

        this.dataHandler.subscribeToChangeEvent(this.threeRenderer.onDataChange.bind(this.threeRenderer));
        this.dataHandler.subscribeToChangeEvent(this._onDataChange.bind(this));
        this.threeRenderer.subscribeToHoveredOnPointEvent(this._onShowPointData.bind(this));

        this.mount.appendChild(this.threeRenderer.getRenderer().domElement);
        this.threeRenderer.start();

        this.dataHandler.downloadData();

        //ControlsGUI
        this.toolbar = new Toolbar(this.threeRenderer, this.dataHandler);
       // this.toolbar.subscribeToToggle2DEvent(this.threeRenderer.on2DToggled.bind(this.threeRenderer));

        this.componentMounted = true;
    }

    componentWillUnmount() {
        this.toolbar.destroy();
        this.threeRenderer.stop();
        this.dataHandler.unsubscribeFromChangeEvent(this.threeRenderer.onDataChange);
        //Remove all children
        while(this.mount.firstChild){
            this.mount.removeChild(this.mount.firstChild);
        }
    }

    /**
     * Callback to DataChanged event
     * @param {*} sender 
     * @param {*} args 
     * @private
     */
    _onDataChange(sender, args){
        this.setState(prevState => { 
            return {
                dataInfoBox:{
                    show: prevState.dataInfoBox.show,
                    bounds:{         
                        xMin: this.dataHandler.getMinValue('x'),
                        xMax: this.dataHandler.getMaxValue('x'),
                        yMin: this.dataHandler.getMinValue('y'),
                        yMax: this.dataHandler.getMaxValue('y'),
                        zMin: this.dataHandler.getMinValue('z'),
                        zMax: this.dataHandler.getMaxValue('z')
                    }
                }
            }
        });
    }

    /**
     * Callback to ShowPointData event
     * @param {*} sender 
     * @param {HoveredOnPointEventArgs} args 
     * @private
     */
    _onShowPointData(sender, args){
        if(args.getToShow()){
            this.setState({            
                PointSelectionInfoBox: {
                    show: true,
                    position: {
                        x: args.getMousePosition().x,
                        y: args.getMousePosition().y
                    },
                    index: args.getIndex()
                },}
            );
        }
        else
            this.setState({ PointSelectionInfoBox: { show: false } });
    }

    /**
     * Callback to when PointSelectButton gets clicked
     * @param {boolean} enable 
     * @private
     */
    _onPointSelectButtonClicked(enable){
        if(enable)
            this.threeRenderer.enablePointSelection();
        else
            this.threeRenderer.disablePointSelection();
    }

    /**
     * Callback to when 2D/3D change button is clicked
     * @param {boolean} enable2D 
     */
    _onDimensionToggleButtonClicked(enable2D){
        this.toolbar.onToggle2D(enable2D);
        this.threeRenderer.on2DToggled(this.dataHandler, enable2D);
        

    }

    render() {
        return (
            <div className="Visualization"
                ref={(mount) => {
                    this.mount = mount
                }}>
                <div className = "VisualizationButtons">
                    <Link to={"/"}><span className="close-back thick"></span></Link>
                    <PointSelectionButton onClick = {this._onPointSelectButtonClicked.bind(this)}/>
                    <DimensionToggleButton onClick = {this._onDimensionToggleButtonClicked.bind(this)}/>
                </div>
                {this.state.dataInfoBox.show ? (
                    <DataInfoBox show = {this.state.dataInfoBox.show} 
                                bounds = {this.state.dataInfoBox.bounds}/>
                    ) : null}
                {this.state.PointSelectionInfoBox.show ? (
                    <PointSelectionInfoBox show = {this.state.PointSelectionInfoBox.show} 
                                position = {this.state.PointSelectionInfoBox.position} 
                                index = {this.state.PointSelectionInfoBox.index}/>
                    ) : null}
            </div>
        )
    }
}

export default Visualization;
