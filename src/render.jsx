import React from 'react';
import ReactDOM from 'react-dom';
import electronContextMenu from 'electron-context-menu';
import 'semantic-ui-css/semantic.min.css';
import 'react-redux-toastr/src/styles/index.scss';
import App from './containers/App';
import './resource/main.scss';

electronContextMenu();
ReactDOM.render(<App />, document.getElementById('main'));
