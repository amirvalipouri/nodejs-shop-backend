const { Router } = require("express")
const { ProductController } = require("../../http/controllers/ProductController")
const router = Router()
router.get("",ProductController.getProducts)
router.get("/:id",ProductController.getProductById)
module.exports = {
    userProductsRoutes : router
}