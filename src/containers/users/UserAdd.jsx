import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {add} from '../../actions/users';
import UserForm from '../../components/users/UserForm';

const UserAdd = props => <UserForm {...props}/>;

const mapStateToProps = (state, ownProps) => ({
   initialValues: {
       serverId: ownProps.params.id
   }
});

const mapDispatchToProps = dispatch => ({
    onSubmit: user => {
        dispatch(add(user));
        dispatch(push(`/server/show/${user.serverId}`));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAdd);
