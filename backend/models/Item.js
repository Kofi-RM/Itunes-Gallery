const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const {Schema} = mongoose;

const itemSchema = new Schema({
kind: {type: String,
    required: true
},
artistId: {type: number},
collectionId: {type: number},
artistName: {type: String},
collectionName: {type: String},
collectionArtistName: {type: String},
trackName: {type: String},
previewUrl: {type: String}

})

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

module.exports = Item;