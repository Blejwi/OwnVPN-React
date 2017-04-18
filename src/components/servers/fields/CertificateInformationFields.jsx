import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import Input from '../../form/Input';
import {email} from '../../../utils/validators';

export default () => (
    <Segment vertical>
        <Header as="h2">Certificate information</Header>
        <Field
            component={Input}
            name="country"
            label="Country"
            help_message="Country code, for example: PL, US"
        />
        <Field component={Input} name="province" label="Province"/>
        <Field component={Input} name="city" label="City"/>
        <Field component={Input} name="org" label="Organization"/>
        <Field component={Input} name="email" label="E-mail" type="email" validate={[email]}/>
        <Field component={Input} name="ou" label="Organizational unit"/>
    </Segment>
);