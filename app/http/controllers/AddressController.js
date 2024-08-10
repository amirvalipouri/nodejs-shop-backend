const { isValidObjectId } = require("mongoose");
const AddressModel = require("../../models/AddressModel");
const Controller = require("./controller");
const createHttpError = require("http-errors");

class Address extends Controller {
    async addAddress(req,res,next){
        try{
            const { 
                address,
                firstName,
                lastName,
                phone,
                landlinePhone,
                areaCode,
                postCode
            } = req.body
            const user = req.user._id
            const newAddress = await AddressModel.create({ 
                address,
                firstName,
                lastName,
                phone,
                landlinePhone,
                areaCode,
                postCode,
                user
            })
            return res.status(201).json({
                message : "آدرس ثبت شد"
            })
        }catch(err){
            next(err)
        }
    }
    async getUserAddress(req,res,next){
        try{
            const userId = req.user._id
            const address = await AddressModel.find({user : userId})
            return res.status(200).json({
                data : address
            })
        }catch(err){
            next(err)
        }
    }
    async deleteAddress(req,res,next){
        try{
            const {id} = req.params
            await this.findAddressById(id)
            const deleteAddress = await AddressModel.deleteOne({_id : id})
            if(deleteAddress.deletedCount == 0) throw createHttpError.InternalServerError("آدرس حذف نشد")
            return res.status(200).json({
                message : "آدرس حذف شد"
            })
        }catch(err){
            next(err)
        }
    }
    async findAddressById(id){
        if(!isValidObjectId(id)) throw new createHttpError.BadRequest("شناسه درست نیست")
        const address = await AddressModel.findById(id)
        if(!address) throw createHttpError.NotFound("آدرس پیدا نشد")
        return address
    }
}
module.exports = {
    AddressController : new Address()
}