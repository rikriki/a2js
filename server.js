var express = require('express');
var app = express();
var server =require('http').createServer(app)

var device  = require('express-device');
var users =0;
var async = require('async')
var _ = require('lodash')
var request = require('request')
// var bodyParser = require('body-parser')({
//   limit : '100mb'
// });

var exec = require('child_process').exec;

var logRequest = false
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


var sockets;
var io = require('socket.io').listen(server)

io.sockets.on('connection',(socket)=>{
  
  console.log('Socket Coonected!', socket.id)
  initGame(socket)
})

var songs = require('./songsSmall');

var testing = false;

// create application/json parser
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

// var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(jsonParser);

function initGame(socket){
  sockets = socket;
  socket.on('hostCreateNewGame',hostCreateNewGame)
  socket.on('singerJoinRoom',singerJoinRoom)
  socket.on('singerSendSong',singerSendSong)
  socket.on('singerRemoveSong',singerRemoveSong)
  socket.on('singerSendCommand',singerSendCommand)
  socket.on('hostRemoveReserve',hostRemoveReserve)
  
  
  
  

}
function hostRemoveReserve(data){
  io.sockets.in(data.singerId).emit('singerRemoveItemPlaylist', data);
} 
function singerRemoveSong(data){
  io.sockets.in(data.karaokeId).emit('hostRemoveItemPlaylist', data);
}
function singerSendCommand(data){
  io.sockets.in(data.karaokeId).emit('hostReceivedCommand', data);
}
function singerJoinRoom(data){
   // A reference to the player's Socket.IO socket object
    var sock = this;

    var room =io.sockets.adapter.rooms[data.id]
    // If the room exists...
    if( room != undefined ){
        // attach the socket id to the data object.
        data.mySocketId = sock.id;

        // Join the room
        sock.join(data.id);

        console.log('Player ' + data.name + ' joining game: ' + data.id );

        // Emit an event notifying the clients that the player has joined the room.
        io.sockets.in(data.id).emit('singerJoinedRoom', data);

    } else {
        // Otherwise, send an error message back to the player.
        io.sockets.emit('OnError',{message: "This room does not exist."} );
    }
}

function singerSendSong(data){
  
  let sql = "INSERT INTO ?? SET ?";
  let arr= ["karaoke_song_history",{singer:data.singer,videoId:data.videoId}]
  sql = mysql.format(sql,arr);
  getResults(sql,function(results){
    console.log(results)
  })
  io.sockets.in(data.karaokeId).emit('hostReserveSong', data);
  
}
function hostCreateNewGame(){
   // Create a unique Socket.IO Room

    var thisGameId = ( Math.random() * 100000 ) | 0;
    // console.log(this,"yow")
    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});

    // Join the Room and wait for the players
    this.join(thisGameId.toString());
    
}

 // // Create a unique Socket.IO Room
 //    var thisGameId = ( Math.random() * 100000 ) | 0;

 //    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
 //    socket.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});

 //    // Join the Room and wait for the players
 //    this.join(thisGameId.toString());



// psql -h ec2-54-235-89-113.compute-1.amazonaws.com -d ddb9pbgaq4jfsc -U zvgjrfnxpvbxuz -W CcjykfoKOYrUEPijLBO0wcir-T

//app.use(morgan('combined'))
app.use(function(req,res,next){
  
  res.header("Access-Control-Allow-Origin", "*");
  
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next()

})

// logs every request
app.use(function(req, res, next){
  if(logRequest){
    // output every request in the array
    console.log({method:req.method, url: req.url, device: req.device,ip:req.ip});
    var sql  = "INSERT INTO ?? SET ?";
    var arr = ["entity_log",{method:req.method, url: req.url, device: req.device,ip:req.ip.split(':')[3] || "1"}]
    sql = mysql.format(sql,arr);
    getResults(sql,function(results){
      next();
    })
  }else{
    next()
  }
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

app.post('/hooks', function(req, res) {
  console.log(req.body,"eh!")
  console.log(req.headers['user-agent'], "headers")
  res.send({test:"s"})
  exec('git pull origin master && npm start', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  
})

var cachedSongs;
app.get('/songs', function(req, res) {
  
  console.log(req.query, " songsa")
  if(testing){
      res.send({type:'songs',items:songs.items})
  }else{

    var sql = "SELECT title,videoId,language FROM `karaoke_videos`"
    getResults(sql, function(err, results) {
        if(err)
          res.send({result:err})

        res.send({type:'songs',items:results})
    })
  }
});
app.get('/language', function(req, res) {
  var sql = "SELECT language FROM `karaoke_videos` GROUP BY `language` DESC"
  getResults(sql, function(err, results) {
        if(err)
          res.send({result:err})

        res.send({type:'language',items:results})
  })
});
app.get('/genres', function(req, res) {
    var sql = "SELECT type FROM `karaoke_genres` group by `type`"
    getResults(sql, function(err, results) {
        if(err)
          res.send({result:err})
  
        res.send({type:'genres',items:results})
    })
});




function getResults(sql,done){
  connection.query(sql,function(err,results){
    if(err) 
      done(err,null)
    
    done(null,results)
  })
}



server.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});

