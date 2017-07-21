import React from 'react';
import { Button, Divider, Header, Segment } from 'semantic-ui-react';
import { FieldArray } from 'redux-form';
import IpAddressFields from './IpAddressFields';
import LABELS from '../../../constants/labels';

/**
 * Custom render function for Routes FieldArray option
 * @param {string} fields List of names of fields
 */
const render = ({ fields }) => (
  <Segment padded>
    <Header as="h5">{LABELS.ROUTES}</Header>
    <Button
            icon="add"
            content="Add"
            labelPosition="left"
            type="button"
            onClick={() => fields.push({})}
    />
    {fields.map((field, index) => (
      <div key={field}>
        <Divider />
        <IpAddressFields name={field} handleRemove={() => fields.remove(index)} />
      </div>
        ))}
  </Segment>
);

/**
 * Routes custom field
 */
export default () => (
  <FieldArray
        name="config.routes"
        component={render}
  />
);
