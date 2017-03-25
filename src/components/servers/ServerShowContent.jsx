import React from 'react';
import {Button, Header, Table, TableBody} from 'semantic-ui-react';
import {Link} from 'react-router';
import Spinner from 'react-spinkit';
import UserList from '../users/UserList';
import ServerShowContentRow from './ServerShowContentRow';

export default ({server, setupInProgress, handleSetup, handleSetupClient, users}) => (
    <div>
        <Header as="h1">Server information</Header>
        <Table definition>
            <TableBody>
                <ServerShowContentRow label="Name" value={server.name}/>
                <ServerShowContentRow label="Host address" value={server.host}/>
                <ServerShowContentRow label="Port" value={server.port}/>
                <ServerShowContentRow label="Username" value={server.username}/>
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
        <Header as="h1">Users</Header>
        <UserList users={users} server={server} handleSetupClient={handleSetupClient} setupInProgress={setupInProgress}/>
        <Link to={`/server/edit/${server.id}`}><Button>Edit</Button></Link>
        <Button primary disabled={setupInProgress} onClick={() => handleSetup(server)}>
            { setupInProgress ? <Spinner spinnerName="circle" className="button-spinner" /> : null }
            Setup
        </Button>
    </div>
);
