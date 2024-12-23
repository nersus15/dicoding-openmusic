const AuthenticationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: (server, {service, usersService, TokenManager, validator}) => {
        const handler = new AuthenticationsHandler(usersService, service, TokenManager, validator);
        server.route(routes(handler));
    }
}