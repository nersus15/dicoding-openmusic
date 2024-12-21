const autoBind = require("auto-bind");

class AlbumsHandler {
    constructor(service, validator){
        this._service = service;
        this._validator = validator;
        autoBind(this);
    }

    async addAlbum(request, h){
        this._validator.validateAlbumPayload(request.payload);
        const {name, year} = request.payload;
        const albumid = await this._service.addAlbum({name, year});

        const response = h.response({
            status: 'success',
            data: {
                albumId: albumid
            }
        });
        response.code(201);
        return response;
    }


    async getAlbum(request){
        const {id} = request.params;
        const data = await this._service.getAlbumById(id);

        return {
            status: 'success',
            data: data
        };
    }

    async editAlbum(request){
        this._validator.validateAlbumPayload(request.payload);
        const {id} = request.params;

        await this._service.editAlbumById(id, request.payload);

        return {
            status: 'success',
            message: 'Album berhasil diperbarui'
        };
    }

    async deleteAlbum(request){
        const {id} = request.params;

        await this._service.deleteAlbumById(id, request.payload);

        return {
            status: 'success',
            message: 'Album berhasil dihapus'
        };
    }

}

module.exports = AlbumsHandler;