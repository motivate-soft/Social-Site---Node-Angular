import * as mongoose from 'mongoose';
import { ItemSchema } from '../models/itemModel';
import { UserSchema } from '../models/userModel';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as multer from 'multer';
const dateTime = require('node-datetime');

const Item = mongoose.model('Item', ItemSchema);
const User = mongoose.model('User', UserSchema);

const itemImageStore = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/item');
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + '.' + file.originalname);
	}
});

const itemImageUpload = multer({ storage: itemImageStore }).single('file');

export class ItemController {
	public uploadPicture(req: Request, res: Response) {
		itemImageUpload(req, res, function(err) {
			if (err) {
				return res.status(501).json({ error: err });
			}
			const realFileName = req['file'].filename;
			return res.json({ fileName: realFileName });
		});
	}

	public addItem(req: Request, res: Response) {
	}

	
	public getItemsForSearch(req: Request, res: Response) {
		
	}

	public getItemsByPage(req: Request, res: Response) {
	}

	public removeItems(req: Request, res: Response) {
	}

	public getItemById(req: Request, res: Response) {
	}

	public getDisplayItemById(req: Request, res: Response) {
	}

	public updateItem(req: Request, res: Response) {
	}

}