const { CardModel } = require("../../models/CartModel");
const ProductModel = require("../../models/ProductModel");
const Controller = require("./controller");

class Cart extends Controller {
    async addToCard(req,res,next){
        try {
            const { productId } = req.body
            const product = await this.findProduct(productId)
            const cart = await CardModel.findOne({ userId: req?.user?._id })
            let totalCount = 0
            let totalPrice = 0
            if (!product?.available) {
                return res.status(400).json({
                    message: "محصول موجود نیست"
                })
            }
            if (!cart) {
                let newCart = {}
                totalPrice += Number(product?.price)
                totalCount += 1
                newCart.totalCount = totalCount
                newCart.totalPrice = totalPrice
                newCart.userId = req.user?._id
                newCart.status = 0
                let items = []
                let p = {
                    _id: product?._id,
                    count: 1,
                    price: product?.price,
                    product
                }
                items.push(p)
                newCart.items = items
                const addNewCart = await CardModel.create(newCart)
                return res.status(201).json({
                    message: "به سبد خرید اضافه شد"
                })
            } else {
                const userId = req?.user?._id
                const items = await this.findProductInCart(userId, productId) || {}
                console.log("items : ", items)
                if (Object.keys(items)?.length > 0) {
                    totalPrice = Number(cart?.totalPrice) + Number(items?.price)
                    totalCount = Number(cart?.totalCount) + 1
                    const updateItems = await CardModel.updateOne({ userId: req?.user?._id, "items._id": productId }, {
                        $set: { totalPrice, totalCount },
                        $inc: { "items.$.count": 1 }
                    })
                    if (updateItems?.modifiedCount === 0) throw createHttpError.InternalServerError("آپدیت انجام نشد")
                    return res.status(200).json({
                        message: "محصول به سبد خرید افزوده شد"
                    })

                } else {

                    totalPrice = Number(cart?.totalPrice) + Number(product?.price)
                    totalCount = Number(cart?.totalCount) + 1
                    let newP = {
                        _id: product?._id,
                        count: 1,
                        price: product?.price,
                        product
                    }
                    const updateItems = await CardModel.updateOne({ userId: req?.user?._id }, {
                        $set: { totalPrice, totalCount },
                        $push: { "items": newP }
                    })
                    if (updateItems?.modifiedCount === 0) throw createHttpError.InternalServerError("آپدیت انجام نشد")
                    return res.status(200).json({
                        message: "محصول به سبد خرید افزوده شد"
                    })
                }
            }

        } catch (err) {
            next(err)
        }
    }
    async removeProductFromCard(req, res, next) {
        try {
            const { productId } = req.body
            const product = await this.findProduct(productId)
            const cart = await CardModel.findOne({ userId: req?.user?._id })
            if (!cart) throw createHttpError.BadRequest("سبدخرید موجود نیست")
            let totalCount = 0
            let totalPrice = 0
            const item = await this.findProductInCart(req?.user?._id, productId)
            let message = ""
            if (!item) throw createHttpError.BadRequest("محصول در سبد خرید یافت نشد")
            if (item.count > 1) {
                totalPrice = Number(cart?.totalPrice) - Number(product?.price)
                totalCount = Number(cart?.totalCount) - 1
                await CardModel.updateOne(
                    {
                        userId: req?.user?._id,
                        "items._id": productId
                    },
                    {
                        $set : {totalCount , totalPrice},
                        $inc: {
                            "items.$.count": -1
                        }
                    }
                )
                message = "یک عدد از محصول داخل سبد خرید کم شد"
                return res.status(200).json({message})
            } else {
                totalPrice = Number(cart?.totalPrice) - Number(product?.price)
                totalCount = Number(cart?.totalCount) - 1
                await CardModel.updateOne(
                    {
                        userId: req?.user?._id,
                        "items._id": productId
                    },
                    {
                        $set : {totalCount , totalPrice},
                        $pull: {
                            "items": {
                                _id : productId,
                            }
                        }
                    }
                )
                message = "محصول در داخل سبد خرید حذف شد"

                return res.status(200).json({message})
            }
        } catch (err) {
            next(err)
        }
    }
    async findProduct(id) {
        const product = await ProductModel.findById(id)
        if (!product) throw createHttpError.NotFound("محصول پیدا نشد")
        return product
    }
    async findProductInCart(userId, id) {
        let findProduct = await CardModel.findOne({ userId: userId, "items._id": id })
        console.log("findProduct : ", findProduct)
        return findProduct?.items[0]
    }
    async getUserCart(req, res, next) {
        try {
            const data = await CardModel.find({ userId: req.user._id }).populate({
                path: "items",
                populate: {
                  path: "product",
                  model: "Product",
                },
              });
            return res.status(200).json({
                data
            })
        } catch (err) {
            next(err)
        }
    }
    async getCartCount(req, res, next) {
        try {
            const count = await CardModel.find({ userId: req.user._id }).countDocuments()
            return res.status(200).json({
                count
            })
        } catch (err) {
            next(err)
        }
    }
}
module.exports = {
    CartController: new Cart()
}