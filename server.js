var express = require('express');
var app = express();
var server =require('http').createServer(app)
//var io = require('socket.io').listen(server)
var device  = require('express-device');
var users =0;
var async = require('async')
var _ = require('lodash')
// var bodyParser = require('body-parser')({
//   limit : '100mb'
// });

var exec = require('child_process').exec;


//var runningPortNumber = process.env.PORT;
// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 1338;
var pg = require('pg');

var mysql = require('mysql');
//var connectionString = 'postgres://vomacjljurztol:Ji21QOeibbXT2pAxXdqEYS3z1M@ec2-54-163-225-82.compute-1.amazonaws.com:5432/d68rcu647d9t97';
// var connectionString = 'postgres://zvgjrfnxpvbxuz:CcjykfoKOYrUEPijLBO0wcir-T@ec2-54-235-89-113.compute-1.amazonaws.com:5432/ddb9pbgaq4jfsc'
// var client = new pg.Client(connectionString);
//psql database connection
var connection = mysql.createConnection({
  host     : 'rosales12.cruxmj2a7oou.us-west-2.rds.amazonaws.com',
  user     : 'rikriki',
  password : 'rosales1',
  database : 'rosales12'
});
var morgan = require('morgan')
// for(var i=0;i<5000;i++){
  
//  var sql = "INSERT INTO ?? SET ?";
//  var inserts = ['entity_tweet', {uid:1,tweet:casual.sentence}];
//  sql = mysql.format(sql, inserts);
//  getResults(sql,function(results){
    
//  })
// }






// psql -h ec2-54-235-89-113.compute-1.amazonaws.com -d ddb9pbgaq4jfsc -U zvgjrfnxpvbxuz -W CcjykfoKOYrUEPijLBO0wcir-T

//app.use(morgan('combined'))
app.use(function(req,res,next){
  
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()

})

// logs every request
app.use(function(req, res, next){
  // output every request in the array
  console.log({method:req.method, url: req.url, device: req.device,ip:req.ip});
  var sql  = "INSERT INTO ?? SET ?";
  var arr = ["entity_log",{method:req.method, url: req.url, device: req.device,ip:req.ip.split(':')[3] || "1"}]
  sql = mysql.format(sql,arr);
  getResults(sql,function(results){
    next();
  })
  // goes onto the next function in line
  
});

// make express look in the public directory for assets (css/js/img)




app.configure(function(){
  // I need to access everything in '/public' directly
  app.use(express.static(__dirname + '/'));

  //set the view engine
  app.set('view engine', 'ejs');
  app.set('views', __dirname +'/');
  app.engine('.html', require('ejs').renderFile);
  app.use(device.capture());
});

// set the home page route
app.get('/', function(req, res) {

  // ejs render automatically looks in the views folder
  res.render('index.html');
  
});


// app.get('/portfolios', function(req, res) {
//     var sql = "SELECT `entity_items`.`id`, `entity_items`.`name`,`entity_items`.`link`,`entity_items`.`sub_headline`,`entity_items`.`descriptions`,`entity_images`.`itemID`, GROUP_CONCAT(`entity_images`.`images`, ', ') as images from `entity_images` left join `entity_items` ON `entity_images`.`itemID` = `entity_items`.`id` left join `entity_item_technologies` ON `entity_images`.`itemID` = `entity_images`.`itemID` WHERE `entity_images`.`itemID` IN (SELECT GROUP_CONCAT(itemID,' ,') from entity_images GROUP BY itemID) GROUP BY `entity_images`.`itemID`"
    
//     //var sql = "SELECT * from entity_items"
//     getResults(sql, function(results) {

//         // results = _.groupBy(results, function(v) {
//         //     return v.name
//         // })

// })
app.get('/portfolios', function(req, res) {
    
    var sql = "SELECT `entity_tech`.`technologies`,`entity_foobar`.`id`,`entity_foobar`.`images`,`entity_foobar`.`name` ,`entity_foobar`.`link`,`entity_foobar`.`image`,`entity_foobar`.`sub_headline`,`entity_foobar`.`descriptions` from (SELECT `entity_item_technologies`.`itemID`, GROUP_CONCAT(`entity_technologies`.`name` SEPARATOR ',' ) as 'technologies' from  `entity_item_technologies` LEFT JOIN `entity_technologies` ON `entity_technologies`.`id` =  `entity_item_technologies`.`technologyID` GROUP BY `entity_item_technologies`.`itemID`) as `entity_tech` RIGHT JOIN (SELECT `entity_foo`.`id`, GROUP_CONCAT(`entity_images`.`images` SEPARATOR ',') as 'images',`entity_foo`.`name`,`entity_foo`.`image`,`entity_foo`.`link`,`entity_foo`.`sub_headline`,`entity_foo`.`descriptions` from (SELECT  `id`,`image`,  `name`, `link`, `sub_headline`, `descriptions` from `entity_items`) as `entity_foo` LEFT JOIN `entity_images` ON `entity_images`.`itemID` = `entity_foo`.`id` GROUP BY `entity_images`.`itemID`) as `entity_foobar` ON `entity_tech`.`itemID` = `entity_foobar`.`id`"
    getResults(sql, function(err, results) {
        if(err)
          res.send({items:results})
  
        res.send({items:results})
    })
});
// create application/json parser
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

// var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(jsonParser);

app.post('/items',jsonParser, function(req,res){
  console.log('Server', req.body)
  res.send({items:'yes'})
})

function getResults(sql,done){
  connection.query(sql,function(err,results){
    if(err) 
      done(err,null)
    
    done(null,results)
  })
}
// >>>>>>> f8d3c6a8c32193a24dc7520878cac2993f90d1fb

//         // })



//         res.send(results)  
//     });
    

// })

// <<<<<<< HEAD
// function getResults(sql, done) {
//     connection.query(sql, function(err, results) {
//      console.log(err,'asdasd')
//         if (err)
//             console.log(err)
//         done(results)
//     })
// }

// =======
// logs every request
// app.use(function(req, res, next) {
//     // output every request in the array and save to logs
//     var request = { method: req.method, url: req.url, device: JSON.stringify(req.device), ip: req.ip.split(':')[3] };
//     console.log(request)
//     var query = connection.query('INSERT INTO entity_log SET ?', request, function(err, result) {
//         // Neat!
      
//         next();
//     });
// });
// >>>>>>> f8d3c6a8c32193a24dc7520878cac2993f90d1fb



// io.sockets.on('connection', function (socket) {
//   users = users + 1;
//   io.sockets.emit('blast', {msg:"<span style=\"color:red !important\">someone connected</span>"});

//   socket.on('blast', function(data, fn){
//     console.log("___________________________________________________________________");
//     io.sockets.emit('blast', {msg:data.msg});


//     fn();//call the client back to clear out the field
//   });
//   io.sockets.emit('updateUSers', {msg:users});
//   socket.on('blast', function(data, fn){
//     console.log(data);
//     io.sockets.emit('blast', {msg:data.msg});
//     fn();//call the client back to clear out the field
//   });
//   socket.on('disconnect',function(){
//     users = users - 1;
//     io.sockets.emit('updateUSers', {msg:users});
//     io.sockets.emit('disconnected',{msg:'<span>someone disconnected</span>'})
//     io.emit('user disconnected');
//     console.log("riki");
//   });
  

// });


server.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});

