import React from 'react';
import {connect} from 'react-redux';
import './Home.scss';

class Home extends React.Component {
    render() {
        return (
            <div className="homepage"><span className="logo">OwnVPN</span></div>
        )
    }
}

export default connect()(Home);
