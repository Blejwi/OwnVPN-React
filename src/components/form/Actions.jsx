import React from 'react';
import { Button } from 'semantic-ui-react';

/**
 * Displays unified buttons for forms
 * @param {bool} submitting Form is currently submitting
 * @param {function} reset Handles reset action
 * @param {node} children Other components to display
 */
export default ({ submitting, reset, children }) => (
  <div>
    <Button primary type="submit" disabled={submitting} loading={submitting}>
        Submit
    </Button>
    <Button secondary disabled={submitting} onClick={reset}>Clear</Button>
    {children}
  </div>
);
