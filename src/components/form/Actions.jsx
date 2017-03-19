import React from 'react';
import {Button} from 'semantic-ui-react';
import Spinner from 'react-spinkit';

export default ({submitting, pristine, reset, children}) => (
    <div>
        <Button primary type="submit" disabled={pristine || submitting}>
            { submitting ? <Spinner spinnerName="circle" className="button-spinner" /> : null }
            Submit
        </Button>
        <Button secondary disabled={pristine || submitting} onClick={reset}>Clear</Button>
        {children}
    </div>
);
