
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var util = require('util');

var app = express();

var users = {
	'byvoid':{
		name:'Carbo',
		website:'http://www.byvoid.com'
	}
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//微博路由规划
app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);

app.get('/users', user.list);
app.get('/hello', routes.hello);
app.all('/user/:username', function(req, res, next){
	if(users[req.params.username]){
		next();
	}else{
		next(new Error(req.params.username + 'does not exit'));
	}
	console.log('all methods captured');
	next();
});
app.get('/user/:username', function(req, res){
	//res.send('user: ' + req.params.username);
	res.send(JSON.stringify(users[req.params.username]));
});



	//partials
app.get('/list', function(req, res){
	res.render('list', {
		title:'List',
		items:[1991, 'byvoid', 'express', 'Node.js']
	});
});
app.put('/user/:username', function(req, res){
	res.send('Done');
});

//视图助手
/*
app.helpers({
	inspect: function(obj){
		return util.inspect(obj, true);
	}
});
app.dynamicHelpers({
	headers: function(req, res){
		return req.headers;
	}
})；
app.get('/helper', function(req, res){
	res.render('helper', {
		title:"Helpers"
	});
});*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
