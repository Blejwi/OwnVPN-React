import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { add } from '../../actions/users';
import UserForm from '../../components/users/UserForm';
import { validateUser } from '../../utils/validators';

/**
 * Container for adding user to server
 * @param props
 * @constructor
 */
const UserAdd = props => <UserForm {...props} />;

const mapStateToProps = (state, ownProps) => ({
    initialValues: {
        serverId: ownProps.params.id,
        config: {
            muteReplayWarnings: '0',
            httpProxyRetry: '0',
        }
    },
});

const mapDispatchToProps = dispatch => ({
    onSubmit: (user) => {
        validateUser(user);
        dispatch(add(user));
        dispatch(push(`/server/show/${user.serverId}`));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAdd);
