const jwt = require("jsonwebtoken")

//Permet de vérifier si la personne authentifiée posséde bien le token attribué à chaque connexion.
//Si elle n'est pas détentrice de ce token : Elle ne peut accèder au site.
//Permet d'éviter certains contournements.
//Le token est gardé "secret" grâce à un autre plugin installé et disponible sur App.js
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.KEY)
    const userId = decodedToken.userId
    req.auth = { userId }
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valable !"
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée !" })
  }
}
