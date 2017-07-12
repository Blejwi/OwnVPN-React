import React from 'react';
import { connect } from 'react-redux';
import ServerList from '../../components/servers/ServerList';
import { getServerArray } from '../../selectors/servers';

/**
 * Container for displaying servers' list
 * @param props
 * @constructor
 */
const ServerMenu = props => (
  <ServerList servers={props.servers} activeMenuItem={props.activeMenuItem} />
);

const mapStateToProps = state => ({
    servers: getServerArray(state),
    activeMenuItem: state.menu.sidebar_active,
});

export default connect(mapStateToProps)(ServerMenu);
