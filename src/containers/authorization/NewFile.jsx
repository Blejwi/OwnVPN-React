import React from 'react';
import {reduxForm, Field, SubmissionError} from 'redux-form';
import {connect} from 'react-redux';
import {Grid, Form, Button, Header} from 'semantic-ui-react';
import {Link} from 'react-router';
import Actions from '../../components/form/Actions';
import Input from '../../components/form/Input';
import {newFile} from '../../actions/authorization';
import {required, minLength} from "../../utils/validators";

const NewFile = ({onSubmit, submitting, pristine, reset, handleSubmit}) => (
    <Grid padded="vertically" columns={1}>
        <Grid.Column>
            <Header as="h1">New file</Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Field component={Input} name="password" label="Password" type="password" required validate={[required, minLength(3)]}/>
                <Field component={Input} name="duplicatedPassword" label="Duplicate password" type="password" required validate={[required, minLength(3)]} />

                <Actions submitting={submitting} pristine={pristine} reset={reset}>
                    <Link to="/login/open"><Button>Open file</Button></Link>
                </Actions>
            </Form>
        </Grid.Column>
    </Grid>
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
