const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET_KEY } = require('../../utils/constants');

module.exports = function (req, res, next) {
  const token = req.cookies.token ?? "";
//   console.log("token : ",token)
  if (!token)
    return res.status(403).send({
      message: "تأیید اعتبار ناموفق بود"
    })

  try {
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
    // console.log(user)
    req.user = user;
    next();
  } catch (ex) {
    return res.status(403).send({ message: "اعتبار ورود شما منقضی شده است لطفا مجدد لاگین فرمایید" });
  }
};