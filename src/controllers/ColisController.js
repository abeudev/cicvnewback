const mongoose = require('mongoose');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');

const config = require('../config');

const Colis = require('../models/Colis');


/**
 * Load table data using Datatable library
 * Get coliss who have same and greater role level number
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
    
    Colis.aggregate(pipeline)
      .then(colis => {
        res.status(200).json({
            success: true,
            status: 200,
            data: table.result(colis),
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
 * Create a Colis 
 */
exports.create = async (req, res, next) => {
    const colis = new Colis();
    await colis.assignData(req.body);
    colis.isActive = true;
    colis.save()
        .then(() => {
            res.status(200).json({
                success: true,
                status: 200,
                data: colis.toJSON(),
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
 * Update Colis
 * 
 */
exports.update = (req, res, next) => {
    Colis.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id),
        req.body,
        { omitUndefined: true, runValidators: true, context: 'query' })
        .then((colis) => {
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
 * Find colis by id 
 */
exports.detail_by_id = (req, res, next) => {
    Colis.findById(mongoose.Types.ObjectId(req.params.colisID))
        .then(colis => {
            res.status(200).json({
                success: true,
                status: 200,
                data: colis,
                message: "Success"
            });
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'Colis not found'
            });
        })
};

/**
 * Delete colis and record from db
 * @param {*} req 
 * @param {*} res 
 */
 exports.delete_by_id = (req, res) => {
    Colis.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.colisID))
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
