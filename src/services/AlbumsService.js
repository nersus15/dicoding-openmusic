const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class AlbumsService {
    constructor(){
        this._pool = new Pool();
    }

    async addAlbum({name, year}){
        const id = `album-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year]
        };

        const result = await this._pool.query(query);
        if(!result.rows[0].id){
            throw new InvariantError('Album gagal diatambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbumById(id){
        const query = {
            text: 'SELECT albums.id albumid, albums.name albumName, albums.year albumYear, songs.id, songs.title, songs.performer FROM albums LEFT JOIN songs ON albums.id = songs.albumid WHERE albums.id=$1',
            values: [id]
        }

        const album = await this._pool.query(query);
        
        if(!album.rows.length){
            throw new NotFoundError(`Album dengan id #${id} tidak ditemukan`);
        }

        const {albumid, albumname, albumyear} = album.rows[0];

        const response = {
            album: {
                id: albumid,
                name: albumname,
                year: albumyear,
                songs: [],
            }
        }

        album.rows.forEach(song => {
            if(song.id) {
                response.album.songs.push({
                    id: song.id,
                    title: song.title,
                    performer: song.performer
                });   
            }
        });

        return response;
    }

    async editAlbumById(id, {name, year}){
        const query = {
            text: 'UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id',
            values: [name, year, id]
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError(`Gagal memperbarui album. Id #${id} tidak ditemukan`);
        }        
    }

    async deleteAlbumById(id){
        const query = {
            text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
            values: [id]
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError(`Gagal menghapus album. Id #${id} tidak ditemukan`);
        }        
    }
}

module.exports = AlbumsService;