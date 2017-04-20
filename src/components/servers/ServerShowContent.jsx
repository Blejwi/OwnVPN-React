import React from 'react';
import {Button, Header, Table, TableBody} from 'semantic-ui-react';
import {Link} from 'react-router';
import Spinner from 'react-spinkit';
import UserList from '../users/UserList';
import UserWarning from '../users/UserWarning';
import ServerShowContentRow from './ServerShowContentRow';
import ServerStatus from "../../containers/servers/status/ServerStatus";

const showBoolean = value => !!value ? 'Yes': 'No';

export default ({server, setupInProgress, handleSetup, handleSetupClient, handleRemoveClient, handleDownloadConfiguration, users}) => (
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
                <ServerShowContentRow label="Tunnel type" value={server.config.dev}/>
                <ServerShowContentRow label="Topology" value={server.config.topology}/>
                <ServerShowContentRow label="Server mode" value={server.config.server_mode}/>
                <ServerShowContentRow label="Allow client's private subnet to access the VPN" value={showBoolean(server.config.allow_subnet)}/>
                <ServerShowContentRow label="Assign specific IP addresses to specific clients" value={showBoolean(server.config.assign_ip)}/>
                <ServerShowContentRow label="Maintain a record of client <-> virtual IP address" value={showBoolean(server.config.ifconfig_pool_persist)}/>
                <ServerShowContentRow label="Learn address script" value={server.config.learn_address}/>
                <ServerShowContentRow label="Allow different clients to 'see' each other" value={showBoolean(server.config.client_to_client)}/>
                <ServerShowContentRow label="Allow multiple clients to connect with the same certificate/key" value={showBoolean(server.config.duplicate_cn)}/>
                <ServerShowContentRow label="TLS-Auth" value={showBoolean(server.config.tls_auth)}/>
                <ServerShowContentRow label="Auth algorithm" value={server.config.auth_algorithm}/>
                <ServerShowContentRow label="Cipher algorithm" value={server.config.cipher_algorithm}/>
                <ServerShowContentRow label="Enable compression" value={showBoolean(server.config.compress)}/>
                <ServerShowContentRow label="Max clients" value={server.config.max_clients}/>
                <ServerShowContentRow label="User privilege" value={server.config.user_privilege}/>
                <ServerShowContentRow label="Group privilege" value={server.config.group_privilege}/>
                <ServerShowContentRow label="Persist key" value={showBoolean(server.config.persist_key)}/>
                <ServerShowContentRow label="Persist tunnel" value={showBoolean(server.config.persist_tun)}/>
                <ServerShowContentRow label="Log level" value={server.config.verb}/>
                <ServerShowContentRow label="Mute" value={server.config.mute}/>
                <ServerShowContentRow label="Notify the client when the server restarts" value={showBoolean(server.config.persist_key)}/>
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
            handleDownloadConfiguration={handleDownloadConfiguration}
            setupInProgress={setupInProgress}
        />
        <Link to={`/server/${server.id}/user/add`}><Button>Add User</Button></Link>
    </div>
);
