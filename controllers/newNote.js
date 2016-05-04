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
var orm = new Waterline();

// 加载数据集合
orm.loadCollection(Note);

var config = {
  adapters: adapters,
  connections: connections
}

exports.findNoteById=function(_noteId,callback){
   orm.initialize(config, function(err, models){
	  if(err) {
	    console.error('orm initialize failed.', err)
	    return;
	  }
	  models.collections.note.find({ id: _noteId }).exec(callback);
	});
}
exports.findByAuthor=function(author,callback){
     orm.initialize(config, function(err, models){
	  if(err) {
	    console.error('orm initialize failed.', err)
	    return;
	  }
	  models.collections.note.find({ author: author }).exec(callback);
	});
}
exports.saveNote=function(note,callback){
	orm.initialize(config, function(err, models){
	  if(err) {
	    console.error('orm initialize failed.', err)
	    return;
	  }
	  models.collections.note.create(note,callback);
	});
}