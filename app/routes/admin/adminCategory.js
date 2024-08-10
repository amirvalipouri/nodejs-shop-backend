const { Router } = require("express")
const {CategoryController} = require("../../http/controllers/CategoryController")
const { uploadFile } = require("../../utils/multer")
const router = Router()
router.post("/",uploadFile.single("image"),CategoryController.addCategory)
router.get("/",CategoryController.getAllCategory)
router.delete("/:id",CategoryController.deleteCategory)
module.exports = {
    adminCategoryRoutes : router
}