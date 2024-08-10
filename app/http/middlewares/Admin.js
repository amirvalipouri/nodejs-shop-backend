const createHttpError = require("http-errors");
const { UserModel } = require("../../models/UserModel");

const Admin = async (req,res,next) => {
    const id = req.user._id;
    const user = await UserModel.findById(id)
    if(user?.role != "Admin") return res.status(403).json({
        message : "شما دسترسی نداید"
    })
    next()
}
module.exports = Admin