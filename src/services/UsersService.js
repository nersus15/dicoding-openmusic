const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");

class UsersService {
    constructor(){
        this._pool = new Pool();
    }

    async addUser({username, password, fullname}){
        const id = `user-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, password, fullname]
        };

        const result = await this._pool.query(query);
        if(!result.rows[0].id){
            throw new InvariantError("Gagal menambahkan user");
        }

        return result[0].id;
    }
    
}

module.exports = UsersService;