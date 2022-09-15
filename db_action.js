module.exports = async (mysql, dbConfig, sqlQuery, res) => {
  var connection = await mysql.createConnection(dbConfig);

  await connection.execute(sqlQuery);
  await connection.end();

  //set validation message
  var message = encodeURIComponent('Database updated');

  res.redirect('/?valMsg=' + message + '&' + 'valType=success');
}