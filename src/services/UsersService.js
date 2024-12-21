const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const bcrypt = require('bcrypt');

class UsersService {
    constructor(){
        this._pool = new Pool();
    }

    async addUser({username, password, fullname}){
        const id = `user-${nanoid(16)}`;

        const hashedPassword = bcrypt.hash(password, 10);
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname]
        };

        const result = await this._pool.query(query);
        if(!result.rows[0].id){
            throw new InvariantError("Gagal menambahkan user");
        }

        return result[0].id;
    }
    
}

module.exports = UsersService;