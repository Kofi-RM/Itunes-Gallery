const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const {Schema} = mongoose;

const bookmarkSchema = new Schema({
kind: {type: String,
    required: true
},
artistId: {type: Number},
collectionId: {type: Number},
artistName: {type: String},
collectionName: {type: String},
collectionArtistName: {type: String},
trackName: {type: String},
previewUrl: {type: String},
trackId: {type:Number},
artworkUrl100: {type:String},
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
},
  {timestamps:true})

const Bookmark = mongoose.models.Item || mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;