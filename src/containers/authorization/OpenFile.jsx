import React from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import {Grid, Form} from 'semantic-ui-react';
import Actions from '../../components/form/Actions';
import Input from '../../components/form/Input';
import {openFile} from '../../actions/authorization';

const OpenFile = ({onSubmit, submitting, pristine, reset, handleSubmit}) => (
    <Grid padded="vertically" columns={1}>
        <Grid.Column>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Field component={Input} name="password" label="Password" type="password" required/>
                <Actions submitting={submitting} pristine={pristine} reset={reset}/>
            </Form>
        </Grid.Column>
    </Grid>
);

const mapDispatchToProps = dispatch => ({
    handleSubmit: file => dispatch(openFile(file))
});

export default connect(null, mapDispatchToProps)(reduxForm({
    form: 'file'
})(OpenFile));