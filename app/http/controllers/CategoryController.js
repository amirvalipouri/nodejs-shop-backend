const createHttpError = require("http-errors")
const Controller = require("./controller")
const { ListOfImagesFromRequest, SingleImagesFromRequest } = require("../../utils/function")
const { CategoryModel } = require("../../models/CategoryModel")

class Category extends Controller {
    // admin
    async addCategory(req, res, next) {
        try {
            const { title } = req.body
            // if (!req.files) throw new createHttpError.BadRequest("لطفا عکس را آپلود کنید")
            const image = SingleImagesFromRequest(req.body.filename || "", req.body.fileUploadPath)
            const newCategory = await CategoryModel.create({title , image})
            return res.status(201).json({
                message : "دسته بندی جدید اضافه شد"
            })
        } catch (err) {
            next(err)
        }
    }
    async deleteCategory(req,res,next){
        try{
            const { id } = req.params
            await this.findCategory(id)
            const deleteCat = await CategoryModel.deleteOne({_id : id})
            if(deleteCat.deletedCount == 0) throw createHttpError.InternalServerError("دسته بندی حذف نشد")
            return res.status(200).json({
                message : "دسته بندی حذف شد"
            })
        }catch(err){
            next(err)
        }
    }
    // all
    async getAllCategory(req,res,next){
        try{
            const categories = await CategoryModel.find({})
            return res.status(200).json({
                data : categories
            })
        }catch(err){
            next(err)
        }
    }
    async findCategory(id){
        const cat = await CategoryModel.findById(id)
        if(!cat) throw createHttpError.NotFound("دسته بندی موردنظر پیدا نشد")
        return cat
    }
}
module.exports = {
    CategoryController : new Category()
}