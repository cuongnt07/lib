const jwt = require("jsonwebtoken")

//middleware: check xem dang nhap hay chua
class authenticateMiddleware {
    authenticate(req, res, next) {
        //check xem dang nhap chua
        const token = req.header("Authorization");
        try {
            const decode = jwt.verify(token, "quantrinh");
            console.log(decode)
            if (decode) {
                req.user = decode;
                console.log(decode);
                return next();
            } else {
                res.status(401).send("Bạn chưa đăng nhập")
            }
        } catch (error) {
            res.status(500).send("Lỗi xác thực")
        }

    };
}
module.exports = new authenticateMiddleware