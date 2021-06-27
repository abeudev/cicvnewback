const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
    name : String,
    description: String,
    location:String,
    image: String,
    //attribuer un agent à un entrepôt [agent 1, agent 2, ...]

}, {timestamps: true, versionKey : false});


/**
 * Assign data
 * @param {Object} WarehouseData 
 */
WarehouseSchema.methods.assignData = function (warehouseData) {
    this.name = warehouseData.name;
    this.description = warehouseData.description;
    this.location = warehouseData.location;
    this.image = warehouseData.image;
};

WarehouseSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name : this.name,
        description : this.description,
        location : this.location,
        image: this.image
    };
};

module.exports = mongoose.model('Warehouse', WarehouseSchema, 'warehouse');