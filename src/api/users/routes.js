const routes = (handler) => {
    return [
        {
            method: 'POST',
            path: '/users',
            handler: handler.postUser
        }
    ];
}

module.exports = routes;