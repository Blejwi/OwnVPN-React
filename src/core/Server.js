export default class Server {
    constructor(server) {
        this.name = '';
        this.ipAddress = '';
        this.port = 22;
        this.password = '';
        this.key = '';

        Object.keys(server).forEach(property => this.setProperty(server, property));
    }

    setProperty(server, propertyName) {
        if (this.hasOwnProperty(propertyName) && server.hasOwnProperty(propertyName)) {
            this[propertyName] = server[propertyName];
        }
    }
}