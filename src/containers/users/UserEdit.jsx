import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import UserForm from '../../components/users/UserForm';
import {edit} from '../../actions/users';
import {getUser} from '../../selectors/users';

const UserEdit = props => <UserForm {...props}/>;

const mapStateToProps = (state, ownProps) => {
    const user = getUser(state, ownProps);
    user.prevName = user.name;
    user.serverId = ownProps.params.id;

    return {
        initialValues: user
    }
};

const mapDispatchToProps = dispatch => ({
    onSubmit: user => {
        dispatch(edit(user));
        dispatch(push(`/server/show/${user.serverId}`));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);