
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'mynote',
  password: 'mynote',
  database: 'mynote'
});

exports.findUserById=function(_userId,callback){
   pool.getConnection(function (err, connection) {
    	var query = connection.query('SELECT * FROM user WHERE id=?', _userId, callback);
	});
}
exports.findUserByName=function(username,callback){
    pool.getConnection(function (err, connection) {
    	var query = connection.query('SELECT * FROM user WHERE username=?', username, callback);
    });
}
exports.findUserByEmail=function(email,callback){
   // db.User.findOne({username:email},callback);
     pool.getConnection(function (err, connection) {
    	var query = connection.query('SELECT * FROM user WHERE email=?', email, callback);
    });
}
exports.saveUser=function(user,callback){
	 pool.getConnection(function (err, connection) {
	 	var  userSql = 'INSERT INTO user(email,username,password,createtime) VALUES(?,?,?,now())';
  		//增 add
   		connection.query(userSql,[user.email,user.username,user.password],callback);
	 });
}