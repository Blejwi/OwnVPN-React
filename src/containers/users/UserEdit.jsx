import React from 'react';
import {connect} from 'react-redux';
import UserForm from '../../components/users/UserForm';
import {edit} from '../../actions/users';
import {getUser} from '../../selectors/users';

const UserEdit = props => <UserForm {...props}/>;

const mapStateToProps = (state, ownProps) => ({
    initialValues: getUser(state, ownProps)
});

const mapDispatchToProps = dispatch => ({
    onSubmit: user => dispatch(edit(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);