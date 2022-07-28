const mongoose = require("mongoose")

const uniqueValidator = require("mongoose-unique-validator")

//Indique à MangoDB le schéma sous lequel les informations vont être transmises.
//Lui permet de save les infos telles quelles.
const modelUser = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

//Vérifie que le schéma rempli est correct vis à vis de ce qui est attendu de la DB.
//Permet également de vérifier que l'identifiant de la personne ne correspondent à rien d'existant dans la DB.
//Si il y'a un élément existant possédant le même identifiant, il empêchera la création d'un nouveau compte sous ce même identifiant.
modelUser.plugin(uniqueValidator)

module.exports = mongoose.model("User", modelUser)
