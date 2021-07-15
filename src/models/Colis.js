const mongoose = require('mongoose');
const { v4 : uuidv4 } = require('uuid');
const uniqueValidator = require('mongoose-unique-validator');

const ColisSchema = new mongoose.Schema({
    name : String,
    description: String,
    departure_customer_ID: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    arrival_customer_ID: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    transaction_ID: {
        type: mongoose.Schema.ObjectId,
        ref: "Transaction"
    },//ajouter un champ de liason à transaction permettant d'avoir les date et lieu de depart et d'arrivé( cle etrangere)
    transaction_status:String,// à transformer en int ou bool pour les etape reçu, embarqué, ...
    track_number:{ type: String,unique: true ,  required:[true, "track_number can't be blank"]}, // generer par UUID
    withdrawal_code:{ type: String,unique: true , required:[true, "withdrawal_code can't be blank"]}, // generer par UUID
    payment_status:String, //creer une autre table. Type de paiement à ajouter (cash, mobile money, autre)
    delivery:Boolean,// active les champs suivants qui sont facultatifs: lieu de livraison, date et heure de livraison
    delivery_place:{lat: String,
        lng: String,
        radius: String,}, // à mapper avec google MAPS
    delivery_date:Date,// à ajouter TIME heure
    delivery_startTime: String,
    delivery_endTime: String,
    isActive :Boolean,
    // ajouter image
}, {timestamps: true, versionKey : false});

ColisSchema.plugin(uniqueValidator, { message: 'is already taken.' });

/**
 * Assign data
 * @param {Object} ColisData 
 */
ColisSchema.methods.assignData = function (colisData) {
    this.name = colisData.name;
    this.description = colisData.description;
    this.departure_customer_ID = colisData.departure_customer_ID;
    this.arrival_customer_ID = colisData.arrival_customer_ID;
    this.transaction_ID =colisData.transaction_ID;
    this.transaction_status = colisData.transaction_status;
    this.track_number = colisData.track_number? colisData.track_number:uuidv4();
    this.withdrawal_code =colisData.withdrawal_code? colisData.withdrawal_code:uuidv4();
    this.payment_status = colisData.payment_status;
    this.delivery = colisData.delivery;
    this.delivery_place = (!this.delivery)? null : colisData.delivery_place || {
        lat: 35.6803997,
        lng: 139.7690174,
        radius: 2,
      };
    this.delivery_date = colisData.delivery_date;
    this.delivery_startTime= colisData.delivery_startTime;
    this.delivery_endTime= colisData.delivery_endTime;
    this.isActive = colisData.isActive;
};

ColisSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name : this.name,
        description : this.description,
        departure_customer_ID : this.departure_customer_ID,
        arrival_customer_ID: this.arrival_customer_ID,
        transaction_ID: this.transaction_ID,
        transaction_status : this.transaction_status,
        track_number : this.track_number,
        withdrawal_code : this.withdrawal_code,
        payment_status : this.payment_status,
        delivery : this.delivery,
        delivery_place : this.delivery_place,
        delivery_date : this.delivery_date,
        delivery_startTime: this.delivery_startTime,
        delivery_endTime: this.delivery_endTime,
        isActive : this.isActive
    };
};

module.exports = mongoose.model('Colis', ColisSchema, 'colis');