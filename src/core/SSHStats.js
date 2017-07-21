import { map } from 'lodash';
import { STATUS } from '../constants/servers';

/**
 * Class used for getting server statistics and status
 */
export default class SSHStats {
    /**
     * @param {SSH} ssh SSH class instance
     * @param {function} dispatch Redux dispatch function
     */
    constructor(ssh, dispatch) {
        /**
         * Redux dispatch function
         */
        this.dispatch = dispatch;

        /**
         * SSH class instance used for handling running commands
         */
        this.ssh = ssh;
    }

    /**
     * Get OpenVPN status
     * @return {Promise}
     */
    getVpnStatus() {
        return new Promise((resolve, reject) => {
            this.ssh.connection
                .then(() => this.isInstalled(resolve, reject))
                .then(() => this.isActive(resolve, reject))
                .catch(reject);
        });
    }

    /**
     * Get server machine status
     * @return {Promise}
     */
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

    /**
     * Get OpenVPN statistics
     * @return {Promise}
     */
    getVpnStats() {
        const title = '<h5>OpenVPN - top</h5>';
        return this.ssh.runCommand('top -bn1 | top -bn 1 -d 0.01 | grep \'openvpn\\|^  PID\'')
            .then(r => `${title}<pre>${r.stdout}</pre>`)
            .catch(() => `${title}<pre>Could not get vpn details, check logs for details</pre>`);
    }

    /**
     * Get OS statistics
     * @return {Promise}
     */
    getSystemStats() {
        const title = '<h5>System details</h5>';
        return this.ssh.runCommand('top -bn 1 | head -n 5')
            .then(r => `${title}<pre>${r.stdout}</pre>`)
            .catch(() => `${title}<pre>Could not get system details, check logs for details</pre>`);
    }

    /**
     * Get memory usage statistics
     * @return {Promise}
     */
    getMemoryStats() {
        const title = '<h5>Memory</h5>';
        return this.ssh.runCommand('free -m')
            .then(r => `${title}<pre>${' '.repeat(15)}${r.stdout}</pre>`)
            .catch(() => `${title}<pre>Could not get memory details, check logs for details</pre>`);
    }

    /**
     * Get users statistics from OpenVPN status file
     * @return {Promise}
     */
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

    /**
     * Parse updated date from OpenVPN user statistics
     * @param {object} response SSH command response
     * @return {string} Last update date of statistics
     */
    static getUpdated(response) {
        const reg = new RegExp(/Updated,(.*?)\n/i);
        const result = reg.exec(response.stdout);
        if (result && result.length > 1 && result[1]) {
            return `<p>Updated: ${result[1]}</p>`;
        }
        return '';
    }

    /**
     * Parse global statistics from OpenVPN statistics
     * @param {object} response SSH command response
     * @return {string} Global statistics data
     */
    static getGlobalStats(response) {
        const reg = new RegExp(/GLOBAL STATS\n(.*?)\nEND/im);
        const result = reg.exec(response.stdout);
        if (result && result.length > 1 && result[1]) {
            return `<b>Global stats</b><p>${result[1]}</p><div class="ui divider"></div>`;
        }
        return '';
    }

    /**
     * Parse routing table from OpenVPN statistics
     * @param {object} response SSH command response
     * @return {string} Routing table data
     */
    getRoutingTable(response) {
        const reg = new RegExp(/(Virtual Address.*)\n(.*?)\nGLOBAL STATS/im);
        const result = reg.exec(response.stdout);
        if (result && result.length > 2 && result[1] && result[2]) {
            return `<b>Routing table</b>${SSHStats.getPart(result[1], result[2])}<div class="ui divider"></div>`;
        }
        return '';
    }

    /**
     * Parse client list from OpenVPN statistics
     * @param {object} response SSH command response
     * @return {string} Users list data
     */
    getClientList(response) {
        const reg = new RegExp(/(Common Name.*)\n(.*?)\nROUTING TABLE/im);
        const result = reg.exec(response.stdout);
        if (result && result.length > 2 && result[1] && result[2]) {
            return `<b>Client list</b>${SSHStats.getPart(result[1], result[2])}<div class="ui divider"></div>`;
        }
        return '';
    }

    /**
     * Helper statistics function. Convert text format to HTML table
     * @param {string} headerContent Header of table
     * @param {string} linesContent Content of table
     * @returns {string} HTML table
     */
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

    /**
     * Default resolve function for statistics module
     * @param {function} resolve Resolve function
     * @param {function} reject Reject function
     * @param {string} level Message level
     * @param {string} description Status description content
     */
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

    /**
     * Checks if OpenVPN is installed on server
     * @param {function} resolve Resolve function
     * @param {function} reject Reject function
     * @return {Promise}
     */
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

    /**
     * Checks if OpenVPN is active
     * @param {function} resolve Resolve function
     * @param {function} reject Reject function
     * @return {Promise}
     */
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

    /**
     * Checks if OpenVPN is status is failed
     * @param {function} resolve Resolve function
     * @param {function} reject Reject function
     * @return {Promise}
     */
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

    /**
     * Checks if OpenVPN is enabled on server
     * @param {function} resolve Resolve function
     * @param {function} reject Reject function
     * @return {Promise}
     */
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

