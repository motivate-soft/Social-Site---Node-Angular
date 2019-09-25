import app from "./app";
import * as mongoose from 'mongoose';
import { UserSchema } from './models/userModel';
import { socialSchemaForPost } from './models/socialModelForPost';
import { SocialSchemaForBusiness } from './models/socialModelForBusiness';
import { Request, Response } from 'express';

import { Conf } from 'conf';
import { userInfo } from "os";
const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Social.Post', socialSchemaForPost);
const Business = mongoose.model('Social.Business', SocialSchemaForBusiness);

const express = require('express');

const server = app.listen(8100)
const io = require('socket.io').listen(server);

//This example emits to individual sockets (track by sockets Set above).
//Could also add sockets to a "room" as well using socket.join('roomId')
//https://socket.io/docs/server-api/#socket-join-room-callback
app.use(express.static(__dirname + '/dist')); 
io.on('connection', socket => {
  let timerId = null;
  let sockets = new Set();
  sockets.add(socket);
 // console.log(`Socket ${socket.id} added`);
  socket.on('clientdata', data => {
    var ObjectID = require('mongodb').ObjectID;
   
    if (!timerId) {
      startTimer();
    }
    function startTimer() {
      //Simulate stock data received by the server that needs 
      //to be pushed to clients
      timerId = setInterval(() => {
          if (!sockets.size) {
            clearInterval(timerId);
            timerId = null;
           // console.log(`Timer stopped`);
          }
          //See comment above about using a "room" to emit to an entire
          //group of sockets if appropriate for your scenario
          //This example tracks each socket and emits to each one
          if (data !== '' && data !== "-1") {
              Post.find({id: new ObjectID(data)},(err,posts)=>
              {
                if(err) {
                  Business.find({}, (err, business)=>{
                    if(err) io.emit('data', { data: [], business: [], user: 0 });
                    else {
                      User.find({}, (err, user)=>{
                        if(err) io.emit('data', { data: [], business: business, user: 0 });
                        else {
                          if(user === null) io.emit('data', { data: [], business: business, user: 0 });
                          else {
                            let userdata = [];
                            for(let s = 0; s < user.length; s++) {
                              if(user[s].onlineStatus === 1) userdata.push(user[s]);
                            }
                            io.emit('data', { data: [], business: business, user: userdata });
                          }
                        }
                      });
                    }
                  });
                }
                else
                {
                  if(posts == undefined) console.log('Error not found!');
                  else {
                    var Promise = require('promise');
                    function userInfo() {
                      return new Promise(function(resolve, reject){
                        if(posts.length === 0) {
                          resolve([]);
                        }
                        for(let i = 0; i < posts.length; i++) {
                            for(let j = 0; j < posts[i].postRecommend.length; j++) {
                                User.findById(posts[i].postRecommend[j].id, (err, user)=>{
                                if(err) console.log(err);
                                else {
                                    posts[i].postRecommend[j].requestUserName = user.firstName + ' ' + user.lastName;
                                    posts[i].postRecommend[j].picture = user.picture;
                                    posts[i].postRecommend[j].extraBlob = user.extraBlob;
                                    
                                }
                                if((i === posts.length - 1) && (j === posts[i].postRecommend.length - 1)) {
                                  resolve(posts);
                                }
                              });
                            }
                            if((i === posts.length - 1) && (posts[i].postRecommend.length === 0)) {
                              resolve(posts);
                            }
                        }
                      });
                    }
                    userInfo().then(function(post){

                      Business.find({}, (err, business)=>{
                        if(err) io.to(`${socket.id}`).emit('data', { data: post, business: [], user: 0 });
                        else {
                          User.find({}, (err, user)=>{
                            if(err) io.to(`${socket.id}`).emit('data', { data: post, business: business, user: 0 });
                            else {
                              if(user === null) io.to(`${socket.id}`).emit('data', { data: post, business: business, user: 0 });
                              else {
                                let userdata = [];
                                for(let s = 0; s < user.length; s++) {
                                  if(user[s].onlineStatus === 1) userdata.push(user[s]);
                                }
                                io.to(`${socket.id}`).emit('data', { data: post, business: business, user: userdata });
                              }
                            }
                          });
                        }
                      });
                    });
                  }
              }
              });
          } 
          else {
              Business.find({}, (err, business)=>{
                if(err) io.emit('data', { data: [], business: [], user: 0 });
                else {
                  User.find({}, (err, user)=>{
                    if(err) io.emit('data', { data: [], business: business, user: 0 });
                    else {
                      if(user === null) io.emit('data', { data: [], business: business, user: 0 });
                      else {
                        let userdata = [];
                        for(let s = 0; s < user.length; s++) {
                          if(user[s].onlineStatus === 1) userdata.push(user[s]);
                        }
                        io.emit('data', { data: [], business: business, user: userdata });
                      }
                    }
                  });
                }
              });
          }
      }, 2000);
    }
  });

  socket.on('disconnect', () => {
  //  console.log(`Deleting socket: ${socket.id}`);
    sockets.delete(socket);
 //   console.log(`Remaining sockets: ${sockets.size}`);
  });

});

const msgServer = app.listen(8200);
const msgIo = require('socket.io').listen(msgServer);

msgIo.on('connection', msgSocket => {
  let msgTimerId = null;
  let msgSockets = new Set();
  msgSockets.add(msgSocket);

  msgSocket.on('clientdata', data => {
    var ObjectID = require('mongodb').ObjectID;
    if (!msgTimerId) {
      msgStartTimer();
    }
    function msgStartTimer() {
      
      msgTimerId = setInterval(() => {
          if (!msgSockets.size) {
            clearInterval(msgTimerId);
            msgTimerId = null;
          }
          if(data !== '' && data !== "-1") {
           
              Business.findOne({user_id: new ObjectID(data)},(err, business)=>
              {
                if(err)
                  msgIo.to(`${msgSocket.id}`).emit('data', { data: [], favorite: [] });
                else
                {
                if(business != undefined) 
                {
                  var Promise = require('promise');
                    function user() {
                      return new Promise(function(resolve, reject){
                        for(let j = 0; j < business.businessFriends.length; j++) {
                            User.findById(business.businessFriends[j].userId, (err, user)=>{
                              if(err) console.log(err);
                              else {
                                if(user !== null) {
                                  business.businessFriends[j].requestUserName = user.firstName + ' ' + user.lastName;
                                  business.businessFriends[j].picture = user.picture;
                                  business.businessFriends[j].extraBlob = user.extraBlob;
                                  // business.businessFriends[j].status = user.status;
                                }
                              }
                              if(j === business.businessFriends.length - 1) {
                                resolve(business);
                              }
                            });
                        }
                        if(business.businessFriends.length === 0) {
                          resolve(business);
                        }
                        
                      });
                    }
                    user().then(function(business){
                      Post.find({id: data}, (err, posts)=>{
                        if(err) msgIo.to(`${msgSocket.id}`).emit('data', { data: business, favorite: [] });
                        else {
                          if(posts !== null) {
                            for(let p = 0; p < posts.length; p++) {
                              for(let f = 0; f < posts[p].postFavorite.length; f++) {
                                User.findOne({_id: posts[p].postFavorite[f].id}, (err, user)=>{
                                  if(err) msgIo.to(`${msgSocket.id}`).emit('data', { data: business, favorite: [] });
                                  else{
                                    if(user !== null) posts[p].postFavorite[f].user_name = user.firstName + ' ' + user.lastName;
                                    else  posts[p].postFavorite[f].user_name = 'Unknown';
                                    if(p === posts.length - 1 && f === posts[p].postFavorite.length-1) msgIo.to(`${msgSocket.id}`).emit('data', { data: business, favorite: posts });
                                  }
                                });
                              }
                              if(posts[p].postFavorite.length === 0)msgIo.to(`${msgSocket.id}`).emit('data', { data: business, favorite: [] });
                            }
                          }
                          else msgIo.to(`${msgSocket.id}`).emit('data', { data: business, favorite: [] });
                        }
                      });
                          
                    });
                }
              }
              });
            }
      }, 3000);
    }
  });

  msgSocket.on('disconnect', () => {
    msgSockets.delete(msgSocket);
  });

});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})