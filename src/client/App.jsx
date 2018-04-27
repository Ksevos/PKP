//@ts-check

import React, {Component} from 'react';
import Visualization from './Visualization';
import LoaderView from './LoaderView';
import {Switch, Route} from 'react-router-dom'
import Stats from "stats.js";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaderView: new LoaderView(),
            visualization: new Visualization()
        };
        this.createStatsPanel();
    }

    createStatsPanel() {
        const statsPanel = new Stats();
        statsPanel.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( statsPanel.dom );
        function animate() {
            statsPanel.begin();
            // monitored code goes here
            statsPanel.end();
            requestAnimationFrame( animate );
        }
        requestAnimationFrame( animate );
    }

    render() {
        return (
            <Switch>
                <Route exact path='/' component={LoaderView}/>
                <Route path='/viewer' component={Visualization}/>
            </Switch>
        );
    }

}

export default App;
