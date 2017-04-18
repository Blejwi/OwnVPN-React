import React from 'react';
import {reduxForm, Field, SubmissionError} from 'redux-form';
import {connect} from 'react-redux';
import {Form, Button, Header} from 'semantic-ui-react';
import {Link} from 'react-router';
import Actions from '../../components/form/Actions';
import Input from '../../components/form/Input';
import {newFile} from '../../actions/authorization';
import {required, minLength} from "../../utils/validators";
import File from "../../components/form/File";
import LoginWrapper from "../../components/authorization/LoginWrapper";

const NewFile = ({onSubmit, submitting, pristine, reset, handleSubmit, change}) => (
    <LoginWrapper header="Create new configuration file">
        <Header as="h1">New file</Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Field
                component={File}
                change={change}
                save
                type="text"
                name="filename"
                label="Config file path"
                validate={[required]}
            />
            <Field component={Input} name="password" label="Password" type="password" required validate={[required, minLength(3)]}/>
            <Field component={Input} name="duplicatedPassword" label="Duplicate password" type="password" required validate={[required, minLength(3)]} />

            <Actions submitting={submitting} pristine={pristine} reset={reset}>
                <Link to="/login"><Button>Back</Button></Link>
            </Actions>
        </Form>
    </LoginWrapper>
);

const mapDispatchToProps = dispatch => ({
    onSubmit: data => {
        if (data.password !== data.duplicatedPassword) {
            throw new SubmissionError({ duplicatedPassword: 'Passwords does not match',})
        }
        dispatch(newFile(data));
    }
});

export default connect(null, mapDispatchToProps)(reduxForm({
    form: 'file'
})(NewFile));
