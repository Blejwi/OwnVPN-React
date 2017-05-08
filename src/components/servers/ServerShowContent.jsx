import React from 'react';
import { Button, Dropdown, Header, Table, TableBody } from 'semantic-ui-react';
import { Link } from 'react-router';
import UserList from '../users/UserList';
import UserWarning from '../users/UserWarning';
import ServerShowContentRow from './ServerShowContentRow';
import ServerStatus from '../../containers/servers/status/ServerStatus';
import LABELS from '../../constants/labels';

const showBoolean = (value) => {
    if (value === '1') {
        return 'Yes';
    }

    return 'No';
};

export default (props) => {
    const {
        server,
        setupInProgress,
        handleSetup,
        handleSetupClient,
        handleRemoveClient,
        handleDownloadConfiguration,
        handleLoadConfigFromServer,
        handleLoadConfigTextArea,
        users,
    } = props;

    return (
      <div>
        <Header as="h1">Server information</Header>
        <ServerStatus server={server} />
        <br />
        <Dropdown floating button text="Load configuration" loading={setupInProgress}>
          <Dropdown.Menu>
            <Dropdown.Item disabled={setupInProgress} onClick={() => handleLoadConfigFromServer(server)}>From server file</Dropdown.Item>
            <Dropdown.Item disabled={setupInProgress} onClick={() => handleLoadConfigTextArea(server)}>Paste configuration</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Table definition>
          <TableBody>
            <ServerShowContentRow label={LABELS.NAME} value={server.name} />
            <ServerShowContentRow label={LABELS.HOST} value={server.host} />
            <ServerShowContentRow label={LABELS.PORT} value={server.port} />
            <ServerShowContentRow label={LABELS.USERNAME} value={server.username} />
            <ServerShowContentRow label={LABELS.KEY} value={server.key} />
          </TableBody>
        </Table>
        <Header as="h1">Certificate information</Header>
        <Table definition>
          <TableBody>
            <ServerShowContentRow label={LABELS.COUNTRY} value={server.country} />
            <ServerShowContentRow label={LABELS.PROVINCE} value={server.province} />
            <ServerShowContentRow label={LABELS.CITY} value={server.city} />
            <ServerShowContentRow label={LABELS.ORG} value={server.org} />
            <ServerShowContentRow label={LABELS.EMAIL} value={server.email} />
            <ServerShowContentRow label={LABELS.OU} value={server.ou} />
          </TableBody>
        </Table>
        <Header as="h1">VPN Configuration</Header>
        <Table definition>
          <TableBody>
            <ServerShowContentRow
                        label={LABELS.LOCAL_IP_ADDRESS} value={server.config.local_ip_address}
            />
            <ServerShowContentRow label={LABELS.LISTEN_PORT} value={server.config.port} />
            <ServerShowContentRow label={LABELS.PROTOCOL} value={server.config.protocol} />
            <ServerShowContentRow label={LABELS.DEV} value={server.config.dev} />
            <ServerShowContentRow label={LABELS.TOPOLOGY} value={server.config.topology} />
            <ServerShowContentRow label={LABELS.SERVER_MODE} value={server.config.server_mode} />
            <ServerShowContentRow
                        label={LABELS.ALLOW_SUBNET} value={showBoolean(server.config.allow_subnet)}
            />
            <ServerShowContentRow
                        label={LABELS.ASSIGN_IP} value={showBoolean(server.config.assign_ip)}
            />
            <ServerShowContentRow
                        label={LABELS.IFCONFIG_POOL_PERSIST}
                        value={showBoolean(server.config.ifconfig_pool_persist)}
            />
            <ServerShowContentRow
                label={LABELS.LEARN_ADDRESS} value={server.config.learn_address}
            />
            <ServerShowContentRow
                        label={LABELS.CLIENT_TO_CLIENT}
                        value={showBoolean(server.config.client_to_client)}
            />
            <ServerShowContentRow
                        label={LABELS.DUPLICATE_CN} value={showBoolean(server.config.duplicate_cn)}
            />
            <ServerShowContentRow
                label={LABELS.TLS_AUTH} value={showBoolean(server.config.tls_auth)}
            />
            <ServerShowContentRow
                label={LABELS.AUTH_ALGORITHM} value={server.config.auth_algorithm}
            />
            <ServerShowContentRow
                        label={LABELS.CIPHER_ALGORITHM} value={server.config.cipher_algorithm}
            />
            <ServerShowContentRow
                label={LABELS.COMPRESS} value={showBoolean(server.config.compress)}
            />
            <ServerShowContentRow
                label={LABELS.MAX_CLIENTS} value={server.config.max_clients}
            />
            <ServerShowContentRow
                label={LABELS.USER_PRIVILEGE} value={server.config.user_privilege}
            />
            <ServerShowContentRow
                        label={LABELS.GROUP_PRIVILEGE} value={server.config.group_privilege}
            />
            <ServerShowContentRow
                        label={LABELS.PERSIST_KEY} value={showBoolean(server.config.persist_key)}
            />
            <ServerShowContentRow
                        label={LABELS.PERSIST_TUN} value={showBoolean(server.config.persist_tun)}
            />
            <ServerShowContentRow label={LABELS.VERB} value={server.config.verb} />
            <ServerShowContentRow label={LABELS.MUTE} value={server.config.mute} />
            <ServerShowContentRow
                        label={LABELS.EXPLICIT_EXIT_NOTIFY}
                        value={showBoolean(server.config.explicit_exit_notify)}
            />
          </TableBody>
        </Table>
        <div>
          <Link to={`/server/edit/${server.id}`}><Button>Edit</Button></Link>
          <Button primary disabled={setupInProgress} onClick={() => handleSetup(server)} loading={setupInProgress}>
            Setup
          </Button>
        </div>
        <Header as="h1">Users</Header>
        <UserWarning show={server.config.dev !== 'tun'} />
        <UserList
                users={users}
                server={server}
                handleSetupClient={handleSetupClient}
                handleRemoveClient={handleRemoveClient}
                handleDownloadConfiguration={handleDownloadConfiguration}
                setupInProgress={setupInProgress}
        />
        <Link to={`/server/${server.id}/user/add`}><Button>Add User</Button></Link>
      </div>
    );
};
