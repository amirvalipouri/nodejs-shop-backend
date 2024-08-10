const { Router } = require("express")
const {AddressController} = require("../../http/controllers/AddressController")
const Auth = require("../../http/middlewares/Auth")
const router = Router()
router.post("/",Auth,AddressController.addAddress)
router.get("/",Auth,AddressController.getUserAddress)
router.delete("/:id",Auth,AddressController.deleteAddress)
module.exports = {
    userAddressRoutes : router
}