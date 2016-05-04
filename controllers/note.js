
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'mynote',
  password: 'mynote',
  database: 'mynote'
});

exports.findNoteById=function(_noteId,callback){
  //  db.Note.findOne({_id:_noteId},callback);
   pool.getConnection(function (err, connection) {
    	var query = connection.query('SELECT * FROM note WHERE id=?', _noteId, callback);
	});
}
exports.findByAuthor=function(author,callback){
    pool.getConnection(function (err, connection) {
    	var query = connection.query('SELECT * FROM note WHERE author=?', author, callback);
    });
}
exports.saveNote=function(note,callback){
	  pool.getConnection(function (err, connection) {
	 	  var  noteSql = 'INSERT INTO note(title,author,tag,content,createtime) VALUES(?,?,?,?,now())';
  		//增 add
   		connection.query(noteSql,[note.title,note.author,note.tag,note.content],callback);
	 });
}