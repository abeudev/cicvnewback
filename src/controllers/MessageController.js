
const Message = require('../models/Message');

//new conv
exports.create = async (req, res, next) => {

          const newMessage = new Message(req.body);
          try {
            const savedMessage = await newMessage.save();
            res.status(200).json({
              success: true,
              status: 200,
              data: savedMessage,
              message: "Success"
          });
          } catch (err) {
            res.status(400).json({
              success: false,
              status: 400,
              data: err,
              message: err.message
          });
        }
};
//get conv of a user
exports.getMessageByConvId = async (req, res, next) => {
          try {
            const messages = await Message.find({
              conversationId: req.params.conversationId,
            });
            res.status(200).json({
              success: true,
              status: 200,
              data: messages,
              message: "Success"
          });
          } catch (err) {
            res.status(400).json({
              success: false,
              status: 400,
              data: err,
              message: err.message
          });
        }
};
