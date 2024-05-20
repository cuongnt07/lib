const db = require("../models/index");
const sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
class BorrowingOffController {
  //API thuê sách Offline
  async createNewBorrowingOff(req, res) {
    try {
      var now = new Date();
      const { bookline_id } = req.body;
      const { user } = req;

      const book = await db.book.findOne({
        where: {
          bookline_id: bookline_id,
          idle: 1,
        },
        limit: 1,
      });
      await db.borrowingOffline.create({
        book_id: book.book_id,
        user_id: user.userId,
        borrowing_date: now,
        due_date: new Date(now.getTime() + 100 * 24 * 60 * 60 * 1000),
      });
      if (book) {
        book.idle = 0;
        book.save();
      } else {
        res.status(401).send("Không tìm thấy sách này");
      }
      return res.status(200).json({
        errCode: 0,
        msg: "Create borrowingOffline successfully!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json("Hết sách");
    }
  }
  //API người dùng xem sách mình đã thuê off
  async getBorrowedBookOffline(req, res) {
    try {
        const user = req.query;
        const borrowedBooks = await db.borrowingOffline.sequelize.query(
          `SELECT bo.borrowing_id, 
                  DATE_FORMAT(bo.borrowing_date, '%Y-%m-%d %H:%i:%s') as borrowing_date, 
                  DATE_FORMAT(bo.due_date, '%Y-%m-%d %H:%i:%s') as due_date, 
                  DATE_FORMAT(bo.return_date, '%Y-%m-%d %H:%i:%s') as return_date, 
                  b.book_id, 
                  bl.bookline_id, 
                  bl.bookline_name, 
                  r.repository_name,
                  CASE 
                        WHEN bo.return_date IS NULL THEN 'Đang mượn' 
                        ELSE 'Đã trả'
                  END AS status
          FROM borrowing_offlines bo
          INNER JOIN books b ON bo.book_id = b.book_id
          INNER JOIN book_lines bl ON b.bookline_id = bl.bookline_id
          INNER JOIN repositories r ON r.repository_id = b.repository_id
          WHERE user_id = ${user.user_id}`,
          { type: QueryTypes.SELECT }
      );

      if (!borrowedBooks || borrowedBooks.length === 0) {
          return res.status(404).json({ message: 'Không có sách nào được mượn offline' });
      }
      res.status(200).json(borrowedBooks);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
  //API trả sách offline
  async returnBookOffline(req, res) {
    try {
      // Check if rental id and user id are provided
      const { rental_id } = req.body;
      const { user } = req;
      if (!rental_id) {
        return res
          .status(400)
          .json({ message: "Rental ID and user ID are required" });
      }
      // Find the rental record and update return date
      const rental = await db.borrowingOffline.findOne({
        where: {
          borrowing_id: rental_id,
          user_id: user.userId,
          return_date: null,
        },
      });
      if (!rental) {
        return res.status(404).json({
          message: "Rental record not found or book already returned",
        });
      }
      rental.return_date = new Date();
      await rental.save();
      return res.status(200).json({ message: "Book returned successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  //sửa thông tin liên quan đến muon off.
  async updateBorrowingOff(req, res) {
    try {
      const { borrowing_id } = req.body;
      const { book_id, user_id, return_date } = req.body;
      const borrowingOff = await db.borrowingOffline.findOne({
        where: { borrowing_id },
      });
      if (!borrowingOff) {
        return res.status(404).json({
          errCode: 1,
          msg: "BorrowingOffline not found",
        });
      }
      borrowingOff.borrowing_id = borrowing_id || borrowingOff.borrowing_id;
      borrowingOff.book_id = book_id || borrowingOff.book_id;
      borrowingOff.user_id = user_id || borrowingOff.user_id;
      borrowingOff.return_date = return_date || borrowingOff.return_date;
      await borrowingOff.save();
      return res.status(200).json({
        errCode: 0,
        msg: "Update borrowingOffline successfully!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        errCode: 2,
        msg: "Internal server error",
      });
    }
  }

  //Số lượng người mượn tài liệu off theo thời gian.
  async getBorrowOffCountByDateRange(req, res) {
    try {
      const { start_date, end_date } = req.query;
      const result = await db.borrowingOffline.sequelize.query(
        `CALL get_num_user_borrowers_off('${start_date}', '${end_date}')`
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

  // thông kê chi tiết cho thủ thư thông tin về người thuê off
  async getInfoBorrowsOff(req, res) {
    try {
      //const { borrowing_id } = req.params;
      const result = await db.borrowingOffline.sequelize.query(
        `SELECT borrows.borrowing_id as _id ,borrows.user_id as user_id, users.username as name, books.book_id, book_lines.bookline_name AS book_name, CONCAT(DATE_FORMAT(DATE(borrows.borrowing_date), '%Y-%m-%d '),DATE_FORMAT(TIME(borrows.borrowing_date), '%H:%i:%s')) as borrow_date, CONCAT(DATE_FORMAT(DATE(borrows.return_date), '%Y-%m-%d '),DATE_FORMAT(TIME(borrows.return_date), '%H:%i:%s')) as return_date,
            CASE 
                WHEN borrows.return_date IS NULL THEN 'Đang mượn' 
            ELSE 'Đã trả'
            END AS status
            FROM borrowing_offlines borrows
            INNER JOIN users ON borrows.user_id = users.user_id
            INNER JOIN books ON borrows.book_id = books.book_id
            INNER JOIN book_lines ON book_lines.bookline_id = books.bookline_id
        `,
        { type: QueryTypes.SELECT }
      ); /*where borrowing_id = ${borrowing_id}*/
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

  // cho mượn off thủ thư
  async newBorrowingOff(req, res) {
    try {
      var now = new Date();
      const borrowingOff = req.body;
      const book = await db.book.findOne({
        where: {
          book_id: borrowingOff.book_id,
          idle: 1,
        },
      });

      if (!book) {
        return res.status(401).send("Không tìm thấy sách này");
      }
      await db.borrowingOffline.create({
        book_id: borrowingOff.book_id,
        user_id: borrowingOff.user_id,
        borrowing_date: now,
        return_date: borrowingOff.return_date,
        due_date: new Date(now.getTime() + 100 * 24 * 60 * 60 * 1000),
      });
      return res.status(200).json({
        errCode: 0,
        msg: "Create borrowingOffline successfully!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json("error");
    }
  }
}

module.exports = new BorrowingOffController();
