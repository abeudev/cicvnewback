const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ColisSchema = new mongoose.Schema({
    name : String,
    description: String,
    departure_customer:String,// a transformer en cle etrangère
    arrival_customer:String,//a transformer en cle etrangère 
    //ajouter un champ de liason à transaction permettant d'avoir les date et lieu de depart et d'arrivé( cle etrangere)
    transaction_status:String,// à transformer en int ou bool pour les etape reçu, embarqué, ...
    track_number:String, // generer par UUID
    withdraw_code:String, // generer par UUID
    payment_status:String, //creer une autre table. Type de paiement à ajouter (cash, mobile money, autre)
    delivery:Boolean,// active les champs suivants qui sont facultatifs: lieu de livraison, date et heure de livraison
    delivery_place:String, // à mapper avec google MAPS
    delivery_date:Date,// à ajouter TIME heure
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
    this.departure_customer = colisData.departure_customer;
    this.arrival_customer = colisData.arrival_customer;
    this.transaction_status = colisData.transaction_status;
    this.track_number = colisData.track_number;
    this.withdraw_code = colisData.withdraw_code;
    this.payment_status = colisData.payment_status;
    this.delivery = colisData.delivery;
    this.delivery_place = colisData.delivery_place;
    this.delivery_date = colisData.delivery_date;
};

ColisSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name : this.name,
        description : this.description,
        departure_customer : this.departure_customer,
        transaction_status : this.transaction_status,
        track_number : this.track_number,
        withdraw_code : this.withdraw_code,
        payment_status : this.payment_status,
        delivery : this.delivery,
        delivery_place : this.delivery_place,
        delivery_date : this.delivery_date
    };
};

module.exports = mongoose.model('Colis', ColisSchema, 'colis');