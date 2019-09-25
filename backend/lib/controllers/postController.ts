import * as mongoose from 'mongoose';
import { SocialSchemaForBusiness } from '../models/socialModelForBusiness';
import { UserSchema } from '../models/userModel';
import { socialSchemaForPost } from '../models/socialModelForPost';
import { VideoSchema} from '../models/itemDummyModel';
import { Request, Response } from 'express';
import * as request from 'request';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
const dateTime = require('node-datetime');
import * as nodeemailer from "nodemailer";
import { Conf } from '../conf';
const Business = mongoose.model('Social.Business', SocialSchemaForBusiness);
const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Social.Post', socialSchemaForPost);
const Video = mongoose.model('Video', VideoSchema);
let isDefault = false;

import * as path from 'path';
import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from "crypto";
import * as multer from 'multer';
import * as gridfsstorage from "multer-gridfs-storage";
import * as Grid from "gridfs-stream";
import { json } from 'body-parser';
const remote_mongo = Conf.mongoURL;

const storage = new gridfsstorage({
    url: remote_mongo,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    } 
});

const upload = multer({ storage }).single('file');

export class PostController {
	
    public insertPost(req: Request, res: Response) {
        let insert = req.body;
        let post = new Post(insert);
        post.save()
            .then(post => {
                res.status(200).json({ 'post': 'post in added successfully' });
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("unable to save to database");
            });
    }	

    public updatePost(req: Request, res: Response) {
        let insert = req.body;
        function isUpdate() {
            return new Promise(function(resolveUpdate, rejectBusiness){
                Post.findOne({_id: insert._id},(err, post)=>{
                    if(err)
                        console.log(err);
                    else {        
                        if(post == null) {
                            res.status(400).send('Update failed');
                        } else {
                            post.postTitle = insert.postTitle;
                            post.picture = insert.picture,
                            post.postDescriptionTitle = insert.postDescriptionTitle;
                            post.postDescription = insert.postDescription;
                            post.pictureContentType = insert.pictureContentType;
                            post.video = insert.video;
                            const dt = dateTime.create();
			                const formatUpdateDate = dt.format('Y-m-d H:M:S');
                            post.updateDate = formatUpdateDate;
                            post.save()
                                .then((item) => {
                                    resolveUpdate(post);                 
                                })
                                .catch((err) => {
                                    res.status(400).send('Update failed');
                                });
                            }
                            
                        }
                    });
                    
                });
            }
            isUpdate().then(function(data){
                res.status(200).json(data);
            });
    }

    public deletePost(req: Request, res: Response) {
        Post.findByIdAndRemove({_id:req.body._id},(err,post)=>
    	{
			if(err)
			res.json(err);
			else
			res.json('Remove successfully');
		})
    }

    public favoritePost(req: Request, res: Response) {
        var ObjectID = require('mongodb').ObjectID;
        var objectId;
        try {
            objectId = new ObjectID(req.body.id);
        } catch (error) {
            return res.json(error);
        }

        const dt = dateTime.create();
        const formatUpdateDate = dt.format('Y-m-d H:M:S');
        
        var Promise = require('promise');

        Post.update({_id: req.body._id}, 
                    { $pull: { "postFavorite" : { id: objectId } } },
                    callbackFalse,
                    callbackTrue 
                );

        function callbackTrue() {}
        function callbackFalse() {}
                
        function favorite() {
            return new Promise(function(resolve, reject){
                Post.findById({_id:req.body._id},(err,post)=>
                {
                    if(err)
                        res.status(400).json(err);
                    else
                    {
                        if(post == undefined) res.json('Error not found!');
                        else {
                            resolve(post);
                        }
                    }
                
                });
            })
        }
        favorite().then(function(data){
            let new_favorite = {id: objectId, favorite: req.body.favorite, status: 0, createdDate: formatUpdateDate};
                data.postFavorite.push(new_favorite);
                data.save(function(err, item){
                    res.json("Add successfully");
                });
        });
        
    }


    public favoriteDelete(req: Request, res: Response) {
        var ObjectID = require('mongodb').ObjectID;
        var objectId;
        try {
            objectId = new ObjectID(req.body.id);
        } catch (error) {
            return res.json("unregistered user");
        }

        Post.update({_id: req.body._id}, 
                    { $pull: { "postFavorite" : { id: objectId } } },
                    callbackFalse,
                    callbackTrue 
                );

        function callbackTrue() { res.json('undefined')}
        function callbackFalse() { res.json('Delete successfully')}
        
    }

    public sendRecommend(req: Request, res: Response) {
        var ObjectID = require('mongodb').ObjectID;
        var objectId;
        const dt = dateTime.create();
        const formatUpdateDate = dt.format('Y-m-d H:M:S');
        for(let i = 0; i < req.body.from.length; i++) {
            try {
                objectId = new ObjectID(req.body.from[i]);
            } catch (error) {
                return res.json(error);
            }
            
            var Promise = require('promise');

            Post.update({_id: req.body._id}, 
                        { $pull: { "postRecommend" : { id: objectId } } },
                        callbackFalse,
                        callbackTrue 
                    );

            function callbackTrue() {}
            function callbackFalse() {}
                    
            function recommend() {
                return new Promise(function(resolve, reject){
                    Post.findById({_id:req.body._id},(err,post)=>
                    {
                        if(err)
                            res.status(400).json(err);
                        else
                        {
                            if(post == undefined) res.json('Error not found!');
                            else {
                                resolve(post);
                            }
                        }
                    
                    });
                })
            }
            recommend().then(function(data){
                let new_recommend = {id: objectId, status: 0}; // request: 0, confirm: 1, delete: -1
                    data.postRecommend.push(new_recommend);
                    data.save(function(err, item){

                        // Business.update({user_id: req.body.to}, 
                        //     { $pull: { "businessFriends" : { businessId: req.body.businesses[i] } } },
                        //     backFalse,
                        //     backTrue
                        // );
                        // function backTrue() {}
                        // function backFalse() {}

                        Business.findOne({user_id: req.body.to}, (err, business)=> {
                            if(err) console.log(err);
                            else {
                                let new_friend = {businessId: req.body.businesses[i], userId: req.body.from[i], postId: req.body._id, status: 0, createdDate: formatUpdateDate }; /// Status: 0 - request, 1 - accept, -1: delete
                                business.businessFriends.push(new_friend);
                                business.save(function(e, i){});
                            }
                        });
                        if(i === req.body.from.length - 1) res.json("Recommend successfully");
                    });
            });
        }
        
    }

    public confirmRecommend(req: Request, res: Response) {
        var ObjectID = require('mongodb').ObjectID;
        var objectId;
        try {
            objectId = new ObjectID(req.body.id);
        } catch (error) {
            return res.json(error);
        }
        
        var Promise = require('promise');

        Post.update({_id: req.body._id}, 
                    { $pull: { "postRecommend" : { id: objectId } } },
                    callbackFalse,
                    callbackTrue 
                );

        function callbackTrue() {}
        function callbackFalse() {}
                
        function confirm() {
            return new Promise(function(resolve, reject){
                Post.findById({_id:req.body._id},(err,post)=>
                {
                    if(err)
                        res.status(400).json(err);
                    else
                    {
                        if(post == undefined) res.json('Error not found!');
                        else {
                            resolve(post);
                        }
                    }
                
                });
            })
        }
        confirm().then(function(data){
            let new_recommend = {id: objectId, status: 1}; // request: 0, confirm: 1, delete: -1
                data.postRecommend.push(new_recommend);
                data.save(function(err, item){
                    res.json("Confirmed successfully");
                });
        });
        
    }

    public deleteRecommend(req: Request, res: Response) {
        var ObjectID = require('mongodb').ObjectID;
        var objectId;
        try {
            objectId = new ObjectID(req.body.id);
        } catch (error) {
            return res.json(error);
        }
        
        var Promise = require('promise');

        Post.update({_id: req.body._id}, 
                    { $pull: { "postRecommend" : { id: objectId } } },
                    callbackFalse,
                    callbackTrue 
                );

        function callbackTrue() {}
        function callbackFalse() {}
                
        function recommend() {
            return new Promise(function(resolve, reject){
                Post.findById({_id:req.body._id},(err,post)=>
                {
                    if(err)
                        res.status(400).json(err);
                    else
                    {
                        if(post == undefined) res.json('Error not found!');
                        else {
                            resolve(post);
                        }
                    }
                
                });
            })
        }
        recommend().then(function(data){
            let new_recommend = {id: objectId, status: -1}; // request: 0, confirm: 1, delete: -1
                data.postRecommend.push(new_recommend);
                data.save(function(err, item){
                    res.json("Deleted successfully");
                });
        });
        
    }

    public addComment(req: Request, res: Response) {
        var ObjectID = require('mongodb').ObjectID;
        var objectId;
        try {
            objectId = new ObjectID(req.body.id);
        } catch (error) {
            return res.json(error);
        }
        
        var Promise = require('promise');
                
        function recommend() {
            return new Promise(function(resolve, reject){
                Post.findById({_id:req.body._id},(err,post)=>
                {
                    if(err)
                        res.status(400).json(err);
                    else
                    {
                        if(post == undefined) res.json('Error not found!');
                        else {
                            resolve(post);
                        }
                    }
                
                });
            })
        }
        recommend().then(function(data){
            let new_comment = {id: objectId, comment: req.body.comment}; // request: 0, confirm: 1, delete: -1
                data.postComments.push(new_comment);
                data.save(function(err, item){
                    res.json("Add comment successfully");
                });
        });
        
    }
    
    
    public getAllPosts(req: Request, res: Response) {
        const perPage = 8;
        const page = req.params.page || 1;
        const from_data = req.body.fromDate;
        const to_data = req.body.toDate;
        let match = {
            "updateDate": {
                "$gte": new Date(Number(from_data.split("-")[0]), Number(from_data.split("-")[1]) - 1, Number(from_data.split("-")[2])),
                "$lte": new Date(Number(to_data.split("-")[0]), Number(to_data.split("-")[1]) - 1, Number(to_data.split("-")[2]))
            }
        };
        if (req.body.country != 'All') {
            match["country"] = {
                "$in": req.body.country.split(',')
            };
        }
        Post.aggregate().match(match)
            // .sort({ updateDate: -1 })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, posts) {
                if (err) {
                    res.send(err);
                }
                Post.aggregate().match(match)
                    .exec(function (err, count) {
                        if (err) {
                            return res.json({ 'error': 'cant calculate the posts count' });
                        }
                        for (let i = 0; i < posts.length; i++) {
                            posts[i].id = posts[i]._id;
                            posts[i].postsTitle = posts[i].postsTitle;
                        }
                        return res.send({
                            'post': posts,
                            'current': page,
                            'pages': Math.ceil(count.length / perPage)
                        });
                    });
            });
    }

    public getAllPostsForDatatable(req: Request, res: Response) {
        const from_data = req.body.fromDate;
        const to_data = req.body.toDate;
        let video = [];
        let match = {
            "updateDate": {
                "$gte": new Date(Number(from_data.split("-")[0]), Number(from_data.split("-")[1]) - 1, Number(from_data.split("-")[2])),
                "$lte": new Date(Number(to_data.split("-")[0]), Number(to_data.split("-")[1]) - 1, Number(to_data.split("-")[2]))
            }
        };
        if (req.body.country != 'All') {
            match["country"] = {
                "$in": req.body.country.split(',')
            };
        }
        if (req.body.category != 'All') {
            match["category"] = {
                "$in": req.body.category.split(',')
            };
        }
            
        var Promise = require('promise');
        function searchBusinesses() {
            return new Promise(function(searchResolve, searchReject){
                Business.aggregate().match(match)
                    .exec(function(err, searchResult){
                        if(err) console.log(err);
                        else {
                            let searchUserId = '';
                            if(searchResult !== null)
                            {
                                for(let s = 0; s < searchResult.length; s++) {
                                    searchUserId += searchResult[s].user_id + ',';
                                }
                            }
                            searchResolve(searchUserId);
                        }
                    });
            });
        }
        searchBusinesses().then(function(search){
            if(search === '') {
                return res.send({
                    'post': []
                });
            }
            let post_match = {
                "id": {
                    "$in": search.split(',')
                }
            }
            Post.aggregate().match(post_match)
                .exec(function (err, posts) {
                    if (err) {
                        res.send(err);
                    }

                    if(posts === undefined || posts === null || posts.length === 0)
                    {
                        return res.send({
                            'post': []
                        });
                    }
                    else
                    for (let i = 0; i < posts.length; i++) {
                        const userid = posts[i].id;
                        function business() {
                            return new Promise(function(resolve,reject) {
                                Business.findOne({ user_id: userid }, (err, marketBusiness) => {
                                    if (err)
                                    reject(err)
                                    
                                    else {
                                        resolve(marketBusiness);
                                    }
                                });
                            });
                        }
                        
                        business().then(function(marketBusiness) {
                            posts[i].businessId = marketBusiness._id;
                            posts[i].companyName = marketBusiness.businessName;
                            posts[i].companyLogo = marketBusiness.logo;
                            posts[i].country = marketBusiness.country;
                            posts[i].category = marketBusiness.category;
                            posts[i].offerType = marketBusiness.offerType;
                            posts[i].companyExtraBlob = marketBusiness.extraBlob;
                            if(posts[i].postComments.length > 0) {
                                for(let j = 0; j < posts[i].postComments.length; j++) {
                                    User.findById({_id: posts[i].postComments[j].id}, (e, commentUser)=>{
                                        if(e) console.log(e);
                                        else {
                                            posts[i].postComments[j].commentUserName = commentUser.firstName + ' ' + commentUser.lastName;
                                            posts[i].postComments[j].commentUserPicture = commentUser.picture;
                                            posts[i].postComments[j].commentUserExtraBlob = commentUser.extraBlob;
                                            
                                            if((i === posts.length - 1) && (j === posts[i].postComments.length - 1)){
                                                return res.send({
                                                    'post': posts
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                            else
                            {
                                if((i === posts.length - 1)) {
                                    return res.send({
                                        'post': posts
                                    });
                                }
                            }
                        });
                    }
            });
        })
        
    }

    public getPostDataById(req: Request, res: Response) {
        var Promise = require('promise');
        function getData() {
            return new Promise(function(resolve, reject){
                Post.findById(req.params.id, (err, post) => {
                    if (err)
                        reject(err)
                    else
                        resolve(post);
                });
            })
        }
        getData().then(function(data){
            res.json(data);
        });
        
    }

    public getPostsDataByUserId(req: Request, res: Response) {
        var Promise = require('promise');
        function getData() {
            return new Promise(function(resolve, reject){
                Post.findById({ id: req.params.id }, (err, posts) => {
                    if (err)
                        reject(err)
                    else
                       resolve(posts)
                });
            })
        }
        getData().then(function(data){
            res.send({
                'post': data,
            });
        });
        
        
    }

    public uploadPictureToMonogoose111(req: Request, res: Response) {
        upload(req, res, function (err) {
            if (err) {
                return res.status(501).json({ error: err });
            }
            const realFileName = req['file'].filename;
            return res.json({ "fileName": realFileName });
        })
    }
}
