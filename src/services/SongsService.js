const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const { mapDBToModelSongs } = require("../utils");
const NotFoundError = require("../exceptions/NotFoundError");

class SongsService {
    constructor(){
        this._pool = new Pool();
    }

    async addSong({title, year, genre, performer, duration = null, albumId = null}){
        const id = `song-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO songs(id, title, year, genre, performer, duration, albumid) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId]
        };

        const result = await this._pool.query(query);
        if(!result.rows[0].id){
            throw new InvariantError('Gagal menambahkan lagu');
        }
        return result.rows[0].id;
    }

    async getSongs({title = null, performer = null}){
        const query = {
            text: 'SELECT * FROM songs',
            values: []
        };

        if(title && !performer){
            query.text += ' WHERE title ILIKE $1';
            query.values.push(`%${title}%`);
        }else if(!title && performer){
            query.text += ' WHERE performer ILIKE $1';
            query.values.push(`%${performer}%`);
        }else if(title && performer){
            query.text += ' WHERE title ILIKE $1 AND performer ILIKE $2';
            query.values.push(`%${title}%`);
            query.values.push(`%${performer}%`);
        }
        
        const result = await this._pool.query(query);
        return result.rows.map(({id, title, performer}) => ({id, title, performer}));
    }

    async getSongById(id){
        const query = {
            text: 'SELECT * FROM songs WHERE id=$1',
            values: [id]
        };

        const result = await this._pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError(`Lagu dengan Id #${id} tidak ditemukan`);
        }
        return result.rows.map(mapDBToModelSongs)[0];
    }

    async editSongById(id, {title, year, genre, performer, duration = null, albumId = null}){
        const query = {
            text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, albumid=$6 WHERE id=$7 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, id]
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError(`Gagal memperbarui lagu. Id #${id} tidak ditemukan`);
        }        
    }

    async deleteSongById(id){
        const query = {
            text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
            values: [id]
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError(`Gagal menghapus lagu. Id #${id} tidak ditemukan`);
        }        
    }
}

module.exports = SongsService;