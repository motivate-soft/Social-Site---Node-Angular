export const Conf = {
    // Remote monogodb url
    mongoURL: 'mongodb://localhost:27017/mydb',
   
    // Dummy json data url and base type array
    avatarDummyURL: 'uploads/avatar/dummy/',
    itemPictureDummyURL: 'uploads/item/dummy/',
    jsonDummyURL: 'uploads/dummydata/',
    jsonBusinessDummyURL: 'uploads/dummybusinessdata/',
    interestArr:  ['To Invest', 'To Be Sold', 'Merge', 'Investment', 'Buying'],
    typeArr: ['Company', 'Investor', 'Entrepreneur'],
    activityArr: ['Cars', 'Hi-Tech', 'Agricalture', 'Finance'],

    // SecretKey for google captcha
    captchaSecretKey: '	6LddVooUAAAAAN03aojwIx_lzcscRtX09c-Dxzgv',

    // Mail info for forgot password
    nodeHost: "https://myheroku.herokuapp.com",
    mailUserName: "hjhjhj@gmail.com",
    mailPassword: "hjhjhj_16",
    mailUser: "hgghgh@gmail.com",
    mailPort: 465,

    // Request limit number
    requestMaxNum: 1000,

    // Maximum request number for signup
    requestMaxSignupNum: 3
};