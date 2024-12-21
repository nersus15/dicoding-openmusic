require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');
const AlbumsService = require('./services/AlbumsService');
const SongsService = require('./services/SongsService');
const AlbumsValidator = require('./validator/albums');
const albums = require('./api/albums');
const songs = require('./api/songs');
const SongsValidator = require('./validator/songs');
const UsersService = require('./services/UsersService');
const users = require('./api/users');
const UsersValidator = require('./validator/users');

const Jwt = require('@hapi/jwt');
const AuthenticationService = require('./services/AuthenticationService');
const authentications = require('./api/authentications');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

(async () => {
    const albumService = new AlbumsService();
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationService = new AuthenticationService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    await server.register({
        plugin: Jwt
    });

    server.auth.strategy('jwt_auth', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                userId: artifacts.decoded.payload.userId
            }
        })
    });

    // Register Hapi Plugin Here
    await server.register([
       {
        plugin: albums,
        options: {
            service: albumService,
            validator: AlbumsValidator
        }
       },
       {
        plugin: songs,
        options: {
            service: songsService,
            validator: SongsValidator
        }
       },
       {
        plugin: users,
        options:{
            service: usersService,
            validator: UsersValidator,
        }
       },
       {
        plugin: authentications,
        options: {
            service: authenticationService,
            usersService,
            TokenManager,
            validator: AuthenticationsValidator
        }
       }
    ]);

    // Add Extension Here
    server.ext('onPreResponse', (request, h) => {
        const {response} = request;

        if(response instanceof Error){
            if(response instanceof ClientError){
                const r = h.response({
                    status: 'fail',
                    message: response.message
                });
    
                r.code(response.statusCode);
                return r;
            }
            if (!response.isServer) {
                return h.continue;
            }

            const r = h.response({
                status: 'error',
                message: "Kami mengalami kegagalan server",
                error: response.message
            });

            r.code(500);
            return r;
            
    
        }
        
        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
})();