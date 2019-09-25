import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const AvatarBusinessSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  data: {
    type: Buffer,
    default: ''
  },
  contentType: {
    type: String,
    default: ''
  }
});

export const FirstNameBusinessSchema = new Schema({
  firstName: {
    type: String,
    default: ''
  }
});

export const LastNameBusinessSchema = new Schema({
  lastName: {
    type: String,
    default: ''
  }
});

export const CityBusinessSchema = new Schema({
  city: {
    type: String,
    default: ''
  }
});

export const CategoryBusinessSchema = new Schema({
  category: {
    type: String,
    default: ''
  }
});

export const CountryBusinessSchema = new Schema({
  country: {
    type: String,
    default: ''
  }
});

export const CompanyNameBusinessSchema = new Schema({
  companyName: {
    type: String,
    default: ''
  }
});

export const JobTitleBusinessSchema = new Schema({
  jobTitle: {
    type: String,
    default: ''
  }
});

export const PhoneNumberBusinessSchema = new Schema({
  phoneNumber: {
    type: String,
    default: ''
  }
});

export const FacebookBusinessSchema = new Schema({
  facebook: {
    type: String,
    default: ''
  }
});

export const LinkdinBusinessSchema = new Schema({
  linkdin: {
    type: String,
    default: ''
  }
});

export const EmailBusinessSchema = new Schema({
  email: {
    type: String,
    default: ''
  }
});

export const CommentsBusinessSchema = new Schema({
  comments: {
    type: String,
    default: ''
  }
});