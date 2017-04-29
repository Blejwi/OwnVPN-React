import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Field } from 'redux-form';
import Input from '../../form/Input';
import { minValue, required } from '../../../utils/validators';

export default () => (
  <Segment padded>
    <Header as="h5">Keep alive</Header>
    <Field
            component={Input}
            name="config.keep_alive.ping"
            type="number"
            label="Ping"
            min="1"
            required
            validate={[required, minValue(1)]}
    />
    <Field
            component={Input}
            name="config.keep_alive.duration"
            type="number"
            label="Ping"
            min="1"
            required
            validate={[required, minValue(1)]}
    />
  </Segment>
);
