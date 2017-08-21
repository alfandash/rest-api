const db = require('../models');
const generateAlphaNumeric = require('../helpers/generateAlphaNumeric');
const crypto = require("crypto");

function convertPass(pass,secret) {
  console.log(pass);
  console.log(secret);
  var hash = crypto.createHmac('sha256', `${secret}`)
                     .update(`${pass}`)
                     .digest('hex');
  return hash;
}

const signinUser = function(req,res) {
  let whereUsername = {
    where:{
      username: req.body.username
    }
  }
  db.User.findOne(whereUsername)
  .then((row)=>{
    if(row === null) {
      res.json({err: 'Akun tidak ditemukan'})
    } else {
      let hashPass = convertPass(req.body.password,row.secret)
      if (row.password === hashPass){
        res.json({success: 'success'})
      } else {
        res.json({err: 'password salah'})
      }
    }
  })
  .catch((err)=>{
    res.send(err)
  })
}

const signupUser = function(req,res) {
  var secretKeyLength = 8;
  generateAlphaNumeric(secretKeyLength,(secret)=>{
    var newUser = {
      username: `${req.body.username}`,
      password: `${req.body.password}`,
      secret: `${secret}`,
      role: `member`,
      email: `${req.body.email}`
    }
    db.User.create(newUser)
    .then((row)=>{
      res.json(row)
    })
    .catch((err)=>{
      res.json(err)
    })
  })
}

module.exports = {
  signupUser,
  signinUser
}
