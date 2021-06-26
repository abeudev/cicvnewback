const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ColisTypeSchema = new mongoose.Schema({
    name : String,
    description: String,
    trackNumber: String,//uuid
    isActive : Boolean // ajouter le fournisseur(amazon, alibaba...)
}, {timestamps: true, versionKey : false});
/** 
ColisTypeSchema.plugin(uniqueValidator, { message: 'is already taken.' });
**/

/**
 * Assign data
 * @param {Object} ColisTypeData 
 */
ColisTypeSchema.methods.assignData = function (colisTypeData) {
    this.name = colisTypeData.name;
    this.trackNumber = colisTypeData.trackNumber;
    this.description = colisTypeData.description;
    this.isActive = true;
};

ColisTypeSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name : this.name,
        description : this.description,
        trackNumber: this.trackNumber,
        isActive : this.isActive
    };
};

module.exports = mongoose.model('ColisType', ColisTypeSchema, 'colisType');