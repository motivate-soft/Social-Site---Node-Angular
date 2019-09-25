import * as mongoose from 'mongoose';
import { SocialSchemaForBusiness } from '../models/socialModelForBusiness';
import { SocialSchemaForEventOfBusiness } from '../models/socialModelForEventOfBussiness';
import { socialSchemaForPost } from '../models/socialModelForPost';
import { UserSchema } from '../models/userModel';
import { Request, Response } from 'express';
import * as request from 'request';
import * as jwt from 'jsonwebtoken';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
const dateTime = require('node-datetime');
import * as nodeemailer from "nodemailer";
import * as gridfsstorage from "multer-gridfs-storage";
import * as Grid from "gridfs-stream";
import { Conf } from '../conf';
const Business = mongoose.model('Social.Business', SocialSchemaForBusiness);
const User = mongoose.model('User', UserSchema);
const Event = mongoose.model('social.businesses.Event', SocialSchemaForEventOfBusiness);
const Post = mongoose.model('Social.Post', socialSchemaForPost);

let isDefault = false;

import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from "crypto";
import { matchedData } from 'express-validator/filter';
import { isRegExp } from 'util';

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

export class BusinessController {

	public makingBusiness(req: Request, res: Response) {
		let business = new Business(req.body.business);
		const customerId = req.body.customerId;
		business.save()
			.then(business => {				
				User.findByIdAndUpdate(customerId, { $set: { businessId: business._id } })
					.then((result)=>{
						if (result) {
							console.log(result);
						}
					});
				res.status(200).json({ 'business': 'business in added successfully' });
			})
			.catch(err => {
				res.status(400).send("unable to save to database");
			});		
	}

	public addBusiness(req, res) {
		let businessData = req.body;
		
		var Promise = require('promise');
		function userUpdate() {
			return new Promise(function(resolve, reject) {
				User.findById({ _id: businessData['user_id']}, (err, user)=>{
					if(err)
						reject(err);
					else {
						if(businessData['logo'])
							user.logoPicture = businessData['logo'];
						if(businessData['picture'])
							user.businessPicture = businessData['picture'];
						user.companyName = businessData['businessName'];
						user.category = businessData['category'];

						user.save().then((item)=>{
							
						})
						.catch((err)=>{
							console.log(err);
						});
					}
					resolve('return');
				})
			})
		}
		userUpdate().then(function(data){
			if (businessData['isUpdate']) {
				Business.findOne({ _id: businessData['businessId'] }, (err, marketBusiness) => {
					if (err)
						res.status(400).send('Update failed');
					else {
						for (let key in businessData) {
							marketBusiness[key] = businessData[key];
						}
						marketBusiness
							.save()
							.then((item) => {
							res.json('Update done');
						})
							.catch((err) => {
							res.status(400).send('Update failed');
						});
					}
				});
			}
			else {
				let marketBusiness = new Business(businessData);
				marketBusiness.save((error, businessData) => {
					if (error) {
						console.log(error);
					}
					else {
						res.status(200).send({ msg: 'Added Successfully' });
					}
				});
			}
		});
	}

	public addEvent(req, res) {
		let eventData = req.body;
		
		var Promise = require('promise');
		let event = new Event(eventData);
		event.save((error, data) => {
			if (error) {
				console.log(error);
			}
			else {
				// Business.findById({_id: eventData.businessId}, (err, item)=> {
				// 	if(err) {
				// 		res.send(err);
				// 	}
				// 	else {
				// 		if(item === null) res.send({ msg: 'Not fount' });
				// 		else {
				// 			let new_event = { name: eventData.name, link: data._id };
				// 			item.companyEvents.push(new_event);
				// 			item
				// 				.save()
				// 				.then((item) => {
				// 					res.send('Add successfully');
				// 				})
				// 				.catch((err) => {
				// 					res.send('Update failed');
				// 			});
				// 		}
				// 	}
				// });
				res.send('Add successfully');
			}
		});
	}

	public editEvent(req, res) {
		let eventData = req.body;
		
		var Promise = require('promise');
		function isUpdate() {
            return new Promise(function(resolveUpdate, rejectBusiness){
                Event.findOne({_id: eventData._id},(err, event)=>{
                    if(err)
                        console.log(err);
                    else {        
                        if(event == null) {
                            res.status(400).send('Update failed');
                        } else {
                            event.type = eventData.type;
                            event.category = eventData.category;
							event.name = eventData.name;
							event.location = eventData.location;
							event.description = eventData.description;
							event.picture = eventData.picture;
							event.startDate = eventData.startDate;
							event.endDate = eventData.endDate;
							event.createDate = eventData.createDate;
                            event.save()
                                .then((item) => {
                                    resolveUpdate(event);                 
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

	public deleteEvent(req, res) {
		
		Event.findByIdAndRemove({_id:req.body._id},(err,post)=>
    	{
			if(err)
			res.json(err);
			else
			res.json('Remove successfully');
		})
	}

	public addBusinessEmployee(req, res) {
		let employee = req.body;
		
		Business.findOne({ _id: employee['id'] }, (err, marketBusiness) => {
			if (err)
				res.status(400).send('Update failed');
			else {
				if(marketBusiness == null || marketBusiness == undefined) res.json('no exist');
				else {
					let new_employee = { name: employee.name, role: employee.role, phone: employee.phone };
					marketBusiness.companyEmployees.push(new_employee);
					marketBusiness
						.save()
						.then((item) => {
						res.json('Update done');
					})
						.catch((err) => {
						res.status(400).send('Update failed');
					});
				}
			}
		});
	}

	public addBusinessEvent(req, res) {
		let event = req.body;

		Business.update({user_id: event.userId}, 
			{ $pull: { "companyEvents" : { name: event.event } } },
			callbackFalse,
			callbackTrue 
		);

		function callbackTrue() {}
		function callbackFalse() {}
		
		Business.findOne({ user_id: event.userId }, (err, marketBusiness) => {
			if (err)
				res.status(400).send('Update failed');
			else {
				if(marketBusiness == null || marketBusiness == undefined) res.json('no exist');
				else {
					let new_event = { name: event.event, link: event.email };
					marketBusiness.companyEvents.push(new_event);
					marketBusiness
						.save()
						.then((item) => {
						res.json('Update done');
					})
						.catch((err) => {
						res.status(400).send('Update failed');
					});
				}
			}
		});
	} 
	
	public addBusinessTransaction(req, res) {
		let transaction = req.body;

		Business.update({_id: transaction.id}, 
			{ $pull: { "companyTransactions" : { name: transaction.name } } },
			callbackFalse,
			callbackTrue 
		);

		function callbackTrue() {}
		function callbackFalse() {}
		
		Business.findOne({ _id: transaction.id }, (err, marketBusiness) => {
			if (err)
				res.status(400).send('Update failed');
			else {
				if(marketBusiness == null || marketBusiness == undefined) res.json('no exist');
				else {
					let new_transaction = { name: transaction.name, number: transaction.number, link: transaction.link };
					marketBusiness.companyTransactions.push(new_transaction);
					marketBusiness
						.save()
						.then((item) => {
						res.json('Update done');
					})
						.catch((err) => {
						res.status(400).send('Update failed');
					});
				}
			}
		});
	} 

	public addBusinessProduct(req, res) {
		let product = req.body;

		Business.update({_id: product.id}, 
			{ $pull: { "companyProducts" : { name: product.name } } },
			callbackFalse,
			callbackTrue 
		);

		function callbackTrue() {}
		function callbackFalse() {}
		
		Business.findOne({ _id: product.id }, (err, marketBusiness) => {
			if (err)
				res.status(400).send('Update failed');
			else {
				if(marketBusiness == null || marketBusiness == undefined) res.json('no exist');
				else {
					let new_product = { name: product.name, picture: product.picture };
					marketBusiness.companyProducts.push(new_product);
					marketBusiness
						.save()
						.then((item) => {
						res.json('Update done');
					})
						.catch((err) => {
						res.status(400).send('Update failed');
					});
				}
			}
		});
	} 

	public deleteBusinessEvent(req, res) {
		let event = req.body;

		Business.update({user_id: event.userId}, 
			{ $pull: { "companyEvents" : { name: event.event } } },
			callbackFalse,
			callbackTrue 
		);

		function callbackTrue() {res.json('undefined')}
		function callbackFalse() {res.json('Delete successfully')}
	}

	public deleteBusinessTransaction(req, res) {
		let event = req.body;

		Business.update({user_id: event.userId}, 
			{ $pull: { "companyTransactions" : { name: event.event } } },
			callbackFalse,
			callbackTrue 
		);

		function callbackTrue() {res.json('undefined')}
		function callbackFalse() {res.json('Delete successfully')}
	}

	public deleteBusinessProduct(req, res) {
		let product = req.body;

		Business.update({user_id: product.userId}, 
			{ $pull: { "companyProducts" : { name: product.name } } },
			callbackFalse,
			callbackTrue 
		);

		function callbackTrue() {res.json('undefined')}
		function callbackFalse() {res.json('Delete successfully')}
	}

	public getAllBusiness(req: Request, res: Response) {
		Business.find({}, function(err, business) {
			if (err) {
				res.send(err);
			}
			for(let i; i < business.length; i++) {
				business[i].id = business[i]._id;
			}
			res.json(business);
		})
	}

	public getBusinessById(req, res) {
		
		var Promise = require('promise');
		function business() {
			return new Promise(function(resolve, reject) {
				Business.findOne({ user_id: req.params.id }, (err, business)=>{
					if(err)
						reject(err);
					else {
						if(business !== null) {
							// business.onlineStatus = 1;
							// business.save();
						}
						if(business !== null && business.businessFriends.length > 0){
							for(let i = 0; i < business.businessFriends.length; i++) {
								Business.findOne({_id: business.businessFriends[i].businessId},(err, friendBusiness)=>{

									business.businessFriends[i].businessId = friendBusiness._id;
									business.businessFriends[i].businessUserId = friendBusiness.user_id;
									business.businessFriends[i].businessName = friendBusiness.businessName;
									business.businessFriends[i].businessPicture = friendBusiness.picture;
									business.businessFriends[i].extraBlob = friendBusiness.extraBlob;

									if(i === business.businessFriends.length - 1) resolve(business);
								});
							}
						}
							
						else
							resolve(business);
					}
				});
			})
		}
		business().then(function(data){
			User.findById(req.params.id, (err, user)=> {
				if(err) console.log(err);
				else {
					if(user !== null) {
						// user.onlineStatus = 1;
						// user.save();
					}
				}
			})
			res.json(data);
		});
		
	}

	public getBusinessByBusinessId(req, res) {
		
		var Promise = require('promise');
		function business() {
			return new Promise(function(resolve, reject) {
				Business.findOne({_id: req.params.id }, (err, business)=>{
					if(err)
						reject(err);
					else {
						if(business !== null) {
							// business.onlineStatus = 1;
							// business.save();
						}
						if(business !== null && business.businessFriends.length > 0){
							for(let i = 0; i < business.businessFriends.length; i++) {
								Business.findOne({_id: business.businessFriends[i].businessId},(err, friendBusiness)=>{

									business.businessFriends[i].businessId = friendBusiness._id;
									business.businessFriends[i].businessUserId = friendBusiness.user_id;
									business.businessFriends[i].businessName = friendBusiness.businessName;
									business.businessFriends[i].businessPicture = friendBusiness.picture;
									business.businessFriends[i].extraBlob = friendBusiness.extraBlob;

									if(i === business.businessFriends.length - 1) resolve(business);
								});
							}
						}
							
						else
							resolve(business);
					}
				});
			})
		}
		business().then(function(data){
			User.findById(req.params.id, (err, user)=> {
				if(err) console.log(err);
				else {
					if(user !== null) {
						// user.onlineStatus = 1;
						// user.save();
					}
				}
			})
			res.json(data);
		});
		
	}

	public getBusinessIdByPostID(req, res) {
		
		var Promise = require('promise');
		function business() {
			return new Promise(function(resolve, reject) {
				Post.findById(req.params.id, (err, post)=>{
					if(err)
						reject(err);
					else {
						if(post === null) {
							res.send(-1);
						}	
						else
							resolve(post.id);
					}
				});
			})
		}
		business().then(function(data){
			Business.findOne({user_id: data}, (err, business)=>{
				if(err) res.send(-1);
				else {
					if(business === null) res.send(-1);
					else res.send(business._id);
				}
			})
		});
		
	}

	public getEventsByBusinessId(req, res) {
		
		var Promise = require('promise');
		function event() {
			return new Promise(function(resolve, reject) {
				Event.find({businessId: req.params.id}, (err, events)=>{
					if(err) console.log(err);
					else {
						if(event === null) res.send('Not found');
						else {
							if(events.length > 0) {
								for(let i = 0; i < events.length; i++) {
									Business.findById(events[i].businessId, (err, business)=>{
										if(err) console.log(err);
										else {
											if(business === null) 
												events[i].userName = "UNKNOWN";
											else events[i].userName = business.businessName;
											if(i === events.length - 1) res.send(events);
										}
									});
								}
							}
							else res.send(events);
						}
					}
				})
			})
		}
		event().then(function(data){
			// User.findById(req.params.id, (err, user)=> {
			// 	if(err) console.log(err);
			// 	else {
			// 		if(user !== null) {
			// 			user.onlineStatus = 1;
			// 			user.save();
			// 		}
			// 	}
			// })
			res.json(data);
		});
		
	}

	public setOfflineStatusByID(req, res) {

		var Promise = require('promise');
		function setOfflineToUser() {
			return new Promise(function(resolve, reject) {
				User.findById({_id: req.params.id}, (err, user) => {
					if(err) {
						reject(err);
					} 
					else {
						if(user !== null ){
							user.onlineStatus = 0;
							user.save(function(err, item) {
								resolve(item);
							});
						} else {
							resolve('user no exist');
						}
					}
				});
			});
		}

		setOfflineToUser().then(function(data){
			Business.findOne({ user_id: req.params.id }, (err, business)=>{
				if(err)
					console.log(err);
				else {
					if(business !== null) {
						business.onlineStatus = 0;
						business.save(function(err, item){
							res.send('offline');
						});
					} else res.send('no exit');
				}
			});
		});
	}

	public setOnlineStatusByID(req, res) {

		var Promise = require('promise');
		function setOnlineToUser() {
			return new Promise(function(resolve, reject) {
				User.findById({_id: req.params.id}, (err, user) => {
					if(err) {
						reject(err);
					} 
					else {
						if(user !== null ){
							user.onlineStatus = 1;
							user.save(function(err, item) {
								resolve(item);
							});
						} else {
							resolve('user no exist');
						}
					}
				});
			});
		}

		setOnlineToUser().then(function(data){
			Business.findOne({ user_id: req.params.id }, (err, business)=>{
				if(err)
					console.log(err);
				else {
					if(business !== null) {
						business.onlineStatus = 1;
						business.save(function(err, item){
							res.send('online');
						});
					} else res.send('no exit');
				}
			});
		});
	}

	public getLogoPicture(req: Request, res: Response) {
		const companyId = req.body.companyId;
		var Promise = require('promise');
		function getLogo() {
			return new Promise(function(resolve, reject){
				Business.findById(companyId, function (err, business) { 
					if (err)
						reject(err);
					else
						resolve(business.companyLogo);
				});
			})
		}
		getLogo().then(function(data){
			res.json(data);
		});
		
	}

	public getBusinessPerIndex(req: Request, res: Response) {
		const perPage = 5;
		const page = req.params.page || 1;
		const from_data = req.body.fromDate;
		const to_data = req.body.toDate;
		let match = {
			"registerDate": {
				"$gte": new Date(Number(from_data.split("-")[0]), Number(from_data.split("-")[1]) - 1, Number(from_data.split("-")[2])),
				"$lte": new Date(Number(to_data.split("-")[0]), Number(to_data.split("-")[1]) - 1, Number(to_data.split("-")[2]))
			}
		};
		if (req.body.country != 'All') {
			match["country"] = {
				"$in": req.body.country.split(',')
			};
		}
		Business.aggregate().match(match)
			.sort({ registerDate: -1 })
			.skip((perPage * page) - perPage)
			.limit(perPage)
			.exec(function (err, businesses) {
				if (err) {
					res.send(err);
				}
				Business.aggregate().match(match)
					.exec(function (err, count) {
						if (err) {
							return res.json({ 'error': 'cant calculate the users count' });
						}
						for (let i = 0; i < businesses.length; i++) {
							businesses[i].id = businesses[i]._id;
							businesses[i].userName = businesses[i].userName;
						}
						return res.send({
							'business': businesses,
							'current': page,
							'pages': Math.ceil(count.length / perPage)
						});
					});
			});		
	}

	public getBusiness(req: Request, res: Response) {
		const perPage = 8;
		const page = req.params.page || 1;
		const from_data = req.body.fromDate;
		const to_data = req.body.toDate;
		const userid = req.body.userid;
		let match = {
			"registerDate": {
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
		Business.aggregate().match(match)
			.sort({ registerDate: -1 })
			.skip((perPage * page) - perPage)
			.limit(perPage)
			.exec(function (err, businesses) {
				if (err) {
					res.send(err);
				}
				Business.aggregate().match(match)
					.exec(function (err, count) {
						if (err) {
							return res.json({ 'error': 'cant calculate the users count' });
						}
						for (let i = 0; i < businesses.length; i++) {
							businesses[i].id = businesses[i]._id;
							// businesses[i].userName = businesses[i].userName;
						}
						return res.send({
							'business': businesses,
							'current': page,
							'pages': Math.ceil(count.length / perPage)
						});
					});
			});	
	}

	public getBusinessesForSearch(req: Request, res: Response) {
		const perPage = 6;
		const page = req.params.page || 1;
		const searchText = req.body.searchText;
		const matchCondition = {
			$or: [
				{ userName: { $regex: searchText, $options: 'i' } },
				{ country: { $regex: searchText, $options: 'i' } },
				{ city: { $regex: searchText, $options: 'i' } },
				{ companyName: { $regex: searchText, $options: 'i' } },
				{ category: { $regex: searchText, $options: 'i' } },
				{ email: { $regex: searchText, $options: 'i' } }
			]
		};
		Business.find(matchCondition)
			.sort({ updateDate: -1 })
			.skip(perPage * page - perPage)
			.limit(perPage)
			.exec((err, businesses) => {
				if (err) {
					res.send(err);
				} else {
					Business.find(matchCondition).exec(function (err, count) {
						if (err) {
							return res.json({ error: 'cant calculate the items count' });
						}
						for (let i = 0; i < businesses.length; i++) {
							businesses[i].id = businesses[i]._id;
						}
						return res.send({
							business: businesses,
							current: page,
							pages: Math.ceil(count.length / perPage)
						});
					});
				}
			});
	}

	public getCompanyInfoByID(req: Request, res: Response) {
		var Promise = require('promise');
		function business() {
			return new Promise(function(resolve, reject) {
				Business.findById(req.params.id, (err, business) => {
					if (err)
						reject(err);
					else
						resolve(business);
				});
			})
		}
		business().then(function(data){
			res.json(data);
		});
		
	}

	public uploadPictureToMonogoose(req: Request, res: Response) {
		upload(req, res, function (err) {
			if (err) {
				return res.status(501).json({ error: err });
			}
			const realFileName = req['file'].filename;
			return res.json({ "fileName": realFileName });
		})
	}
}
