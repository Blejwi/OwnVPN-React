import { map } from 'lodash';
import { STATUS } from '../constants/servers';

export default class SSHStats {
    constructor(ssh, dispatch) {
        this.dispatch = dispatch;
        this.ssh = ssh;
    }

    getVpnStatus() {
        return new Promise((resolve, reject) => {
            this.ssh.connection
                .then(() => this.isInstalled(resolve, reject))
                .then(() => this.isActive(resolve, reject))
                .catch(reject);
        });
    }

    getMachineStatus() {
        let details = '';
        return new Promise((resolve, reject) => {
            this.ssh.connection
                .then(() => this.getMemoryStats().then((message) => {
                    details += message;
                }))
                .then(() => this.getSystemStats(details).then((message) => {
                    details += message;
                }))
                .then(() => this.getVpnStats().then((message) => {
                    details += message;
                }))
                .then(() => resolve(details))
                .catch(reject);
        });
    }

    getVpnStats() {
        const title = '<h5>OpenVPN - top</h5>';
        return this.ssh.runCommand('top -bn1 | top -bn 1 -d 0.01 | grep \'openvpn\\|^  PID\'')
            .then(r => `${title}<pre>${r.stdout}</pre>`)
            .catch(() => `${title}<pre>Could not get vpn details, check logs for details</pre>`);
    }

    getSystemStats() {
        const title = '<h5>System details</h5>';
        return this.ssh.runCommand('top -bn 1 | head -n 5')
            .then(r => `${title}<pre>${r.stdout}</pre>`)
            .catch(() => `${title}<pre>Could not get system details, check logs for details</pre>`);
    }

    getMemoryStats() {
        const title = '<h5>Memory</h5>';
        return this.ssh.runCommand('free -m')
            .then(r => `${title}<pre>${' '.repeat(15)}${r.stdout}</pre>`)
            .catch(() => `${title}<pre>Could not get memory details, check logs for details</pre>`);
    }

    getUsersStats() {
        return new Promise((resolve, reject) => {
            this.ssh.connection
                .then(() => this.ssh.runCommand('sudo cat /etc/openvpn/openvpn-status.log'))
                .then((response) => {
                    let details = '';
                    details += this.getClientList(response);
                    details += this.getRoutingTable(response);
                    details += SSHStats.getGlobalStats(response);
                    details += SSHStats.getUpdated(response);

                    resolve({
                        level: STATUS.OK,
                        description: null,
                        details,
                    });
                })
                .catch(reject);
        });
    }

    static getUpdated(response) {
        const reg = new RegExp(/Updated,(.*?)\n/i);
        const result = reg.exec(response.stdout);
        if (result && result.length > 1 && result[1]) {
            return `<p>Updated: ${result[1]}</p>`;
        }
        return '';
    }

    static getGlobalStats(response) {
        const reg = new RegExp(/GLOBAL STATS\n(.*?)\nEND/im);
        const result = reg.exec(response.stdout);
        if (result && result.length > 1 && result[1]) {
            return `<b>Global stats</b><p>${result[1]}</p><div class="ui divider"></div>`;
        }
        return '';
    }

    getRoutingTable(response) {
        const reg = new RegExp(/(Virtual Address.*)\n(.*?)\nGLOBAL STATS/im);
        const result = reg.exec(response.stdout);
        if (result && result.length > 2 && result[1] && result[2]) {
            return `<b>Routing table</b>${this.getPart(result[1], result[2])}<div class="ui divider"></div>`;
        }
        return '';
    }

    getClientList(response) {
        const reg = new RegExp(/(Common Name.*)\n(.*?)\nROUTING TABLE/im);
        const result = reg.exec(response.stdout);
        if (result && result.length > 2 && result[1] && result[2]) {
            return `<b>Client list</b>${this.getPart(result[1], result[2])}<div class="ui divider"></div>`;
        }
        return '';
    }

    static getPart(headerContent = '', linesContent = '') {
        const headers = headerContent.split(',');
        const lines = map(linesContent.split('\n'), line => line.split(','));

        return `
        <table>
            <thead>${map(headers, header => `<th>${header}</th>`).join('')}</thead>
            ${map(lines, line =>
            `<tr>${map(line, field => `<td>${field}</td>`).join('')}</tr>`,
        ).join('')}
        </table>`;
    }

    resolveFunction(resolve, reject, level, description = '') {
        return this.ssh.runCommand('sudo systemctl status openvpn@server', {}, false)
            .then((r) => {
                resolve({
                    level,
                    description,
                    details: r.stdout,
                });
            }).catch(reject);
    }

    isInstalled(resolve, reject) {
        return this.ssh.runCommand('openvpn', {}, false)
            .then((r) => {
                if (r.code === 127) {
                    return this.resolveFunction(
                        resolve, reject, STATUS.ERROR, 'Openvpn is not installed',
                    );
                } else if (r.code === 1) {
                    return null;
                }
            })
            .catch(reject);
    }

    isActive(resolve, reject) {
        return this.ssh.runCommand('sudo systemctl is-active openvpn@server', {}, false)
            .then((r) => {
                if (r.code === 0) {
                    return this.resolveFunction(
                        resolve, reject, STATUS.OK,
                    );
                } else if (r.stdout === 'inactive') {
                    return this.isEnabled(resolve, reject);
                } else if (r.code === 3) {
                    return this.isFailed(resolve, reject);
                }
                return this.resolveFunction(
                    resolve, reject,
                    STATUS.ERROR, 'Error while checking service active status',
                );
            })
            .catch(reject);
    }

    isFailed(resolve, reject) {
        return this.ssh.runCommand('sudo systemctl is-failed openvpn@server', {}, false)
            .then((r) => {
                if (r.code === 0) {
                    this.resolveFunction(
                        resolve, reject,
                        STATUS.ERROR, 'Service status is failed',
                    );
                } else if (r.code === 1) {
                    this.resolveFunction(
                        resolve, reject,
                        STATUS.ERROR, 'Service status unknown',
                    );
                } else {
                    this.resolveFunction(
                        resolve, reject,
                        STATUS.ERROR, 'Error while checking service failed status',
                    );
                }
            }).catch(reject);
    }

    isEnabled(resolve, reject) {
        return this.ssh.runCommand('sudo systemctl is-enabled openvpn@server', {}, false)
            .then((r) => {
                if (r.code === 0) {
                    this.resolveFunction(
                        resolve, reject,
                        STATUS.WARNING, 'Service is enabled, but not active',
                    );
                } else {
                    this.resolveFunction(
                        resolve, reject,
                        STATUS.ERROR, 'Error while checking service enabled status',
                    );
                }
            }).catch(reject);
    }
}

