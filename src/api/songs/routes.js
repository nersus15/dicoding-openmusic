const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.addSong,
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getSongs,
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.getSongById,
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.editSong,
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handler.deleteSong,
    }
];

module.exports = routes;