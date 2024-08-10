const { Router } = require("express")
const { authRoutes } = require("./auth")
const { AdminRoutes } = require("./admin")
const { userRoutes } = require("./user")
const router = Router()
router.use("/api/auth",authRoutes)
router.use("/api/admin",AdminRoutes)
router.use("/api/user",userRoutes)
module.exports = {
    AllRoutes : router
}