import {Request, Response, NextFunction} from "express";
import { UserController } from "../controllers/userController";
import { ItemController } from "../controllers/itemController";
import { BusinessController } from "../controllers/businessController";
import { SettingController } from "../controllers/settingController";
import { PostController } from "../controllers/postController";
import { InMemory } from "../controllers/inMemory";
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import { ItemSchema } from '../models/itemModel';
const Item = mongoose.model('Item', ItemSchema);

export class Routes { 
    
    public userController: UserController = new UserController();
    public itemController: ItemController = new ItemController();
    public businessController: BusinessController = new BusinessController();
    public postController: PostController = new PostController();

    public settingController: SettingController = new SettingController();
    public inMemory: InMemory = new InMemory();

    public checkToken(req: Request, res: Response){
        if(!req.headers.authorization){
            return res.status(401).end();
        }
        let token=req.headers.authorization.split(' ')[1];
        if(token === 'null'){
            return res.status(401).end();
        }
        let payload=jwt.verify(token,'secretKey');
        return payload;
    }
    
    verifyToken = (req: Request, res: Response, next) => {
        let payload = this.checkToken(req, res);
        if(!payload){
            return res.status(401).end()
        }
        else{
            next();
        }
    }

    verifyAdminToken = (req: Request, res: Response, next) => {
        let payload = this.checkToken(req, res);
        if(!payload){
            return res.status(401).end()
        }
        else if(payload.role != 1){
            return res.status(401).end()
        }
        else{
            next();
        }
    }
    verifyUserIDMatch = (req: Request, res: Response, next) => {
        let payload = this.checkToken(req, res);
        if(!payload){
            return res.status(401).end();
        }else if(payload.role == 1){
            next();
        }else{
            if(payload.user_id != req.params.id)
            {
                return res.status(401).end();
            }
            else{
                next();
            }
        }
    }
    verifyItemIDMatch = (req: Request, res: Response, next) => {
        let payload = this.checkToken(req, res);
        if(!payload){
            return res.status(401).end();
        }
        if(payload.role == 1){
            next();
        }else{
            Item.find({user_id: payload.user_id, _id: req.params.id}, (err, items) => {
                if (err) {
                    return res.status(401).end();
                } else {
                    if(items.length == 0){
                        return res.status(401).end();
                    }
                    else{
                        next();
                    }
                }
            });
            
        }
    }

    public routes(app): void {   
      

        app.route('/').get((req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '/../../public/index.html'));
        });
        


        ////////////////////////////////////////////////
        ///////    Routes Definition for User    ///////
        ////////////////////////////////////////////////
        
        app.route('/api/signup').post(this.inMemory.checkIfRegisteredSameIP, this.userController.signUP);

        app.route('/api/signin').post(this.inMemory.requestCounter, this.userController.signIn);

        app.route('/api/forgot').post((req,res) => this.userController.forgot(req, res));

        app.route('/api/reset').post(this.userController.reset);

        app.route('/api/validCaptchaUrl/:token').get(this.userController.validCaptchaUrl);

        app.route('/api/getUsers/:page').post([this.inMemory.requestCounter], this.userController.getUsersByPage);

        app.route('/api/addUser').post([this.verifyAdminToken, this.inMemory.requestCounter], this.userController.addUser);

        app.route('/api/getUserByID/:id').get([this.verifyUserIDMatch, this.inMemory.requestCounter], this.userController.getUserByID);

        app.route('/api/getUserForSearch/:page').post(this.inMemory.requestCounter, this.userController.getUserForSearch);

        app.route('/api/updateUser/:id').post([this.verifyUserIDMatch, this.inMemory.requestCounter], this.userController.updateUser);

        app.route('/api/updateUserbyRegular/:id').post([this.verifyUserIDMatch, this.inMemory.requestCounter], this.userController.updateUserbyRegular);

        app.route('/api/removeUser/:id').delete([this.verifyAdminToken, this.inMemory.requestCounter], this.userController.removeUser);

        app.route('/api/uploadPicture').post(this.userController.uploadPicture);

        app.route('/api/uploadPictureToMongoose').post(this.userController.uploadPictureToMonogoose);

        app.route('/api/displayPicture/:filename').get(this.userController.displayPicture);

        ////////////////////////////////////////////////
        ///////    Routes Definition for Item    ///////
        ////////////////////////////////////////////////

        app.route('/api/addItem').post([this.verifyToken, this.inMemory.requestCounter], this.itemController.addItem);

        app.route('/api/uploadItemPicture').post(this.itemController.uploadPicture);

        app.route('/api/getItemsForSearch/:page').post(this.inMemory.requestCounter, this.itemController.getItemsForSearch);

        app.route('/api/getItems/:page').post(this.inMemory.requestCounter, this.itemController.getItemsByPage);

        app.route('/api/getItemById/:id').get([this.verifyItemIDMatch, this.inMemory.requestCounter], this.itemController.getItemById);
        
        app.route('/api/getDisplayItemById/:id').get(this.inMemory.requestCounter, this.itemController.getDisplayItemById);

        app.route('/api/removeItems/:id').delete([this.verifyItemIDMatch, this.inMemory.requestCounter], this.itemController.removeItems);

        app.route('/api/updateItem/:id').post([this.verifyItemIDMatch, this.inMemory.requestCounter], this.itemController.updateItem);


        ////////////////////////////////////////////////
        /////    Routes Definition for Setting    //////
        ////////////////////////////////////////////////

        app.route('/api/loadFromLocalToDb').get(this.verifyAdminToken, this.settingController.loadFromLocalToDb);
        
        app.route('/api/loadFromLocalBusinessToDb').get(this.verifyAdminToken, this.settingController.loadFromLocalBusinessToDb);

        app.route('/api/createDummyData/:userCount/:itemCount').get(this.verifyAdminToken, this.settingController.createDummyData);
        
        app.route('/api/createBusinessDummyData/:businessCount').get(this.verifyAdminToken, this.settingController.createBusinessDummyData);

        app.route('/api/displayPictureFromFS/:filename').get(this.settingController.displayPictureFromFS);

        app.route('/api/displayAvatarFromFS/:filename').get(this.settingController.displayAvatarFromFS);

        //////////////////////////////////////////////////
        ///////    Routes Definition for Social    ///////
        //////////////////////////////////////////////////

        app.route('/api/makingBusiness').post(this.businessController.makingBusiness);

        app.route('/api/getBusiness/:page').post(this.businessController.getBusiness);

        app.route('/api/getAllBusiness').get(this.businessController.getAllBusiness);

        app.route('/api/getCompanyInfo/:id').get(this.businessController.getCompanyInfoByID);

        app.route('/api/getBusinessesForSearch/:page').post(this.inMemory.requestCounter, this.businessController.getBusinessesForSearch);

        app.route('/api/getLogoPicture').post(this.businessController.getLogoPicture);

        app.route('/api/getBusinessPerIndex/:page').post(this.businessController.getBusinessPerIndex);

        app.route('/api/getBusinessById/:id').get(this.businessController.getBusinessById);

        app.route('/api/getBusinessByBusinessId/:id').get(this.businessController.getBusinessByBusinessId);

        app.route('/api/getBusinessIdByPostID/:id').get(this.businessController.getBusinessIdByPostID);

        app.route('/api/getEventsByBusinessId/:id').get(this.businessController.getEventsByBusinessId);

        app.route('/api/setOfflineStatusByID/:id').get(this.businessController.setOfflineStatusByID);

        app.route('/api/setOnlineStatusByID/:id').get(this.businessController.setOnlineStatusByID);

        app.route('/api/addBusiness').post(this.businessController.addBusiness);

        app.route('/api/addEvent').post(this.businessController.addEvent);

        app.route('/api/editEvent').post(this.businessController.editEvent);

        app.route('/api/deleteEvent').post(this.businessController.deleteEvent);

        app.route('/api/addBusinessEmployee').post(this.businessController.addBusinessEmployee);

        app.route('/api/addBusinessEvent').post(this.businessController.addBusinessEvent);

        app.route('/api/addBusinessTransaction').post(this.businessController.addBusinessTransaction);

        app.route('/api/addBusinessProduct').post(this.businessController.addBusinessProduct);

        app.route('/api/deleteBusinessEvent').post(this.businessController.deleteBusinessEvent);

        app.route('/api/deleteBusinessTransaction').post(this.businessController.deleteBusinessTransaction);

        app.route('/api/deleteBusinessProduct').post(this.businessController.deleteBusinessProduct);
        //////////////////////////////////////////////////
        ///////    Routes Definition for Post    /////////
        //////////////////////////////////////////////////

        app.route('/api/insertAddPost').post(this.postController.insertPost);

        app.route('/api/updatePost').post(this.postController.updatePost);

        app.route('/api/deletePost').post(this.postController.deletePost);

        app.route('/api/favoritePost').post(this.postController.favoritePost);

        app.route('/api/favoriteDelete').post(this.postController.favoriteDelete); 

        app.route('/api/sendRecommend').post(this.postController.sendRecommend);

        app.route('/api/confirmRecommend').post(this.postController.confirmRecommend);

        app.route('/api/deleteRecommend').post(this.postController.deleteRecommend);

        app.route('/api/addComment').post(this.postController.addComment);

        app.route('/api/getAllPosts/:page').post(this.postController.getAllPosts);

        app.route('/api/getAllPostsForDatatable').post(this.postController.getAllPostsForDatatable);

        app.route('/api/getPostDataById/:id').get(this.postController.getPostDataById);

        app.route('/api/getPostsDataByUserId/:id').get(this.postController.getPostsDataByUserId);

        app.route('/api/uploadPictureToMongoose111').post(this.postController.uploadPictureToMonogoose111);        

    }
}