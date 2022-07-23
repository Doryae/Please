const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const User = require("../models/User")

// Gère l'inscription des membres.
exports.signup = (req, res) => {
  bcrypt
    //le 10 équivaut à "la puissance" du hashage. Plus le nombre est grand, plus de ressources sont consommées.
    .hash(req.body.password, 10)
    //hash le MDP avec bcrypt
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      })
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

// Gère la connexion des membres.
exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      //Si l'utilisateur n'est pas enregistré / n'existe pas.
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non reconnu." })
      }
      // Comparaison des hash pour vérifier qu'il s'agit du bon MDP
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si la comparaison n'existe pas dans la base de donnée renvois une erreur.
          if (!valid) {
            return res.status(401).json({ error })
          }
          //Attribue un token (via JsonWebToken) à l'utilisateur qui se connecte.
          //le token expire toutes les 24h.
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.KEY, {
              expiresIn: "24h",
            }),
          })
        })
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}
