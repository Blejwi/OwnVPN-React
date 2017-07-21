import React from 'react';
import { Card, Grid } from 'semantic-ui-react';
import './Login.scss';

/**
 * Wrapper for authorization containers
 * @param {string|custom} header Header component
 * @param {node} children Children components
 */
export default ({ header, children }) => (
  <Grid verticalAlign="middle" centered className="loginGrid">
    <Grid.Column>
      <Card className="login" raised>
        <Card.Content>
          <Card.Header>
            {header}
          </Card.Header>
        </Card.Content>
        <Card.Content>
          {children}
        </Card.Content>
      </Card>
    </Grid.Column>
  </Grid>
);
