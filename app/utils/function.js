const JWT = require("jsonwebtoken")
const createError = require("http-errors");
const { UserModel } = require("../models/UserModel");
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require("./constants");
const path = require("path")
function SignAccessToken(userId) {
    return new Promise(async (resolve, reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            phone: user.phone,
            _id : user._id,
            
        };
        const options = {
            expiresIn: "1d"
        };
        JWT.sign(payload, ACCESS_TOKEN_SECRET_KEY, options, (err, token) => {
            if (err) reject(createError.InternalServerError("خطای سروری"));
            resolve(token)
        })
    })
}
function SignRefreshToken(userId) {
    return new Promise(async (resolve, reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            phone: user.phone,
            _id : user._id
        };
        const options = {
            expiresIn: "1y"
        };
        JWT.sign(payload, REFRESH_TOKEN_SECRET_KEY, options, async (err, token) => {
            if (err) reject(createError.InternalServerError("خطای سروری"));
            // await redisClient.SETEX(String(userId), (365 * 24 * 60 * 60), token);
            resolve(token)
        })
    })
}
function ListOfImagesFromRequest(files, fileUploadPath) {
    if (files?.length > 0) {
        return ((files.map(file => path.join(fileUploadPath, file.filename))).map(item => item.replace(/\\/g, "/")))
    } else {
        return []
    }
}
function SingleImagesFromRequest(filename, fileUploadPath) {
    if (filename) {
        return  path.join(fileUploadPath,filename).replace(/\\/g, "/")
    } else {
        return ""
    }
}
module.exports = {
    SignAccessToken,
    SignRefreshToken,
    ListOfImagesFromRequest,
    SingleImagesFromRequest
}