var Waterline = require('waterline');
var mysqlAdapter = require('sails-mysql');
var mongoAdapter = require('sails-mongo');

// 适配器
var adapters = {
  mongo: mongoAdapter,
  mysql: mysqlAdapter,
  default: 'mongo'
};
// 连接
var connections = {
  mongo: {
    adapter: 'mongo',
    url: 'mongodb://localhost:27017/mynote'
  },
  mysql: {
    adapter: 'mysql',
    password: 'root',
    url: 'mysql://root:@localhost:3306/mynote'
  }
};

// 数据集合
var Note = Waterline.Collection.extend({
  identity: 'note',
  connection: 'mysql',
  schema: true,
  attributes: {
  	id: {
	   type: 'integer',
	   primaryKey: true,
	   autoIncrement: true
	},
    title: {
      type: 'string',
      // 校验器
      required: true
    },
    content: {
      type: 'string',
      // 校验器
      required: true
    },
    tag: {
      type: 'string',
      // 校验器
      required: true
    },
    author: {
      type: 'string',
      // 校验器
      required: true
    },
    createTime: {
      type: 'date',
      defaultsTo:new Date()
    }
  }
});
// 数据集合
var User = Waterline.Collection.extend({
  identity: 'user',
  connection: 'mysql',
  schema: true,
  attributes: {
    id: {
     type: 'integer',
     primaryKey: true,
     autoIncrement: true
  },
    username: {
      type: 'string',
      // 校验器
      required: true
    },
    password: {
      type: 'string',
      // 校验器
      required: true
    },
    email: {
      type: 'string',
      // 校验器
      required: true
    },
    createTime: {
      type: 'date',
      defaultsTo:new Date()
    }
  }
});

var orm = new Waterline();

// 加载数据集合
orm.loadCollection(Note);

var config = {
  adapters: adapters,
  connections: connections
}

var Note={};
var User={};
orm.initialize(config, function(err, models){
	  if(err) {
	    console.error('orm initialize failed.', err)
	    return;
	  }
    Note.findNoteById=function(_noteId,callback){
	     models.collections.note.find({ id: _noteId }).exec(callback);
    }
    Note.findByAuthor=function(author,callback){
      models.collections.note.find({ author: author }).exec(callback);
    }
    Note.findByAuthor=function(author,callback){
        models.collections.note.find({ author: author }).exec(callback);
    }
    Note.saveNote=function(note,callback){  
        models.collections.note.create(note,callback);
    }

    User.findUserById=function(_userId,callback){
        models.collections.user.find({ id: _userId }).exec(callback);
    }
    User.findUserByName=function(username,callback){
        models.collections.user.find({ username: username }).exec(callback);
    }
    User.findUserByEmail=function(email,callback){
        User.find({ email: email }).exec(callback);
    }
    User.saveUser=function(user,callback){
        models.collections.user.create(user,callback);
    }
});

exports.User=Note;
exports.User=Note;