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
orm.loadCollection(User);
var config = {
  adapters: adapters,
  connections: connections
}

/**
*根据用户ID查找
*/
exports.findUserById=function(_userId,callback){
	orm.initialize(config, function(err, models){
	  if(err) {
	    console.error('orm initialize failed.', err)
	    return;
	  }
	  models.collections.user.find({ id: _userId }).exec(callback);
	});
}
exports.findUserByName=function(username,callback){
	orm.initialize(config, function(err, models){
	  if(err) {
	    console.error('orm initialize failed.', err)
	    return;
	  }
	  models.collections.user.find({ username: username }).exec(callback);
	});
}
exports.findUserByEmail=function(email,callback){
  orm.initialize(config, function(err, models){
	  if(err) {
	    console.error('orm initialize failed.', err)
	    return;
	  }
	  User.find({ email: email }).exec(callback);
   });
}
exports.saveUser=function(user,callback){
	orm.initialize(config, function(err, models){
	  if(err) {
	    console.error('orm initialize failed.', err)
	    return;
	  }
	  models.collections.user.create(user,callback);
	});
}