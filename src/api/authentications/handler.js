const autoBind = require("auto-bind");

class AuthenticationsHandler {
    constructor(usersService, authenticationsService, tokenManager, validator){
        this._usersService = usersService;
        this._authenticationsService = authenticationsService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        autoBind(this);
    }

    async postAuthentication(request, h){
        this._validator.validatePostAuthenticationPayload(request.payload);

        const {username, password} = request.payload;
        const id = await this._usersService.verifyUserCredential(username, password);

        const accessToken = this._tokenManager.generateAccessToken({userId: id});
        const refreshToken = this._tokenManager.generateRefreshToken({userId: id});

        await this._authenticationsService.addRefreshToken(refreshToken);

        const response = h.response({
            status: 'success',
            message: 'Authentication berhasil ditambahkan',
            data: {
                accessToken,
                refreshToken
            }
        });
        response.code(201);
        return response;
    }

    async putAuthentication(request, h){
        this._validator.validatePutAuthenticationPayload(request.payload);

        const {refreshToken} = request.payload;
        await this._authenticationsService.verifyRefreshToken(refreshToken);
        const {id} = this._tokenManager.verifyRefreshToken(refreshToken);

        const accessToken = this._tokenManager.generateAccessToken({userId: id});
        return {
            status: 'success',
            message: 'Access token berhasil diperbarui',
            data: {
                accessToken
            }
        };
    }

    async deleteAuthentication(request, h){
        this._validator.validateDeleteAuthenticationPayload(request.payload);
        const {refreshToken} = request.payload;

        await this._authenticationsService.verifyRefreshToken(refreshToken);
        await this._authenticationsService.deleteRefreshToken(refreshToken);

        return {
            status: 'success',
            message: 'Refresh token berhasil dihapus'
        };
    }
}

module.exports = AuthenticationsHandler;