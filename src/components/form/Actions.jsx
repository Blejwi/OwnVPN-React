import React from 'react';
import { Button } from 'semantic-ui-react';

export default ({ submitting, reset, children }) => (
  <div>
    <Button primary type="submit" disabled={submitting} loading={submitting}>
        Submit
    </Button>
    <Button secondary disabled={submitting} onClick={reset}>Clear</Button>
    {children}
  </div>
);
