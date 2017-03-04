import React from 'react';
import {connect} from 'react-redux';
import {add} from '../../actions/users';
import UserForm from '../../components/users/UserForm';

const UserAdd = props => <UserForm {...props}/>;

const mapDispatchToProps = dispatch => ({
    onSubmit: user => dispatch(add(user))
});

export default connect(null, mapDispatchToProps)(UserAdd);