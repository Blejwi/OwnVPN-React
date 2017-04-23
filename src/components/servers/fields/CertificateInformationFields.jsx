import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Field} from 'redux-form';
import Input from '../../form/Input';
import {email} from '../../../utils/validators';
import * as HELPER_MESSAGE from '../../../constants/help_messages';
import LABELS from '../../../constants/labels';

export default () => (
    <Segment vertical>
        <Header as="h2">Certificate information</Header>
        <Field
            component={Input}
            name="country"
            label={LABELS.COUNTRY}
            helpMessage={HELPER_MESSAGE.COUNTRY}
        />
        <Field
            component={Input}
            name="province"
            label={LABELS.PROVINCE}
        />
        <Field
            component={Input}
            name="city"
            label={LABELS.CITY}
        />
        <Field
            component={Input}
            name="org"
            label={LABELS.ORG}
        />
        <Field
            component={Input}
            name="email"
            label={LABELS.EMAIL}
            validate={[email]}
        />
        <Field
            component={Input}
            name="ou"
            label={LABELS.OU}
        />
    </Segment>
);
