const db = require('../models/index');
const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const { Op } = require("sequelize");
class BorrowingOnlController {
    //API Thuê sách Online
    async createNewBorrowingOnl(req, res) {
        try {
            const borrowingOnl = req.body;
            //Kiểm tra xem đã mượn chưa!
            const existingBorrowedBook = await db.borrowingOnline.findOne({ where: { bookline_id: borrowingOnl.bookline_id, user_id: borrowingOnl.user_id } });
            if (existingBorrowedBook) {
                return res.status(400).json({ message: 'Bạn đã mượn cuốn sách này rồi!' });
            }
            await db.borrowingOnline.create({
                bookline_id: borrowingOnl.bookline_id,
                user_id: borrowingOnl.user_id,
                borrowing_date: new Date(),
            })
            return res.status(200).json({
                errCode: 0,
                msg: 'Create borrowingOnline successfully!'
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json("error")
        }
    }
    //API người dùng xem sách mình đã thuê 
    async getBorrowedBookOnline(req, res) {
        try {
            //const { user } = req;
            const user = req.query;
            const book = await db.borrowingOnline.sequelize.query(
                `SELECT borrowing_id, 
                        DATE_FORMAT(borrowing_date, '%Y-%m-%d %H:%i:%s') as borrowing_date, 
                        bookline_name, 
                        thumbnail, 
                        document_url, 
                        bl.bookline_id 
                FROM borrowing_onlines bo
                INNER JOIN book_lines bl ON bl.bookline_id = bo.bookline_id
                WHERE user_id = ${user.user_id}`,
                { type: QueryTypes.SELECT }
            )
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }

            res.status(200).json(book);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Số lượng người mượn tài liệu online theo thời gian.
    async getBorrowOnlCountByDateRange(req, res) {
        try {
        const { start_date, end_date } = req.query;
        const result = await db.borrowingOnline.sequelize.query(
            `CALL get_num_user_borrowers_onl('${start_date}', '${end_date}')`
        );
        //console.log(result)
        return res.status(200).json({
            errCode: 0,
            msg: "Get borrow count successfully!",
            result,
        });
        } catch (err) {
        console.log(err);
        return res.status(500).json({ errCode: 2, msg: "Internal server error" });
        }
    }
}

module.exports = new BorrowingOnlController;
module.exports = new BorrowingOnlController;