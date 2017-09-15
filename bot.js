


const Discord = require("discord.js");
const playArbitraryFFmpeg = require('discord.js-arbitrary-ffmpeg');
const ytdl = require("ytdl-core");
const client = new Discord.Client();
const objBot = new Discord.Client();
const fs =require("fs");
const getYouTubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
const https = require('https');
const settings = require ('./settings.json');
const prefix = "!"

var config = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
const request = require("request");
var ffmpeg = require('ffmpeg');

const yt_api_key = config.yt_api_key;
const bot_controller = config.bot_controller;

var queue = [];
var isPlaying = false;
var dispatcher = null;
var voiceChannel = null;
var skipReq = 0;
var skippers = [];
var stop = 0;
var mika = 0;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.reply === prefix + 'ping') {
    msg.reply('pong!');
  };
});

client.on('message', msg => {
  if (msg.content === prefix + 'raph') {
    if (msg.author.id ==175777287063601163 || msg.author.id ==307624586076356608){

    if (msg.author.id ==307624586076356608) {
      msg.reply("Ehh non là tu vas pas me faire spammer !!");
    };
    if (msg.author.id ==175777287063601163) {
      stop = 1;
      mot(msg.channel);
      console.log(stop);
    };
  };
};
});

    // Mika function//
//client.on('message', msg => {
  //if (msg.content === prefix + 'mika') {
    //msg.reply("Allo mon nom est MIKAAAAaaaaaAAAAAaaaaa");
    //mika = 1;
    //console.log(mika);
  //};
//});
//client.on('message', msg => {
  //if (msg.content === 'pis ?') {
    //if (mika == 1) {
      //msg.reply("pis je fais des vidéo de suvie skyblock !");
      //mika = 0;
      //console.log(mika);
    //}
    //else {msg.reply("Daahhh");
  //}
//}
//});

client.on('message', msg => {
  if (msg.channel.id == '307615316467384323' && msg.author.id == '308730086448955432' && stop == 1){
   mot(msg.channel);
 }
 });

client.on('message', msg => {
  if (msg.content === prefix + 'stop') {
    if (msg.author.id ==175777287063601163 || msg.author.id ==307624586076356608){
      stop = 0;
      msg.reply("Ok làlà !");
      console.log(stop);
    };
  };
});



//client.on('message', message => {
//  if (message.content === prefix + 'play') {
//    const voiceChannel = message.member.voiceChannel;
//    if (!voiceChannel) return message.reply(`Please be in a voice channel first!`);
//    voiceChannel.join()
//      .then(connnection => {
//        const stream = ytdl("https://www.youtube.com/watch?v=OKvCV8MFIaw", { filter: 'audioonly' });
//        const dispatcher = connnection.playStream(stream);
//        dispatcher.on('end', () => voiceChannel.leave());
//      });
//  }
//});

client.on('message', function (message){
  const member = message.member;
  const mess = message.content.toLowerCase();
  const args = message.content.split(' ').slice(1).join(" ")

  if (mess.startsWith(prefix + "play")) {
    if (!message.member.voiceChannel) {
    message.reply (" You need to be in a channel first !");return};
    if (queue.lenght > 0 || isPlaying) {
      getID(args, function (id) {
        add_to_queue(id);
        fetchVideoInfo(id, function (err, videoInfo) {
          if (err) throw new Error(err);
          message.reply(" added to queue : **" + videoInfo.title + "**");
        });
      });
    } else {
      isPlaying = true;
      getID(args, function (id) {
        queue.push("placeholder");
        playMusic(id, message);
        fetchVideoInfo(id, function (err, videoInfo) {
          if (err) throw new Error(err);
          message.reply(" currently playing : **" + videoInfo.title + "**");
        });
      });
  }
} else if (mess.startsWith(prefix + "skip")) {
    if (skippers.indexOf(message.author.id) === -1) {
      skippers.push(message.author.id);
      skipReq++;
      if (skipReq >= Math.ceil((voiceChannel.members.size -1) / 2)) {
        skip_song(message);
        message.reply( "The current song has been skipped! ");
      } else {
          message.reply(" You need **" + Math.ceil(((voiceChannel.members.size -1) / 2) - skipReq) + "** more skip vote");
      }
    } else {
        message.reply("you already voted to skip!");
      }
    };
});



client.login(settings.token);

function skip_song(message) {
  dispatcher.end();
  if (queue.length > 1) {
    playMusic(queue[0], message);
  } else {
      skipReq = 0;
      skippers = [];
  }
}

function playMusic(id, message) {
  voiceChannel = message.member.voiceChannel;

  voiceChannel.join().then(function (connection) {
    stream = ytdl("https://youtube.com/watch?v=" + id, {
      filter: 'audioonly'
    });
    skipreq = 0
    skippers = [];

    dispatcher = connection.playStream(stream);
    dispatcher.on("end", function () {
      skipReq = 0;
      skppers = [];
      queue.shift();
      if (queue.length === 0) {
        queue = [];
        isPlaying = false;
      } else {
          playMusic(queue[0], message);
      }
    });
  });
}

function getID(str, cb) {
  if (isYoutube(str)) {
    cb(getYouTubeID(str));
  } else {
      search_video(str, function (id) {
        cb(id);
      });
  }
}

function add_to_queue(strID) {
  if (isYoutube(strID)) {
    queue.push(getYouTubeID(strID));
  } else {
      queue.push(strID);
  }
}

function search_video(query, callback) {
    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function(error, response, body) {
        var json = JSON.parse(body);
        callback(json.items[0].id.videoId);
      });
}

function isYoutube(str) {
  return str.toLowerCase().indexOf("youtube.com") > -1
}

function mot(channel){
 https.get("https://wordnik.com/randoml",function(res){
 channel.send(res.headers.location.slice(7).slice(0, -13),{reply:'169931713055555585'});
 //channel.send(res.headers.location.slice(7).slice(0, -13),{reply:'297171702608035852'});
 })
}
