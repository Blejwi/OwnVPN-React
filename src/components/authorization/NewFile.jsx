import React from 'react';
import {reduxForm, Field} from 'redux-form';
import {Grid, Form} from 'semantic-ui-react';
import Actions from '../form/Actions';
import Input from '../form/Input';
import {newFile} from '../../actions/authorization';

const handleSubmit = (file) => {
    newFile(file);
};

const NewFile = ({onSubmit, submitting, pristine, reset}) => (
    <Grid padded="vertically" columns={1}>
        <Grid.Column>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Field component={Input} name="name" label="Filename" required/>
                <Field component={Input} name="password" label="Password" type="password" required/>
                <Field component={Input} name="duplicatedPassword" label="Duplicate password" type="password" required/>
                <Actions submitting={submitting} pristine={pristine} reset={reset}/>
            </Form>
        </Grid.Column>
    </Grid>
);

export default reduxForm({
    form: 'file'
})(NewFile);
