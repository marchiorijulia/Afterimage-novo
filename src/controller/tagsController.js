const connection = require("../config/db")

async function listTags(request, response) {
  let query = "SELECT * FROM tags";

  connection.query(query, (err, results) => {
    if(results) {
      response
        .status(200)
        .json({
          success: true,
          message: "Sucesso!",
          data: results
        })
    } else {
      response
        .status(400)
        .json({
          success: false,
          message: "Sem sucesso!",
          data: err
        })
    }
  })
}

module.exports = {
  listTags
}