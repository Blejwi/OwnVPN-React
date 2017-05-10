import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import { rebootServer } from '../../actions/servers';


const ServerActions = ({ server, setupInProgress, ...props }) => (
  <Dropdown floating button text="Actions" loading={setupInProgress}>
    <Dropdown.Menu>
      <Dropdown.Item
        disabled={setupInProgress}
        onClick={() => props.handleRebootServer(server)}
      >
        Reboot server
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = dispatch => ({
    handleRebootServer: server => dispatch(rebootServer(server)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerActions);
