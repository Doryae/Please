const passwordValidator = require("password-validator")

// Création d'un schéma de mot de passe
const securePassword = new passwordValidator()

securePassword
  .is()
  .min(6) // Taille minimale : 6
  .is()
  .max(15) // Taille maximale : 15
  .has()
  .uppercase() // Doit posséder au moins une Majuscule
  .has()
  .lowercase() // Doit posséder au moins une Minuscule
  .has()
  .digits() // Doit posséder au moins un Chiffre
  .has()
  .not()
  .spaces() // Ne peut pas contenir d'espace

  // Supprimer les possibilités d'utiliser ces mots de passes.
  .is()
  .not()
  .oneOf([
    "Passw0rd",
    "Password123",
    "Password1",
    "Password12",
    "Admin",
    "Admin123",
    "Admin1",
    "Admin12",
    "Azery123",
    "Abc123",
  ])

module.exports = (req, res, next) => {
  if (securePassword.validate(req.body.password)) {
    next()
  } else {
    return res
      .status(400)
      .json({
        error:
          "Le mot de passe à besoin d'une Majusucle, d'une minuscule, d'un chiffre & être compris entre 6 et 15 signes.",
      })
  }
}
