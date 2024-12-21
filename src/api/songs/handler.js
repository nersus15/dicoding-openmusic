const autoBind = require("auto-bind");

class SongsHandler {
    constructor(service, validator){
        this._service = service;
        this._validator = validator;

        autoBind(this);        
    }

    async addSong(request, h){
        this._validator.validateSongPayload(request.payload);
        const {title, year, genre, performer, duration = null, albumId = null} = request.payload;

        const songid = await this._service.addSong({title, year, genre, performer, duration, albumId});

        const response = h.response({
            status: 'success',
            data: {
                songId: songid
            }
        });
        response.code(201);
        return response;
    }
    async getSongs(request){
        const {title = null, performer = null} = request.query;
        const data = await this._service.getSongs({title, performer});

        return {
            status: 'success',
            data: {
                songs: data
            }
        };
    }

    async getSongById(request){
        const {id} = request.params;
        const data = await this._service.getSongById(id);

        return {
            status: 'success',
            data: {
                song: data
            }
        };
    }

    async editSong(request){
        this._validator.validateSongPayload(request.payload);
        const {id} = request.params;

        await this._service.editSongById(id, request.payload);

        return {
            status: 'success',
            message: 'Lagu berhasil diperbarui'
        };
    }

    async deleteSong(request){
        const {id} = request.params;

        await this._service.deleteSongById(id, request.payload);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus'
        };
    }
}

module.exports = SongsHandler;