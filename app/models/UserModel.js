const { default: mongoose, Schema } = require("mongoose");
const schema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String, unique: false },
    password: { type: String },
    codeMelli: { type: String, default : "" },
    role: { type: String, required: true, default: 'user' },
    email: { type: String },
    address: { type: Schema.Types.ObjectId, ref: 'Address' },
    otp: {
        type: Object, default: {
            code: 0,
            expiresIn: 0
        }
    },
}, {
    timestamps: true,
    versionKey: false
});
// schema.plugin(mongoosePaginate);
const UserModel = mongoose.model('User', schema);
module.exports = {
    UserModel
}