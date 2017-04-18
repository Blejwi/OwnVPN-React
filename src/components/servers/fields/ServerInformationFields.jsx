import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import Input from '../../form/Input';
import File from '../../form/File';
import {required, minValue, maxValue} from "../../../utils/validators";


export default ({change}) => (
    <Segment vertical>
        <Header as="h2">Server information</Header>
        <Field
            component={Input}
            name="name"
            label="Name"
            required
            validate={[required]}
        />
        <Field
            component={Input}
            name="host"
            label="Host address"
            required
            validate={[required]}
        />
        <Field
            component={Input}
            name="password"
            label="Password"
            type="password"
        />
        <Field
            component={Input}
            name="port"
            label="Port"
            type="number"
            min="1"
            max="65535"
            step="1"
            required
            validate={[required, minValue(1), maxValue(65535)]}
        />
        <Field
            component={Input}
            name="username"
            label="Username"
            required
            validate={[required]}
        />
        <Field
            component={File}
            change={change}
            type="text"
            name="key"
            label="SSH private key path"
            disabled
        />
    </Segment>
);
