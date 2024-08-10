const { Schema , model} = require("mongoose")
const ProductSchema = new Schema({
    title : {type: String,required : true},
    description : {type: String},
    price : {type: Number , default : 0},
    discountPrice : {type: Number , default : 0},
    discount : {type : Number , default: 0},
    countSell : {type : Number , default : 0},
    total : {type : Number , default : 0},
    code : {type : String , required : true},
    color : {type : String , require : true},
    freeSize : {type : Boolean , default : false},
    available : {type : Boolean , default : false},
    sizes : {type : Object , default : {
        sm : 0,
        md : 0,
        lg : 0,
        xl : 0,
    }},
    images : {type: [String], required : true},
    category : {type: Schema.Types.ObjectId, ref: "Category", required : true},
},{
    timestamps : true,
    id : false,
    versionKey : false
})
ProductSchema.index({title : "text", code : "text"})
const ProductModel = model("Product",ProductSchema)
module.exports = ProductModel