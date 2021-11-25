const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const base64img = require("base64-img");
const otpGenerator = require('otp-generator')
const axios = require('axios')

const datatable = require('../libraries/datatable/Datatable');
const tableFilter = require('../libraries/datatable/Filter');
const mail = require('../libraries/mail');

const config = require('../config');
const appDir = require('path').dirname(require.main.filename);

const User = require('../models/User');
const UserLog = require('../models/UserLog');
const SiteSetting = require('../models/SiteSetting');

/**
 * Login
 * Check active user with valid credential
 * Then generate token with expiration data from site config
 */
exports.login = (req, res, next) => {
    if(!req.body.username) {
        res.status(422).json({
            success: false,
            status: 422,
            data: null,
            message: "Username can not be blank"
        });
    }
    if(!req.body.password) {
        res.status(422).json({
            success: false,
            status: 422,
            data: null,
            message: "Password can not be blank"
        });
    }
    const log = new UserLog();
    User.findOne({
        username: req.body.username,
        isActive: true
    })
        .populate('roleID')
        .then(user => {
            bcrypt.compare(req.body.password, user.password, (err, matched) => {
                if(err) {
                    log.logFailed(req, err, user._id);
                    log.save();
                    res.status(400).json({
                        success: false,
                        status: 400,
                        data: err,
                        message: err.message
                    });
                }
                if(matched) {
                    let expiresIn = `${config.default.siteSetting.session.value} ${config.default.siteSetting.session.unit}`;
                    SiteSetting.findOne({})
                        .then(setting => {
                            if(setting) {
                                expiresIn = `${setting.session.value} ${setting.session.unit}`;
                            }
                            let token = user.generateJWT(user, expiresIn);
                            log.logSuccess(req, 'success', user._id);
                            log.save();
                            res.status(200).json({
                                success: true,
                                status: 200,
                                data: { token },
                                message: "Success!"
                            });
                        })
                        .catch(err => {
                            log.logFailed(req, err, user._id);
                            log.save();
                            res.status(400).json({
                                success: false,
                                status: 400,
                                data: err,
                                message: err.message
                            });
                        });

                } else {
                    log.logFailed(req, 'wrong password', user._id);
                    log.save();
                    res.status(400).json({
                        success: false,
                        status: 400,
                        data: null,
                        message: "Wrong password!!"
                    });
                }
            });
        })
        .catch(err => {
            log.logFailed(req, 'user does not found');
            log.save();
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: "User does not found"
            });
        });
};
/**
 * Login
 * Check active user with valid credential
 * Then generate token with expiration data from site config
 */
 exports.loginWithPhone = (req, res, next) => {
    if(!req.body.phone) {
        res.status(422).json({
            success: false,
            status: 422,
            data: null,
            message: "Phone number can not be blank"
        });
    }
    const log = new UserLog();
    User.findOne({
        phone: req.body.phone,
        isActive: true
    })
        .populate('roleID')
        .then(user => {
           
                if (!user) {       
                    
                        console.log('.....');
                        const user = new User();
                         user.assignData(req.body);
                         user.isActive = true;
                         user.isPending = false;
                         user.name = "null";
                         user.firstName = "null";
                         user.email = "null";
                         user.username =  "null";
                         user.roleID = "60d053b9731bbb5eec5d423f";
                       
                         user.phone == this.phone
                        user.save()
                            .then(() => {
                                console.log('...then..');
                                User.findOne({
                                    phone: req.body.phone,
                                    isActive: true
                                })
                                .populate('roleID')
                                    .then(user => {
    
                      
    
                                
                        phone = req.body.phone;
                        let otpcode = otpGenerator.generate(6, {
                            digits: true,
                            alphabets: false,
                            upperCase: false,
                            specialChars: false
                          });
                        
                          const serverName = "CICV";
                          const urlOtp = `http://appvas.com/script/scriptSms.php?content=${otpcode}&expediteur=${serverName}&destinataire=${phone}`;
                          axios.get(urlOtp)
                            .then(response => {
                              console.log(response)
                              user.otp = otpcode;
                              user.otpCodeExpire = new Date(Date.now() + 2 * 60 * 1000); // 2 min
                              user.save({
                                validateBeforeSave: false
                              });
                            })
                            .catch(error => {
                              console.log(error)
                              return res.status(400).json({
                                success:false,
                                message: JSON.stringify(error)
                              });
                            })
          
                              let expiresIn = `${config.default.siteSetting.session.value} ${config.default.siteSetting.session.unit}`;
                              SiteSetting.findOne({})
                                  .then(setting => {
                                      if(setting) {
                                          expiresIn = `${setting.session.value} ${setting.session.unit}`;
                                      }
                                      let token = user.generateJWT(user, expiresIn);
                                      log.logSuccess(req, 'success', user._id);
                                      log.save();
                                      res.status(200).json({
                                          success: true,
                                          status: 200,
                                          data: { token },
                                          message: "Success!"
                                      });
                                  })
        
                          
                            })
            
                            
                            })
                            .catch(err => {
                                res.status(400).json({
                                    success: false,
                                    status: 400,
                                    data: err,
                                    message: err.message
                                });
                            })
                   
                    

                } else {

                    phone = user.phone;
                    let otpcode = otpGenerator.generate(6, {
                      digits: true,
                      alphabets: false,
                      upperCase: false,
                      specialChars: false
                    });
                  
                    const serverName = "CICV";
                    const urlOtp = `http://appvas.com/script/scriptSms.php?content=${otpcode}&expediteur=${serverName}&destinataire=${phone}`;
                    axios.get(urlOtp)
                      .then(response => {
                        console.log(response)
                        user.otp = otpcode;
                        user.otpCodeExpire = new Date(Date.now() + 2 * 60 * 1000); // 2 min
                        user.save({
                          validateBeforeSave: false
                        });
                      })
                      .catch(error => {
                        console.log(error)
                        return res.status(400).json({
                          success:false,
                          message: JSON.stringify(error)
                        });
                      })
    
                        let expiresIn = `${config.default.siteSetting.session.value} ${config.default.siteSetting.session.unit}`;
                        SiteSetting.findOne({})
                            .then(setting => {
                                if(setting) {
                                    expiresIn = `${setting.session.value} ${setting.session.unit}`;
                                }
                                let token = user.generateJWT(user, expiresIn);
                                log.logSuccess(req, 'success', user._id);
                                log.save();
                                res.status(200).json({
                                    success: true,
                                    status: 200,
                                    data: { token },
                                    message: "Success!"
                                });
                            })

                }
             

        
        })
        .catch(err => {
            log.logFailed(req, 'user does not found');
            log.save();
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: "User does not found"
            });
        });
};

/**
 * Load table data using Datatable library
 * Get users who have same and greater role level number
 */
exports.table = (req,res, next) => {

    const table = new datatable(req.body.datatable);
    const custom_query = [
        {
            $lookup: {
                from: 'role',
                foreignField: '_id',
                localField: 'roleID',
                as: 'role'
            }
        },
        { $unwind: '$role' },
        { 
            $match: {
                'role.level' : { $gt: -1 }
            }
        },
        { $project: { password: 0 }}
    ];

    if(req.body.filter) {
        let filter = new tableFilter(req.body.filter);
        if(filter.get_match()) {
            custom_query.push({$match: filter.get_match()});
        }
    }

    table.set_custom_query(custom_query);
    let pipeline = table.generate_pipeline();

    User.aggregate(pipeline)
        .then(user => {
            res.status(200).json({
                success: true,
                status: 200,
                data: table.result(user),
                message: ""
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
        });
};

/**
 * Create a User 
 */
exports.create = async (req, res, next) => {
    const user = new User();
    await user.assignData(req.body);
    user.isActive = true;
    user.isPending = false;
    user.save()
        .then(() => {
            res.status(200).json({
                success: true,
                status: 200,
                data: user.toJSON(),
                message: "Success"
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
        })
};

/**
 * Register user
 * Save user with inactive status then send
 * confirmation email contains temporary token to activate
 */
exports.register = async (req, res) => {
    const user = new User();
    await user.assignData(req.body);
    user.save()
        .then(() => {
            let temporary_token = user.generateTemporaryJWT();
            const mailer = new mail();
            const template = mailer.read_html_file(appDir + '/public/emails/confirmEmail.html');
            const emailData = {
                url: `${config.frontEnd.baseUrl}/activate/${temporary_token}`
            };
            mailer.set_receivers(user.email);
            mailer.set_subject('Account Activation');
            mailer.set_html_content(emailData, template);
            mailer.send((err, info) => {
                if(err) {
                    res.status(400).json({
                        success: false,
                        status: 400,
                        data: err,
                        message: err.message
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        status: 200,
                        data: user.toJSON(),
                        message: "Success"
                    });
                }
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
        })
};

/**
 * Update User
 * If user change password it will encrypt the password
 */
exports.update = (req, res, next) => {
    if(req.body.password) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
           req.body.password = hash;
            User.findByIdAndUpdate(
                mongoose.Types.ObjectId(req.body._id),
                req.body,
                { omitUndefined:true,  runValidators: true, context: 'query' })
                .then((user) => {
                    res.status(200).json({
                        success: true,
                        status: 200,
                        data: req.body,
                        message: "Success"
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        success: false,
                        status: 400,
                        data: err,
                        message: err.message
                    });
                });
        });
    } else {
        User.findByIdAndUpdate(
            mongoose.Types.ObjectId(req.body._id),
            req.body,
            { omitUndefined: true, runValidators: true, context: 'query' })
            .then((user) => {
                res.status(200).json({
                    success: true,
                    status: 200,
                    data: req.body,
                    message: "Success"
                });
            })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    status: 400,
                    data: err,
                    message: err.message
                });
            });
    }
};

/**
 * Update my profile
 * If user change password it will encrypt the password
 */
exports.update_my_profile = (req, res, next) => {
    if(req.body.password) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            req.body.password = hash;

            User.findByIdAndUpdate(
                mongoose.Types.ObjectId(req.user.userID),
                req.body,
                { omitUndefined:true,  runValidators: true, context: 'query' })
                .then((user) => {
                    res.status(200).json({
                        success: true,
                        status: 200,
                        data: req.body,
                        message: "Success"
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        success: false,
                        status: 400,
                        data: err,
                        message: err.message
                    });
                });
        });
    } else {
        User.findByIdAndUpdate(
            mongoose.Types.ObjectId(req.user.userID),
            req.body,
            {omitUndefined: true, runValidators: true, context: 'query'})
            .then((user) => {
                res.status(200).json({
                    success: true,
                    status: 200,
                    data: req.body,
                    message: "Success"
                });
            })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    status: 400,
                    data: err,
                    message: err.message
                });
            });
    }
};

/**
 * Reset Password for user who doesn't remember login password
 */
exports.reset_password = (req, res) => {
    User.findOne({ _id :req.user.userID })
        .then(user => {
            if(!user) {
                res.status(400).json({
                    success: false,
                    status: 400,
                    data: null,
                    message: "User not found"
                });
            }
            bcrypt.hash(req.body.password, 10, (error, hash) => {
                if(error) {
                    res.status(400).json({
                        success: false,
                        status: 400,
                        data: error,
                        message: error.message
                    });
                } else {
                    User.updateOne(
                        {_id : mongoose.Types.ObjectId(req.user.userID)},
                        {$set : {password : hash}})
                        .then(()=> {
                            res.status(200).json({
                                success: true,
                                status: 200,
                                data: user.toJSON(),
                                message: "Success"
                            });
                        })
                        .catch(err => {
                            res.status(400).json({
                                success: false,
                                status: 400,
                                data: err,
                                message: err.message
                            });
                        })
                }
            })
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
        });
};

/**
 * Load my profile 
 */
exports.my_profile = (req, res, next) => {
    User.findById(mongoose.Types.ObjectId(req.user.userID))
        .then(user => {
            res.status(200).json({
                success: true,
                status: 200,
                data: user,
                message: "Success"
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'User not found'
            });
        })
};

/**
 * Find user by id 
 */
exports.detail_by_id = (req, res, next) => {
    User.findById(mongoose.Types.ObjectId(req.params.userID))
        .then(user => {
            res.status(200).json({
                success: true,
                status: 200,
                data: user,
                message: "Success"
            });
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'User not found'
            });
        })
};

/**
 * Get role and permission detail of currently logged in user.
 */
exports.current_user_permission = (req, res) => {
    User.findById(mongoose.Types.ObjectId(req.user.userID))
        .populate('roleID')
        .then(user => {
            res.status(200).json({
                success: true,
                status: 200,
                data: user.roleID,
                message: "Success"
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
        })
};

/**
 * Activate user account from link that sent after registration
 */
exports.activate_account = (req, res) => {
    let update_query = { isActive: true, isPending: false };
    User.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.user.userID),update_query)
        .then(user => {
            res.status(200).json({
                success: true,
                status: 200,
                data: user,
                message: "Success"
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
        })
};

/**
 * Resend activation email
 */
exports.resend_activation_email = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                res.status(400).json({
                    success: false,
                    status: 400,
                    data: err,
                    message: 'User not found'
                });
            } else {
                const email = new mail();
                const temporary_token = user.generateTemporaryJWT();
                const template = email.read_html_file(appDir + '/public/emails/confirmEmail.html');
                const emailData = {
                    url: `${config.frontEnd.baseUrl}/activate/${temporary_token}`
                };
                email.set_receivers(user.email);
                email.set_subject('Account Activation');
                email.set_html_content(emailData, template);
                email.send((err, info) => {
                    if(err) {
                        res.status(400).json({
                            success: false,
                            status: 400,
                            data: err,
                            message: err.message
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            status: 200,
                            data: user.toJSON(),
                            message: "Success"
                        });
                    }
                });
            }
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
        })
};

/**
 * Update user image
 */
exports.update_image = (req, res) => {
    let destination_path = appDir + config.upload.images;
    let file_name = req.user.userID;
    base64img.img(req.body.image, destination_path, file_name, function (err, filepath){
       if(err) {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
       } else {
            const update_query = {
                image: filepath.replace(appDir+'/public', config.server),
                useImage: true
            };
            User.findOneAndUpdate(
                {_id: mongoose.Types.ObjectId(req.user.userID)},
                {$set: update_query}
            )
                .exec()
                .then(user => {
                    user.image = update_query.image;
                    user.useImage = true;
                    res.status(200).json({
                        success: true,
                        status: 200,
                        data: user,
                        message: "Success"
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        success: false,
                        status: 400,
                        data: err,
                        message: err.message
                    });
                });
       }
    });
};

/**
 * Send forgot password email
 * with temporary jwt token
 */
exports.send_forgot_password_mail = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
                const email = new mail();
                const temporary_token = user.generateTemporaryJWT();
                const template = email.read_html_file(appDir + '/public/emails/resetPassword.html');
                const emailData = {
                    url: `${config.frontEnd.baseUrl}/reset-password/${temporary_token}`
                };
                email.set_receivers(user.email);
                email.set_subject("Forgot Password");
                email.set_html_content(emailData, template);
                email.send((err, info) => {
                    if(err) {
                        res.status(400).json({
                            success: false,
                            status: 400,
                            data: err,
                            message: err.message
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            status: 200,
                            data: user.toJSON(),
                            message: "Success"
                        });
                    }
                });
            } else {
                res.status(400).json({
                    success: false,
                    status: 400,
                    data: null,
                    message: "User not found"
                });
            }
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
        })
};

/**
 * Load Users as options for selection purphose
 */
 exports.options = (req, res) => {
    User.find({
            isActive: true
           
        })
        .then(users => {
            users = users.map(user => {
               return {
                   text : user.username,
                   value : user._id
               }
            });
            res.status(200).json({
                success: true,
                status: 200,
                data: users,
                message: ""
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
        })
};
