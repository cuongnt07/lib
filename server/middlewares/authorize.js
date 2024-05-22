//middleware: phân quyền người dùng
class authorizeMiddleware {
    checkStudent(req, res, next) {
        var role = req.user.roleId;
        if(role == 1){
            next()
        }else{
            res.json('Not permission')
        }
    }

    checkLibrarian(req, res, next) {
        var role = req.user.roleId;
        if(role == 2){
            next()
        }else{
            res.json('Bạn không phải thủ thư')
        }
    }

    checkAdmin(req, res, next) {
        var role = req.user.roleId;
        if(role == 3){
            next()
        }else{
            res.json('Bạn không phải chuyên viên bổ sung')
        }
    }
}

module.exports = new authorizeMiddleware