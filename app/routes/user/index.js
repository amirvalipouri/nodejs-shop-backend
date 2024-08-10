const { Router } = require("express")
const { userProductsRoutes } = require("./userProduct")
const { userAddressRoutes } = require("./userAddress")
const { userCartRoutes } = require("./userCart")
const router = Router()
router.use("/products" , userProductsRoutes)
router.use("/address",userAddressRoutes)
router.use("/cart",userCartRoutes)
module.exports = {
    userRoutes : router
}