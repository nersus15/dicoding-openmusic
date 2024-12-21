const InvariantError = require("../../exceptions/InvariantError");
const { PostAuthSchema, PutAuthSchema, DeleteAuthSchema } = require("./schema")

const AuthenticationsValidator = {
    validatePostAuthenticationPayload: (payload) => {
        const result = PostAuthSchema.validate(payload);
        if(result.error){
            throw new InvariantError(result.error.message);
        }
    },
    validatePutAuthenticationPayload: (payload) => {
        const result = PutAuthSchema.validate(payload);
        if(result.error){
            throw new InvariantError(result.error.message);
        }
    },

    validateDeleteAuthenticationPayload: (payload) => {
        const result = DeleteAuthSchema.validate(payload);
        if(result.error){
            throw new InvariantError(result.error.message);
        }
    }
}

module.exports = AuthenticationsValidator;