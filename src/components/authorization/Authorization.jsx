import React from 'react';
import { Container } from 'semantic-ui-react';

/**
 * Wrapper component for other authorization components
 * @param {node} children Children components
 */
export default ({ children }) => (
  <Container>{children}</Container>
);
