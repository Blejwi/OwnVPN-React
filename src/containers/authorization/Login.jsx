import React from 'react';
import {Link} from 'react-router';
import {Button, Divider, Segment} from 'semantic-ui-react';
import '../../components/authorization/Login.scss';
import {connect} from "react-redux";
import {fetchRecent, openFile, openFilePassword} from "../../actions/authorization";
import LoginWrapper from "../../components/authorization/LoginWrapper";
import {getRecentFiles} from "../../selectors/authorization";
import RecentFiles from "../../components/authorization/RecentFiles";

class Login extends React.Component {
    render() {
        return (
            <LoginWrapper header="Choose configuration file">
                <Segment className="action-buttons">
                    <Link to="/login/new" className="link-block">
                        <Button size="medium" fluid>New file</Button>
                    </Link>
                    <Divider horizontal>Or</Divider>
                    <Button onClick={() => this.props.onFileOpen()} size="medium" primary fluid className="link-block">Open file</Button>
                </Segment>
                {this.props.recentFiles.length ? <RecentFiles recentFiles={this.props.recentFiles} handleClick={this.props.openRecent}/> : null}
            </LoginWrapper>
        );
    }

    componentDidMount() {
        this.props.fetchRecent();
    }
}

const mapDispatchToProps = dispatch => ({
    onFileOpen: file => dispatch(openFile(file)),
    fetchRecent: () => dispatch(fetchRecent()),
    openRecent: (filename) => dispatch(openFilePassword(filename)),
});

const mapStateToProps = state => ({
    recentFiles: getRecentFiles(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
