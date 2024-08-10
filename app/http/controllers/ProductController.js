const createHttpError = require("http-errors")
const ProductModel = require("../../models/ProductModel")
const Controller = require("./controller")
const { ListOfImagesFromRequest } = require("../../utils/function")
class Product extends Controller {
    //admin
    async adminAddProduct(req, res, next) {
        try {
            const { title, description, price, discount,
                discountPrice, total, code,
                color, freeSize, available, sm,
                md, lg, xl, category } = req.body
            if (!req.files) throw new createHttpError.BadRequest("لطفا عکس را آپلود کنید")
            const images = ListOfImagesFromRequest(req?.files || [], req.body.fileUploadPath)
            let sizes = {}
            if (!!freeSize) {
                sizes.sm = +sm
                sizes.md = +md
                sizes.lg = +lg
                sizes.xl = +xl
            }
            const newProduct = await ProductModel.create({
                title, description, price, discount,
                discountPrice, total, code,
                color, freeSize, available, sizes, images, category
            })
            return res.status(201).json({
                message: "محصول جدید اضافه شد"
            })
        } catch (err) {
            next(err)
        }
    }

    //all
    async getProducts(req, res, next) {
        try {
            let products = []
            const { search } = req.query
            if(search){
                products = await ProductModel.find({$text : { $search : search}})
            }else{
                products = await ProductModel.find({})
            }
            return res.status(200).json({
                data: products
            })
        } catch (err) {
            next(err)
        }
    }

    //admin
    async adminDeleteProduct(req, res, next) {
        try {
            const { id } = req.params
            await this.findProductById(id)
            const deleteProduct = await ProductModel.deleteOne({ _id: id })
            if (deleteProduct.deletedCount !== 0) throw createHttpError.InternalServerError("خطا سرور")
            return res.status(200).json({
                message: "محصول با موفقیت پاک شد"
            })
        } catch (err) {
            next(err)
        }
    }

    async getProductById(req, res, next) {
        try {
            const { id } = req.params
            const findProduct = await this.findProductById(id)
            return res.status(200).json({
                data: findProduct
            })
        } catch (err) {
            next(err)
        }
    }

    //admin
    async adminUpdateProduct(req, res, next) {
        try {

        } catch (err) {
            next(err)
        }
    }

    async findProductById(id) {
        const findProduct = await ProductModel.findById(id)
        if (!findProduct) throw createHttpError.NotFound("محصول پیدا نشد")
        return findProduct
    }
}
module.exports = {
    ProductController: new Product()
}