//@ts-check

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import Visualization from './Visualization';
//import LoaderView from './LoaderView';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
//ReactDOM.render(<Visualization />, document.getElementById('render_window'));
//ReactDOM.render(<LoaderView />, document.getElementById('root'));
registerServiceWorker();
