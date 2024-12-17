require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');
const AlbumsService = require('./services/AlbumsService');
const SongsService = require('./services/SongsService');
const AlbumsValidator = require('./validator/albums');
const albums = require('./api/albums');
const songs = require('./api/songs');
const SongsValidator = require('./validator/songs');

(async () => {
    const albumService = new AlbumsService();
    const songsService = new SongsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });
    // Register Hapi Plugin Here
    await server.register([
       {
        plugin: albums,
        option: {
            service: albumService,
            validator: AlbumsValidator
        }
       },
       {
        plugin: songs,
        option: {
            service: songsService,
            validator: SongsValidator
        }
       } 
    ]);
    // Add Extension Here
    server.ext('onPreResponse', (request, h) => {
        const {response} = request;

        if(response instanceof ClientError){
            const r = h.response({
                status: 'fail',
                message: response.message
            });

            r.code(response.statusCode);
            return r;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
})();