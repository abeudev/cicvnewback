const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
      },
      sender: {
        type: String,
      },
      text: {
        type: String,
      },

}, {timestamps: true, versionKey : false});


/**
 * Assign data
 * @param {Object} MessageData 
 */
MessageSchema.methods.assignData = function (messageData) {
    this.conversationId = messageData.conversationId;
    this.sender = messageData.sender;
    this.text = messageData.text;
};

MessageSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        conversationId : this.conversationId,
        sender : this.sender,
        text : this.text
    };
};

module.exports = mongoose.model('Message', MessageSchema, 'message');