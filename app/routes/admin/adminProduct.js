const { Router } = require("express")
const { ProductController } = require("../../http/controllers/ProductController")
const { uploadFile } = require("../../utils/multer")
const router = Router()
router.post("/",uploadFile.array("images",5),ProductController.adminAddProduct)
router.get("/",ProductController.getProducts)
router.delete("/:id",ProductController.adminDeleteProduct)
router.get("/:id",ProductController.getProductById)
module.exports = {
    adminProductRoutes : router
}