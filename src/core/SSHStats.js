import {map} from 'lodash';
import {STATUS} from "../constants/servers";

export default class SSHStats {
    constructor(ssh, dispatch) {
        this.dispatch = dispatch;
        this.ssh = ssh;
    }


    get_vpn_status() {
        return new Promise((resolve, reject) => {
            this.ssh.connection
                .then(() => {
                    return this._is_active(resolve, reject);
                }).catch(reject);
        });
    }

    get_machine_status() {
        let details = '';
        return new Promise((resolve, reject) => {
            this.ssh.connection
                .then(() => {
                    return this.ssh._runCommand(`free -m`).then(r => {
                        details += `<h5>Memory</h5><pre>${' '.repeat(15)}${r.stdout}</pre>`;
                    }).catch(e => details += `<h5>Memory</h5><pre>Could not get memory details, check logs for details</pre>`)
                }).then(() => {
                    return this.ssh._runCommand(`top -bn 1 | head -n 5`).then(r => {
                        details += `<h5>System details</h5><pre>${r.stdout}</pre>`;
                    }).catch(e => details += `<h5>System details</h5><pre>Could not get system details, check logs for details</pre>`);
                }).then(() => {
                    return this.ssh._runCommand(`top -bn1 | grep openvpn && top -bn 1 -d 0.01 | grep 'openvpn\\|^  PID'`).then(r => {
                        details += `<h5>OpenVPN - top</h5><pre>${r.stdout}</pre>`;
                    }).catch(e => details += `<h5>OpenVPN - top</h5><pre>Could not get vpn details, check logs for details</pre>`);
                }).then(() => resolve(details)).catch(reject);
        });
    }

    get_users_stats() {
        return new Promise((resolve, reject) => {
            this.ssh.connection
                .then(() => this.ssh._runCommand(`sudo cat /etc/openvpn/openvpn-status.log`))
                .then(response => {
                    let details = '';
                    details += this._get_client_list(response);
                    details += this._get_routing_table(response);
                    details += this._get_global_stats(response);
                    details += this._get_updated(response);

                    resolve({
                        level: STATUS.OK,
                        description: null,
                        details
                    })
                })
                .catch(reject);
        });
    }

    _get_updated(response) {
        let reg = new RegExp(/Updated,(.*?)\n/i);
        let result = reg.exec(response.stdout);
        if (result && result.length > 1 && result[1]) {
            return `<p>Updated: ${result[1]}</p>`;
        }
        return '';
    }

    _get_global_stats(response) {
        let reg = new RegExp(/GLOBAL STATS\n(.*?)\nEND/im);
        let result = reg.exec(response.stdout);
        if (result && result.length > 1 && result[1]) {
            return `<b>Global stats</b><p>${result[1]}</p><div class="ui divider"></div>`;
        }
        return '';
    }

    _get_routing_table(response) {
        let reg = new RegExp(/(Virtual Address.*)\n(.*?)\nGLOBAL STATS/im);
        let result = reg.exec(response.stdout);
        if (result && result.length > 2 && result[1] && result[2]) {
            return `<b>Routing table</b>` + this._get_part(result[1], result[2]) + `<div class="ui divider"></div>`;
        }
        return '';
    }

    _get_client_list(response) {
        let reg = new RegExp(/(Common Name.*)\n(.*?)\nROUTING TABLE/im);
        let result = reg.exec(response.stdout);
        if (result && result.length > 2 && result[1] && result[2]) {
            return `<b>Client list</b>` + this._get_part(result[1], result[2]) + `<div class="ui divider"></div>`;
        }
        return '';
    }

    _get_part(headers, lines) {
        headers = headers || '';
        lines = lines || '';

        headers = headers.split(',');
        lines = map(lines.split('\n'), line => line.split(','));

        return `
        <table>
            <thead>${map(headers, header => `<th>${header}</th>`).join('')}</thead>
            ${map(lines, line =>
            `<tr>${map(line, field => `<td>${field}</td>`).join('')}</tr>`
        ).join('')}
        </table>`;
    }

    _resolve_function(resolve, reject, level, description = '') {
        return this.ssh._runCommand(`sudo systemctl status openvpn@server`, {}, false)
            .then(r => {
                resolve({
                    level,
                    description,
                    details: r.stdout
                })
            }).catch(reject);
    };

    _is_active(resolve, reject) {
        return this.ssh._runCommand(`sudo systemctl is-active openvpn@server`, {}, false)
            .then((r) => {
                if (r.code === 0) {
                    return this._resolve_function(
                        resolve, reject, STATUS.OK
                    );
                } else if (r.stdout === 'inactive') {
                    return this._is_enabled(resolve, reject);
                } else if (r.code === 3) {
                    return this._is_failed(resolve, reject);
                } else {
                    return this._resolve_function(
                        resolve, reject,
                        STATUS.ERROR, 'Error while checking service active status'
                    );
                }
            })
            .catch(reject);
    }

    _is_failed(resolve, reject) {
        return this.ssh._runCommand(`sudo systemctl is-failed openvpn@server`, {}, false)
            .then(r => {
                if (r.code === 0) {
                    this._resolve_function(
                        resolve, reject,
                        STATUS.ERROR, 'Service status is failed'
                    );
                } else if (r.code === 1) {
                    this._resolve_function(
                        resolve, reject,
                        STATUS.ERROR, 'Service status unknown'
                    );
                } else {
                    this._resolve_function(
                        resolve, reject,
                        STATUS.ERROR, 'Error while checking service failed status'
                    );
                }
            }).catch(reject);
    }

    _is_enabled(resolve, reject) {
        return this.ssh._runCommand(`sudo systemctl is-enabled openvpn@server`, {}, false)
            .then(r => {
                if (r.code === 0) {
                    this._resolve_function(
                        resolve, reject,
                        STATUS.WARNING, 'Service is enabled, but not active'
                    );
                } else {
                    this._resolve_function(
                        resolve, reject,
                        STATUS.ERROR, 'Error while checking service enabled status'
                    );
                }
            }).catch(reject);
    }
}

