const routes = (handler) => {
    return [
        {
            method: 'POST',
            path: '/authentications',
            handler: handler.postAuthentication
        },
        {
            method: 'PUT',
            path: '/authentications',
            handler: handler.putAuthentication
        },
        {
            method: 'DELETE',
            path: '/authentications',
            handler: handler.deleteAuthentication
        }
    ]
}

module.exports = routes;