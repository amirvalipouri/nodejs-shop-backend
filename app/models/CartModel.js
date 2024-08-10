const { default: mongoose, Schema } = require("mongoose");
const schema = new mongoose.Schema({
    totalCount : {type : Number , default : 0 , required : true} , 
    userId : {type : Schema.Types.ObjectId , ref : "User"},
    address : { type : Schema.Types.ObjectId , ref : "Address"},
    status : {type : String , default : 0 },
    totalPrice : {type : Number , default : 0},
    totalWeight : {type : Number , default : 0},
    items: [{
        _id : {type : String , required : true},
        available: { type: Boolean, default: true},
        count: { type: Number, required: true },
        price: { type: Number, required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
    }],
    discountCode: { type: String  },
}, {
    timestamps: true,
    id : false,
    versionKey: false
});
// schema.plugin(mongoosePaginate);
const CardModel = mongoose.model('Cart', schema);
module.exports = {
    CardModel
}