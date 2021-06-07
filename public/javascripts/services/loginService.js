require('dotenv').config()
var UserSchema = require('../models/UserSchema')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('./crypt');
const {NotExtended} = require('http-errors');
const { response } = require('express');
var saltRouds = 10
let refreshTokensArr = []
module.exports = {
    login: async function (email, password, res) {

        var resultStatus = {
            res: {},
            status: ""
        }

        await UserSchema
            .findOne({email: email})
            .then(async chk => {
                
               if (!chk) {
                    resultStatus.status = "User not exist"
                    res.send(resultStatus)
                } else {
                    const match = await bcrypt.compare(password, chk.password)
                    if (match) {
                        const obj = {
                            name: chk.name,
                            email: chk.email,
                            admin: chk.admin
                        }
                        let accessToken = jwt.sign(obj, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: '6d'})
                        let refreshToken = jwt.sign(obj, `${process.env.REFRESH_TOKEN}`, {expiresIn: '7d'})

                        refreshTokensArr.push(refreshToken)
                        
                        var accessTokens = crypto.encrypt(accessToken)
                        var refreshTokens = crypto.encrypt(refreshToken)

                        resultStatus.res = {
                            access: accessTokens,
                            refresh: refreshTokens,
                            name: obj.name
                        }
                        resultStatus.status = "login"

                        res.send(resultStatus)
                    } else {
                        resultStatus.status = "Wrong email or password"
                        res.send(resultStatus)
                    }
                    
                }
                
            })
            .catch(err => {
                
            });
        return resultStatus
    },

    signup: async function (email, password, name) {

        var resultStatus = {
            status: "Added Successfully"
        }
        await UserSchema
            .findOne({email: email})
            .then(async chk => {
                if (!chk) {
                    bcrypt.hash(password, saltRouds, async(err, hash) => {
                        if (err) {
                        
                        } else {
                            password = hash;
                            var newUser = UserSchema({email: email, name: name, password: password})

                            await newUser
                                .save()
                                .then(() => {
                                    return resultStatus
                                })
                                .catch(err => {
                                   
                                });
                        }
                    })
                } else {
                    resultStatus.status = "User already exist"
                    return resultStatus
                }
            })
        return resultStatus
    },
    getPersonalDetail: async(id, res) => {
        var query = {
            _id: id
        }

        UserSchema
            .findOne(query)
            .then(async(chk) => {
                const obj = {
                    name: chk.name,
                    email: chk.email
                }
                res.send(obj)
            })
    },
    auth: async(req, res, next) => {
        let token = req.headers['authorization']
      
        token = token.split(' ')[1]

        var tokens = crypto.decrypt(token)

        jwt.verify(tokens, `${process.env.ACCESS_TOKEN_SECRET}`, (err, user) => {
            if (!err) {
                req.user = user
                next()
            } else {
                return res.send({status: "Unauthorized"})
            }
        })

    },
    refresh: async (token, res) => {
      var tokens = crypto.decrypt(token)
        if (!tokens || !refreshTokensArr.includes(tokens)) {
          
            // obj.status = "Login again"
          res.send({status: "Login again"})
        }
        jwt.verify(tokens, `${process.env.REFRESH_TOKEN}`, (err, user) => {
   
            if (!err) {
           
                const accessToken = jwt.sign({username: user.admin}, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: '6d'})
                  
                var tokKey = crypto.encrypt(accessToken)
           res.send({success: true, token: tokKey})
            } else {
              // console.log(err)
              res.send({success: false, message: "Login again no refresh token"})
            }
        })
    }
}