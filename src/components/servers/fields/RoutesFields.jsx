import React from 'react';
import { Button, Divider, Header, Segment } from 'semantic-ui-react';
import { FieldArray } from 'redux-form';
import IpAddressFields from './IpAddressFields';
import LABELS from '../../../constants/labels';

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

export default () => (
  <FieldArray
        name="config.routes"
        component={render}
  />
);
