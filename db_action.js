module.exports = async (mysql, dbConfig, sqlQuery, res) => {
  var connection = await mysql.createConnection(dbConfig);

  await connection.execute(sqlQuery);
  await connection.end();

  res.redirect('/');
}