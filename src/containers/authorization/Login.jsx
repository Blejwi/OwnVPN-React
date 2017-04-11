import React from 'react';
import {Link} from 'react-router';
import {Button, Divider, Segment} from 'semantic-ui-react';
import '../../components/authorization/Login.scss';
import {connect} from "react-redux";
import {openFile} from "../../actions/authorization";
import LoginWrapper from "../../components/authorization/LoginWrapper";

const Login = ({onFileOpen}) => (
    <LoginWrapper header="Choose configuration file">
        <Segment className="action-buttons">
            <Link to="/login/new" className="link-block">
                <Button size="medium" fluid>New file</Button>
            </Link>
            <Divider horizontal>Or</Divider>
            <Button onClick={() => onFileOpen()} size="medium" primary fluid className="link-block">Open file</Button>
        </Segment>
    </LoginWrapper>
);

const mapDispatchToProps = dispatch => ({
    onFileOpen: file => dispatch(openFile(file))
});

export default connect(null, mapDispatchToProps)(Login);
