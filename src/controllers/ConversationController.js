const mongoose = require('mongoose');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');

const config = require('../config');

const Conversation = require('../models/Conversation');


/**
 * Load table data using Datatable library
 * Get conversations who have same and greater role level number
 */
exports.table = (req,res, next) => {
    const table = new Datatable(req.body.datatable);
    if(req.body.filter) {
      const filter = new TableFilter(req.body.filter);
      if(filter.get_match()) {
        const custom_query = [{$match: filter.get_match()}];
        table.set_custom_query(custom_query);
      }
    }
    const pipeline = table.generate_pipeline();
    
    Conversation.aggregate(pipeline)
      .then(conversation => {
        res.status(200).json({
            success: true,
            status: 200,
            data: table.result(conversation),
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
 * Create a Conversation 
 */
exports.create = async (req, res, next) => {
    const conversation = new Conversation();
    await conversation.assignData(req.body);
    conversation.isActive = true;
    conversation.save()
        .then(() => {
            res.status(200).json({
                success: true,
                status: 200,
                data: conversation.toJSON(),
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
 * Update Conversation
 * 
 */
exports.update = (req, res, next) => {
    Conversation.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id),
        req.body,
        { omitUndefined: true, runValidators: true, context: 'query' })
        .then((conversation) => {
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
};

/**
 * Find conversation by id 
 */
exports.detail_by_id = (req, res, next) => {
    Conversation.findById(mongoose.Types.ObjectId(req.params.conversationID))
        .then(conversation => {
            res.status(200).json({
                success: true,
                status: 200,
                data: conversation,
                message: "Success"
            });
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'Conversation not found'
            });
        })
};

/**
 * Delete conversation and record from db
 * @param {*} req 
 * @param {*} res 
 */
 exports.delete_by_id = (req, res) => {
    Conversation.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.conversationID))
        .then(asset => {
          res.status(200).json({
              success: true,
              status: 200,
              data: asset,
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
