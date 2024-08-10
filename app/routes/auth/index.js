const { Router } = require("express")
const { AuthController } = require("../../http/controllers/authController")
const router = Router()
router.post("/getOtp" , AuthController.getOtp)
router.post("/checkOtp",AuthController.checkOtp)
module.exports = {
    authRoutes : router
}