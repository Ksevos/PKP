//@ts-check

import React, {Component} from 'react';
import Visualization from './Visualization';
import LoaderView from './LoaderView';
import {Switch, Route} from 'react-router-dom'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaderView: new LoaderView(),
            visualization: new Visualization()
        };
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
