import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SocialSchemaForBusiness = new Schema({
    
    id: {
        type: String,
        default: ''
    },
    user_id: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    businessName: {
        type: String,
        default: ''
    },
    businessLogoName: {
        type: String,
        default: ''
    },
    /*
    *  [businessId, userId, postId, status, createdDate]
    *  
    * businessId: friend's id in social.businesses collection,
    * userId: friend's id in users collection,
    * postId: my id of social.posts recommended by friend
    * status: 0->pendding, 1->confirm, -1 -> delete
    * createdDate: created date
    */
    businessFriends: {
        type: Array,
        default: []
    },
    /*
    *   name, role, phone
    */
    companyEmployees: {
        type: Array,
        default: []
    },
    /*
    * name, link(email)
    */
    companyEvents: {
        type: Array,
        default: []
    },
    /*
    * name, number, link(website address)
    */
   companyTransactions: {
        type: Array,
        default: []
    },

    /*
    * name, picture
    */
    companyProducts: {
        type: Array,
        default: []
    },

    facebook: {
        type: String,
        default: ''
    },
    linkdin: {
        type: String,
        default: ''
    },
    offerType: {
        type: String,
        default: ''
    },
    Description: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    picture: {
        type: String,
        default: 'default.jpg'
    },
    logo: {
        type: String,
        default: 'default.jpg'
    },

    registerDate: {
      type: Date,
      default: Date.now
    },

    registerDateSort: {
      type: Number,
      default: 0
    },

    updateDate: {
      type: Date,
      default: Date.now
    },
    
    updateDateSort: {
      type: Number,
      default: 0
    },
    country: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    extraBlob: {
        type: String,
        default: '1'   // 1: picture from gridfs, 2: picture from general fs
    },
    extraStr: {
        type: String,
        default: ''
    },
    onlineStatus: { // 0: offline, 1: online
        type: Number,
        default: 0
    }

});

export const marketRFSSliderSchema = new Schema({
    slider: {
        type: String,
        default: ''
    }
});