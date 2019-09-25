import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SocialSchemaForEventOfBusiness = new Schema({
    
    id: {
        type: String,
        default: ''
    },
    businessId: {
        type: String,
        default: ''
    },
    type: { // 1: private, 2: public
        type: Number,
        default: 1
    },
    category: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    userName: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    /*
    *  [businessId, status, createdDate]
    *  
    * businessId: friend's id in social.businesses collection,
    * status: 0->pendding, 1->confirm, -1 -> delete
    * createdDate: created date
    */
    invite: {
        type: Array,
        default: []
    },
    description: {
        type: String,
        default: ''
    },
    picture: {
        type: String,
        default: 'default.jpg'
    },
    startDate: {
      type: String,
      default: ''
    },
    endDate: {
      type: String,
      default: ''
    },
    createDate: {
      type: Date,
      default: Date.now
    },
    updateDateSort: {
      type: Number,
      default: 0
    }
});