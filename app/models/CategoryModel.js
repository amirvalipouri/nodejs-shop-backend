const { default: mongoose, Schema } = require("mongoose");
const schema = new mongoose.Schema({
    title : {type : String},
    image : {type: String}
}, {
    timestamps: true,
    versionKey: false
});
// schema.plugin(mongoosePaginate);
const CategoryModel = mongoose.model('Category', schema);
module.exports = {
    CategoryModel
}