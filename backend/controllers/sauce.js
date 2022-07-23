const Sauce = require("../models/Sauce")
const fileSystem = require("fs")

//Controller pour la création de sauce.
exports.createSauce = (req, res) => {
  // Récupère les données du questionnaire de création de sauce sous forme JSON (tout les inputs utilisateur.)
  const sauceObject = JSON.parse(req.body.sauce)
  // Supprime l'ID attribué par la requête(l'ID de l'user) : MongoDB se chargera de créer l'ID propre à la sauce.
  delete sauceObject._id
  // Initialise la sauce dans la DB en suivant le model importé de Sauce (../models/Sauce.js)
  const sauce = new Sauce({
    // Récupère toute les données passées en JSON grâce au paramètre REST ( => ... )
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  })
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregristré !" }))
    .catch((error) =>
      res.status(400).json({ message: "Oh non, ça ne fonctionne pas !" })
    )
}

//Controller pour la modification d'une sauce DEJA existante.
exports.modifySauce = (req, res) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }))
}

//Controller pour supprimer une sauce
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1]
    if (!sauce) {
      return res.status(404).json({
        error: new Error("Objet non trouvé !"),
      })
    }
    if (sauce.userId !== req.auth.userId) {
      return res.status(401).json({
        error: new Error("Requête non autorisée !"),
      })
    }
    fileSystem.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Object supprimé !" }))
        .catch((error) => res.status(400).json({ error }))
    })
  })
}

exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }))
}

exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }))
}

exports.like = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //On utilise des FUO : Field Update Operators pour update dans la base de données MongoDB. tels que : $push, $inc, $pull.
      //On vérifie que l'utilisateur ne soit enregistré dans aucun des tableaux like ou dislike avant de procéder.

      if (
        !sauce.usersLiked.includes(req.body.userId) &&
        !sauce.usersDisliked.includes(req.body.userId)
      ) {
        if (req.body.like === 1) {
          //Si l'user Like, on l'ajoute au tableau "usersLiked" et on incrémente le nombre de likes

          Sauce.updateOne(
            { _id: req.params.id },
            {
              $push: { usersLiked: req.body.userId },
              $inc: { likes: req.body.like++ },
            }
          )
            .then((sauce) =>
              res.status(200).json({ message: "Vous avez liker cette sauce." })
            )
            .catch((error) => res.status(400).json({ error }))
        } else if (req.body.like === -1) {
          //Si l'user Dislike, on l'ajoute au tableau "usersDisliked" et on incrémente le nombre de dislikes

          Sauce.updateOne(
            { _id: req.params.id },
            {
              $push: { usersDisliked: req.body.userId },
              $inc: { dislikes: req.body.like++ * -1 },
            }
          )
            .then((sauce) =>
              res
                .status(200)
                .json({ message: "Vous avez disliker cette sauce." })
            )
            .catch((error) => res.status(400).json({ error }))
        }
      } else {
        console.log(req.body)
        // Dans le cas contraire où il se trouverait dans l'un des tableau, on le retire de celui-ci et on décrémente le nombre de likes/dislikes

        if (sauce.usersLiked.includes(req.body.userId)) {
          // Si il est dans le tableau Like
          console.log(req.body)
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
          )
            .then((sauce) =>
              res
                .status(200)
                .json({ message: "Vous avez arrêter de liker cette sauce." })
            )
            .catch((error) => res.status(400).json({ error }))

          if (req.body.like === -1) {
            //Si l'user Dislike, on l'ajoute au tableau "usersDisliked" et on incrémente le nombre de dislikes

            Sauce.updateOne(
              { _id: req.params.id },
              {
                $push: { usersDisliked: req.body.userId },
                $inc: { dislikes: req.body.like++ * -1 },
              }
            )
              .then((sauce) =>
                res
                  .status(200)
                  .json({ message: "Vous avez disliker cette sauce." })
              )
              .catch((error) => res.status(400).json({ error }))
          }
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          // Si il est dans le tableau Dislike

          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) =>
              res
                .status(200)
                .json({ message: "Vous avez arrêter de disliker cette sauce." })
            )
            .catch((error) => res.status(400).json({ error }))

          if (req.body.like === 1) {
            //Si l'user Like, on l'ajoute au tableau "usersLiked" et on incrémente le nombre de likes

            Sauce.updateOne(
              { _id: req.params.id },
              {
                $push: { usersLiked: req.body.userId },
                $inc: { likes: req.body.like++ },
              }
            )
              .then((sauce) =>
                res
                  .status(200)
                  .json({ message: "Vous avez liker cette sauce." })
              )
              .catch((error) => res.status(400).json({ error }))
          }
        }
      }
    })
    .catch((error) => res.status(400).json({ error }))
}
