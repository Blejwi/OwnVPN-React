import React from 'react';
import {Button} from 'semantic-ui-react';

export default ({submitting, pristine, reset, children}) => (
    <div>
        <Button primary type="submit" disabled={pristine || submitting}>Submit</Button>
        <Button secondary disabled={pristine || submitting} onClick={reset}>Clear</Button>
        {children}
    </div>
);