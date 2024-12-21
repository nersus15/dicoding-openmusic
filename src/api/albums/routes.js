const routes = (handler) => {
    return [
        {
            method: 'POST',
            path: '/albums',
            handler: handler.addAlbum,
        },
        {
            method: 'GET',
            path: '/albums/{id}',
            handler: handler.getAlbum,
        },
        {
            method: 'PUT',
            path: '/albums/{id}',
            handler: handler.editAlbum,
        },
        {
            method: 'DELETE',
            path: '/albums/{id}',
            handler: handler.deleteAlbum,
        }
    ];
};

module.exports = routes;