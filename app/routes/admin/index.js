const { Router } = require("express")
const { adminProductRoutes } = require("./adminProduct")
const { adminCategoryRoutes } = require("./adminCategory")
const router = Router()
router.use("/product",adminProductRoutes)
router.use("/category",adminCategoryRoutes)
module.exports = {
    AdminRoutes : router
}