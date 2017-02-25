import React from 'react';
import {reduxForm, Field} from 'redux-form';
import {Grid, Form} from 'semantic-ui-react';
import Actions from '../form/Actions';
import Input from '../form/Input';
import {openFile} from '../../actions/authorization';

const handleSubmit = (file) => {
    openFile(file);
};

const OpenFile = ({onSubmit, submitting, pristine, reset}) => (
    <Grid padded="vertically" columns={1}>
        <Grid.Column>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Field component={Input} name="password" label="Password" type="password" required/>
                <Actions submitting={submitting} pristine={pristine} reset={reset}/>
            </Form>
        </Grid.Column>
    </Grid>
);

export default reduxForm({
    form: 'file'
})(OpenFile);
