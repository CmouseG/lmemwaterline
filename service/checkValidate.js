"use strict";

function checkRegistorValidate(userinfo){
    console.log(userinfo);
    if(userinfo.username.trim().length==0){
        return   "用户名不能为空！！！";
    }
    //正则表达式验证邮箱
    var emailPattern = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if(!emailPattern.test(userinfo.email)){
        return "邮箱格式错误";
    }
    //正则表达式验证
    var nameParttern=/\w{3,20}/g
    if(!nameParttern.test(userinfo.username)){
        return "用户名必须是数字字母和下划线组成，且必须3-20字符";
    }
    if(userinfo.password.trim().length==0|| userinfo.repassword.trim().length==0){
        return  '密码不能为空！';
    }
    if(userinfo.password!=userinfo.repassword){
        return  error='两次密码不一致';
    }
    //密码必须包含数字字母下划线
    if(!(/[A-z]/.test(userinfo.password))||!(/[0-9]/.test(userinfo.password))||!(/\_/.test(userinfo.password))){
        return  "长度不能少于6，必须同时包含数字、小写字母、大写字母";
    }
}

function checkLoginValidate(userinfo){
    if(!userinfo.username||userinfo.username.trim().length==0){
        return   "用户名不能为空！";
    }
    if(!userinfo.password||userinfo.password.trim().length==0){
        return  '密码不能为空！';
    }
}
exports.checkRegistorValidate=checkRegistorValidate;
exports.checkLoginValidate =checkLoginValidate;