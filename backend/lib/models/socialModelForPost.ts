import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const socialSchemaForPost = new Schema({

  /*
  * user id
  */
  id: {
    type: String,
    default: ''
  },
  postTitle: {
    type: String,
    default: ''
  },
  picture: {
    type: String,
    default: 'default.png'
  },
  video: {
    type: String,
    default: ''
  },
  pictureContentType: {
    type: String,
    default: ''
  },
  postDescriptionTitle: {
    type: String,
    default: ''
  },
  postDescription: {
    type: String,
    default: ''
  },  
  postComments: {
    type: Array,
    default: []
  },
  postRecommend: {
    type: Array,
    default: []
  },
  /*
  * id: userId, favorite: feel, status: [0 - no seen, 1 - seen ], createdDate: date
  */
  postFavorite: {
    type: Array,
    default: []
  },
  updateDate: {
    type: Date,
    default: Date.now
  },
  updateDateSort: {
    type: Number,
    default: 0
  }, 
  extraBlob: {
    type: String,
    default: '1'  // 1: avatar from gridfs, 2: avatar from general fs
  }
});
