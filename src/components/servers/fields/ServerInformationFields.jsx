import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { Field } from 'redux-form';
import LABELS from '../../../constants/labels';
import Input from '../../form/Input';
import File from '../../form/File';
import { required, minValue, maxValue } from '../../../utils/validators';

/**
 * Server information section
 * @param {function} change Change function of redux-form
 */
export default ({ change }) => (
  <Segment vertical>
    <Header as="h2">Server information</Header>
    <Field
            component={Input}
            name="name"
            label={LABELS.NAME}
            required
            validate={[required]}
    />
    <Field
            component={Input}
            name="host"
            label={LABELS.HOST}
            required
            validate={[required]}
    />
    <Field
            component={Input}
            name="port"
            label={LABELS.PORT}
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
            label={LABELS.USERNAME}
            required
            validate={[required]}
    />
    <Field
      component={Input}
      name="password"
      label={LABELS.PASSWORD}
      type="password"
    />
    <Field
            component={File}
            change={change}
            type="text"
            name="key"
            label={LABELS.KEY}
    />
  </Segment>
);
