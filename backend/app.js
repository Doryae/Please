//Ce qui est requis.
const express = require("express")
const mongoose = require("mongoose")
// Permet de définir un "chemin" pour le dossier images.
const path = require("path")

const sauceRoutes = require("./routes/sauce")
const userRoutes = require("./routes/user")

const app = express()

//Partie protection :
//DotEnv : Masque les informations grâce à des variables d'environnements.
require("dotenv").config()
//Helmet : Sécurise les réponses HTTP pour protéger l'application / site web contre certaines failles connues du web.
// Protège contre : attaque Cross-Site Scripting (XSS), attaque par injections, détounrnement de clic (vise à tromper l'utilisateur sur l'élément cliqué. Permettant de "l'arnaquer" / obtenir des données à son insu, etc...)
// Ainsi que contre les attaques ciblées contre les serveurs Express en désactivant le "X-Powered-By" dans le header.
const helmet = require("helmet")
//HPP : Protège contre les dénis de services (DOS) en empêchant le spam d'attaques HTTP
const hpp = require("hpp")
//Express Rate Limit: Permet de limiter le nombre de requêtes sur une durée déterminée émanant d'une adresse IP
//Cela permet d'éviter le DDOS ou le DOS en "forçant" le service à crash par un abus de requête qu'il ne pourra pas supporter.
const rateLimit = require("express-rate-limit")

//Connexion à la DB mongoDB.
mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MangoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"))

app.use(express.json())

app.use(hpp())
app.use("/images", express.static(path.join(__dirname, "images")))
app.use(helmet())

//Authorise les accès de toutes les origines (port de connexion), certains en-tête, et les verbes-serveur qui seront utilisables.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // Autorise les requêtes de toutes "origines". (localhost, url, etc...)
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization" //Seulement ces headers sont autorisés.
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS" //Ces verbes sont les seuls autorisés.
  )
  next()
})

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //Equivaut à 10 minutes.
  max: 100, //100 requête par IP par tranche de 10 minutes. 10 requêtes / min.
})

//Défini le dossier "images" pour enregistrer toutes les images uploadées par les user

app.use(limiter)

//Défini les routes
app.use("/api/sauces", sauceRoutes)
app.use("/api/auth", userRoutes)

module.exports = app
