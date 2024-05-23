const db = require("../models/index");
const sequelize = require("sequelize");

class AuthorController {
  async createNewAuthor(req, res) {
    try {
      const author = req.body;
      await db.author.create({
        author_name: author.author_name,
        nationality: author.nationality,
        date_of_birth: author.date_of_birth,
        date_of_death: author.date_of_death,
      });
      return res.status(200).json({
        errCode: 0,
        msg: "Create author successfully!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json("error");
    }
  }

  async getAllAuthor(req, res) {
    try {
      const result = await db.author.sequelize.query(
        "SELECT author_id, author_name, nationality, DATE_FORMAT(date_of_birth, '%Y-%m-%d %H:%i:%s') as date_of_birth, DATE_FORMAT(date_of_death, '%Y-%m-%d %H:%i:%s') as date_of_death FROM authors", 
      {
        type: sequelize.QueryTypes.SELECT,
      });
      return res.status(200).json({
        errCode: 0,
        msg: "Get all author successfully!",
        result,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json("error");
    }
  }

  async updateAuthor(req, res) {
    try {
      const authorId = req.params.id;
      const { author_name, nationality, date_of_birth, date_of_death } = req.body;

      const author = await db.author.findByPk(authorId);
      if (!author) {
        return res.status(404).json({
          errCode: 1,
          msg: "Author not found!",
        });
      }

      await author.update({
        author_name,
        nationality,
        date_of_birth,
        date_of_death,
      });

      return res.status(200).json({
        errCode: 0,
        msg: "Update author successfully!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json("error");
    }
  }
}

module.exports = new AuthorController();

