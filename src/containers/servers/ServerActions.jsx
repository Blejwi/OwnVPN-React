import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import { map } from 'lodash';
import { rebootServer, reuploadConfig, vpnAction } from '../../actions/servers';


const ServerActions = ({ server, setupInProgress, ...props }) => {
    const items = [
        { title: 'Reboot server', onClick: () => props.handleRebootServer(server) },
        { title: 'Start VPN', onClick: () => props.handleVpnAction(server, 'startVpn') },
        { title: 'Stop VPN', onClick: () => props.handleVpnAction(server, 'stopVpn') },
        { title: 'Restart VPN', onClick: () => props.handleVpnAction(server, 'restartVpn') },
        { title: 'Reupload config', onClick: () => props.handleReuploadConfig(server) },
    ];

    return (
      <Dropdown floating button text="Actions" loading={setupInProgress}>
        <Dropdown.Menu>
          {map(items, item => (
            <Dropdown.Item
                disabled={setupInProgress}
                onClick={item.onClick}
            >
              {item.title}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
};

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = dispatch => ({
    handleRebootServer: server => dispatch(rebootServer(server)),
    handleVpnAction: (server, action) => dispatch(vpnAction(server, action)),
    handleReuploadConfig: server => dispatch(reuploadConfig(server)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerActions);
