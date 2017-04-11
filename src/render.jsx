import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import App from './containers/App';
import 'semantic-ui-css/semantic.min.css';
import 'react-redux-toastr/src/styles/index.scss';
import './resource/main.scss';

const root = document.getElementById("main");
const render = Component => ReactDOM.render(
    <AppContainer>
        <Component/>
    </AppContainer>,
    root
);

render(App);

if (module.hot) {
    module.hot.accept('./containers/App', () => render(App));
}
