const { Schema , model } = require("mongoose")
// const mongoosePaginate = require('mongoose-paginate-v2');

const AddressSchema = new Schema({
    address: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    landlinePhone: { type: String },
    areaCode: { type: String },
    postCode: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
    versionKey: false
});
// AddressSchema.plugin(mongoosePaginate);
const AddressModel = model('Address', AddressSchema);

module.exports = AddressModel;