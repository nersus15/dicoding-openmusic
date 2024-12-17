const InvariantError = require("../../exceptions/InvariantError");
const { AlbumsPayloadSchema } = require("./schema")

const AlbumsValidator = {
    validateNotePayload: (payload) => {
        const validationResult = AlbumsPayloadSchema.validate(payload);
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    }
}
module.exports = AlbumsValidator;