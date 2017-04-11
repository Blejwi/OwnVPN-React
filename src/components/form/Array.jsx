import React from 'react';
import {FieldArray} from 'redux-form';
import {Segment, Button, Divider, Header} from 'semantic-ui-react';

const render = (Component, label) => ({fields}) => (
    <Segment padded={true}>
        <Header as="h5">{label}</Header>
        <Button
            icon="add"
            content="Add"
            labelPosition="left"
            onClick={() => fields.push({})}
        />
        {fields.map((field, index) => (
            <div key={index}>
                <Divider/>
                <Component name={field} handleRemove={() => fields.remove(index)}/>
            </div>
        ))}
    </Segment>
);

export default ({name, label, component}) => (
    <FieldArray
        name={name}
        component={render(component, label)}
    />
)
