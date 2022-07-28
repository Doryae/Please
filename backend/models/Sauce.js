const mongoose = require("mongoose")

//Indique à MangoDB le schéma sous lequel les informations vont être transmises.
//Lui permet de save les infos telles quelles.
const modelsSauce = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: [{ type: String }],
  usersDisliked: [{ type: String }],
})

module.exports = mongoose.model("Sauce", modelsSauce)
