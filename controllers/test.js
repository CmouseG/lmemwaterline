var model=require("../controllers");

function test(){
	console.log(model);
	model.User.saveUser({username:'user',password:'pass',email:'af@dd'},function(err,user){
		if(err){
			console.log("save is error");
		}
		console.log(user);
	});
}
function read(){
	model.User.findUserByName('user',function(err,user){
		if(err){
			console.log("save is error");
		}
		console.log(user);
	});
}
test();
read();