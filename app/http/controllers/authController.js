const Controller = require("./controller");
const { RandomNumberGenerator } = require("../../utils");
const { UserModel } = require("../../models/UserModel");
const createHttpError = require("http-errors");
const { SignAccessToken } = require("../../utils/function");
class auth extends Controller{
    async getOtp(req, res, next) {
        try {
            const { phone } = req.body;
            const code = RandomNumberGenerator()
            const result = await this.saveUser(phone, code)
            if (!result) throw createHttpError.Unauthorized("ورود شما انجام نشد")
            return res.status(200).send({
                data: {
                    statusCode: 200,
                    data: {
                        message: "کد اعتبار سنجی با موفقیت برای شما ارسال شد",
                        code,
                        phone
                    }
                }
            });
        } catch (err) {
            next(err)
        }
    }
    async checkOtp(req, res, next) {
        try {
            const { code, phone } = req.body
            const user = await UserModel.findOne({ phone }, { password: 0, refreshToken: 0, accessToken: 0 })
            let now = (new Date()).getTime()
            if (user?.otp && +user?.otp.expiresIn < now) throw new createHttpError.BadRequest("کد منقضی شده است")
            if (user?.otp.code != code) throw new createHttpError.BadRequest("کد اشتباه است")
            const token = await SignAccessToken(user?._id)
            return res.cookie("token", token, {
                httpOnly: true,
                secure: true,
              }).status(200).json({
                user,
                token
            })
        } catch (err) {
            next(err)
        }
    }
    async saveUser(phone, code) {
        const now = (new Date().getTime())
        let otp = {
            code,
            expiresIn: now + 120000,
        }
        const user = await this.checkExistUser(phone);
        if (user) {
            if (+user.otp.expiresIn > now) throw createHttpError.Forbidden("کد اعتبار سنجی قبلی هنوز منقضی نشده است")
            return (await this.updateUser(phone, { otp }))
        }
        return (await UserModel.create({
            phone,
            otp,
            role: "user"
        }))
    }
    async checkExistUser(phone) {
        const user = await UserModel.findOne({ phone })
        // if(!user) throw new createHttpError.NotFound("user is not existed!")
        return user
    }
    async updateUser(phone, objectData = {}) {
        Object.keys(objectData).forEach(key => {
            if (["", " ", 0, null, undefined, "0", NaN].includes(objectData[key])) delete objectData[key]
        })
        const updateResult = await UserModel.updateOne({ phone }, { $set: objectData })
        return !!updateResult.modifiedCount
    }
}
module.exports = {
    AuthController : new auth()
}