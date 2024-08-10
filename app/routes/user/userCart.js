const { Router } = require("express")
const {CartController} = require("../../http/controllers/CartController")
const Auth = require("../../http/middlewares/Auth")
const router = Router()
router.post("/addToCard/",Auth,CartController.addToCard)
router.get("/",Auth , CartController.getUserCart)
router.get("/count" , Auth , CartController.getCartCount)
router.delete("/remove",Auth,CartController.removeProductFromCard)
module.exports = {
    userCartRoutes : router
}