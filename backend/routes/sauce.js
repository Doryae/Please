const express = require("express")
const router = express.Router()

const sauceCtrl = require("../controllers/sauce")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

//Création d'une sauce
router.post("/", auth, multer, sauceCtrl.createSauce)

//Modification d'une sauce existante
router.put("/:id", auth, multer, sauceCtrl.modifySauce)

//Like/Dislike
router.post("/:id/like", auth, sauceCtrl.like)

//Suppression d'une sauce existante
router.delete("/:id", auth, sauceCtrl.deleteSauce)

//Renvoie une seule sauce (via son ID)
router.get("/:id", auth, sauceCtrl.getOneSauce)

//Renvoie toutes les sauces stockées de la DB
router.get("/", auth, sauceCtrl.getAllSauces)

module.exports = router
