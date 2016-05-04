var express=require('express');
var bodyParser=require('body-parser');
var path=require('path');
var fs = require('fs');
/*增加处理日志的中间件*/
var logger = require('morgan');
/*增加加密的中间件*/
var crypto=require('crypto');
/*日期处理中间件*/
var moment = require('moment');

var flash = require("connect-flash")
var session=require('express-session');//session会话的
/*自定义中间件*/
var controllers=require('./controllers');
var checkValidate=require('./service/checkValidate');

var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

//创建express类实例
var app=express();
//定义EJS模板引擎和模板文件位置***
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');//还可以定义其他模板引擎

//定义静态文件的位置
app.use(express.static(path.join(__dirname,'public')));

app.use(logger({stream: accessLog}));
app.use(function(err,req,res,next){
    var meta='['+new Data()+']'+req.url+'\n';
    errorLog.write(meta+err.stack+'\n');
    next();
});

//定义数据解析器，json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret:'1234',
    name:'myname',//sessionid的名称
    cookie:{maxAge:1000*60*20},//20分钟
    resave:false,
    saveUninialized:true
}));
//不同界面之间传递值
app.use(flash());



//相应首页get请求
app.get('/',checkLogin);
app.get('/',function(req,res){
    res.render('index',{
        user:req.session.user,
        title:'首页'
    });
});

app.get('/blank',function(req,res){
    res.render('index',{
        user:req.session.user,
        title:'首页'
    });
});
//登录
app.post('/login',checkNotLogin);
app.post('/login',function(req,res){
    console.log('登录！');
    var username=req.body.username,
        password=req.body.password;
    //检查用户名和密码是否合规
    var error=checkValidate.checkLoginValidate({username:username,password:password});
    if(error) {
        res.render('login',{title:'登录',error:error});
    }
    //
    controllers.User.findUserByName(username,function(err,users){
        var user=users[0];//取得第一个
        if(err){
            console.log(err);
            return res.redirect('/login');
        }

        if(!user){
            console.log('用户名不存在')
            return res.redirect('/login');
        }
        //对密码进行加密
        var md5=crypto.createHash('md5'),
            md5Password=md5.update(password).digest('hex');
        console.log(user);
        console.log(password+"--"+user.password);
        if(user.password!==md5Password){
            console.log('密码错误！');
            return res.redirect('/login');
        }
        console.log('登录成功！');
        user.password=null;
        delete user.password;
        req.session.user=user;
        return res.redirect('/');
    });
});

//处理登录请求
app.get('/login',checkNotLogin);
app.get('/login',function(req,res){
    res.render('login',{title:'登录',error:''});
});

//处理注册
app.get('/registor',checkNotLogin);
app.get('/registor',function(req,res){
    console.log('注册！');
    var error=req.body.error;
    if(!error){
        error="";
    }
    res.render('login',{title:'注册',error:error});
});
//添加用户
app.post('/registor',checkNotLogin);
app.post('/registor',function(req,res){
    console.log('注册！');
    var username=req.body.username,
        email=req.body.email,
        password=req.body.password,
        repassword=req.body.repassword;
    //检查是否合法
    var iserror=checkValidate.checkRegistorValidate({email:email,username:username,password:password,repassword:repassword});
    if(iserror){
        return res.render('login',{title:'注册',error:iserror});
    }
    controllers.User.findUserByName(username,function(err,user){
        if(err){
            console.log(err);
            error=err;
            return res.render('registor',{title:'注册',error:error});
        }
        if(user&&user.username){
            console.log('用户名已经存在');
            console.log(user);
            flash('error','用户名已经存在');
            error='用户名已经存在';
            return res.redirect('/registor?error='+error);
        }
        //对密码进行加密
        var md5=crypto.createHash('md5'),
            md5Password=md5.update(password).digest('hex');

        //新建User对象并保存
        var newUser={
            email:email,
            username:username,
            password:md5Password
        };
        controllers.User.saveUser(newUser,function(err,doc){
            if(err){
                console.log(err);
                return res.redirect('/registor');
            }
            newUser.password=null;
            delete newUser.password;
            req.session.user=newUser;
            console.log('注册成功！');
            return res.redirect('/');
        });
    });
});

app.get('/quit',function(req,res){
    console.log('登出！！');
    req.session.user=null;
    return res.redirect('/login');
});
app.post('/post',checkLogin);
app.post('/post',function(req,res){
    console.log('发布！');
    var note={
        title:req.body.title,
        author:req.session.user.username,
        tag:req.body.tag,
        content:req.body.content
    };
    controllers.Note.saveNote(note,function(err,doc){
        if(err){
            console.log(err);
            return res.redirect('/post');
        }
        console.log('文章发表成功');
    });

    res.render('post',{
        title:'发布'
    });
});
app.get('/post',checkLogin);
app.get('/post',function(req,res){
    console.log('发布！');
    res.render('post',{
        title:'发布'
    });
});
app.get('/detail',checkLogin);
app.get('/detail',function(req,res){
    var currentpage=req.query.currentpage? parseInt(req.query.currentpage):1;//判断当前页，如果没有则是第一页
    controllers.Note.findByAuthor(req.session.user.username,function(err,allNotes){
        if(err) {
            console.log(err);
            return res.redirect('/');
        }
        var pageCounts=allNotes.length;
        var pageSize=5;
        //var pageCounts=Math.ceil(notesCount/pageSize);//每页五个,共多少页
        allNotes=allNotes.splice((currentpage-1)*pageSize,(currentpage-1)*pageSize+5);
        res.render('detail',{
            title:'我的文章',
            user:req.session.user,
            notes:allNotes,
            pageSize:pageSize,
            pageCounts:pageCounts,
            currentpage:currentpage,
            moment:moment
        });
    });
});

app.get("/noteDetail",function(req,res){
    var id=req.query.id;
    console.log("请求的ID为："+id);
    controllers.Note.findNoteById(id,function(err,note){
        if(err){
            console.log(err);
            return res.redirect('/');
        }
        console.log(note);
        res.json(note);
        res.end();
    });
});

function checkLogin(req,res,next){
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
}

/**
 * 增加路由中间件
 */
app.use(function(req,res){
    res.render("error-404");
});

function checkNotLogin(req,res,next){
    if(req.session.user){
        return res.redirect('back');
    }
    next();
}

//监听3000端口
app.listen(3001,function(req,res){
    console.log('app is running at port 3000');
});
