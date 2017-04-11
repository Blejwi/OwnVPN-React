import React from 'react';
import {Button, Header, Table, TableBody} from 'semantic-ui-react';
import {Link} from 'react-router';
import Spinner from 'react-spinkit';
import UserList from '../users/UserList';
import UserWarning from '../users/UserWarning';
import ServerShowContentRow from './ServerShowContentRow';
import ServerStatus from "../../containers/servers/status/ServerStatus";

export default ({server, setupInProgress, handleSetup, handleSetupClient, handleRemoveClient, handleDownloadOvpnFile, users}) => (
    <div>
        <Header as="h1">Server information</Header>
        <ServerStatus server={server}/>
        <Table definition>
            <TableBody>
                <ServerShowContentRow label="Name" value={server.name}/>
                <ServerShowContentRow label="Host address" value={server.host}/>
                <ServerShowContentRow label="Port" value={server.port}/>
                <ServerShowContentRow label="Username" value={server.username}/>
                <ServerShowContentRow label="SSH private key path" value={server.key}/>
            </TableBody>
        </Table>
        <Header as="h1">Certificate information</Header>
        <Table definition>
            <TableBody>
                <ServerShowContentRow label="Country" value={server.country}/>
                <ServerShowContentRow label="Province" value={server.province}/>
                <ServerShowContentRow label="City" value={server.city}/>
                <ServerShowContentRow label="Organization" value={server.org}/>
                <ServerShowContentRow label="E-mail" value={server.email}/>
                <ServerShowContentRow label="Organizational unit" value={server.ou}/>
            </TableBody>
        </Table>
        <Header as="h1">VPN Configuration</Header>
        <Table definition>
            <TableBody>
                <ServerShowContentRow label="Local IP address" value={server.config.local_ip_address}/>
                <ServerShowContentRow label="Listen port" value={server.config.port}/>
                <ServerShowContentRow label="Protocol" value={server.config.protocol}/>
                <ServerShowContentRow label="Protocol" value={server.config.protocol}/>
                <ServerShowContentRow label="Dev" value={server.config.dev}/>
                <ServerShowContentRow label="Dev-node" value={server.config.dev_node}/>
                <ServerShowContentRow label="TLS-Auth" value={(server.config.tls_auth)?'Yes':'No'}/>
                <ServerShowContentRow label="User privilege" value={server.config.user_privilege}/>
                <ServerShowContentRow label="Group privilege" value={server.config.group_privilege}/>
                <ServerShowContentRow label="Max clients" value={server.config.max_clients}/>
                <ServerShowContentRow label="Auth algorithm" value={server.config.auth_algorithm}/>
                <ServerShowContentRow label="Cipher algorithm" value={server.config.cipher_algorithm}/>
            </TableBody>
        </Table>
        <div>
            <Link to={`/server/edit/${server.id}`}><Button>Edit</Button></Link>
            <Button primary disabled={setupInProgress} onClick={() => handleSetup(server)}>
                { setupInProgress ? <Spinner spinnerName="circle" className="button-spinner" /> : null }
                Setup
            </Button>
        </div>
        <Header as="h1">Users</Header>
        <UserWarning show={server.config.dev !== 'tun'}/>
        <UserList
            users={users}
            server={server}
            handleSetupClient={handleSetupClient}
            handleRemoveClient={handleRemoveClient}
            handleDownloadOvpnFile={handleDownloadOvpnFile}
            setupInProgress={setupInProgress}
        />
        <Link to={`/server/${server.id}/user/add`}><Button>Add User</Button></Link>
    </div>
);
