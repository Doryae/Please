//Plugin pour l'upload d'image sur le site.
const multer = require("multer")

//Défini les extensions pouvant être rencontrées et la manière dont elles doivent être renommées.
//Permet d'éviter certains types de fichiers ET d'avoir une uniformité dans le nom des extensions d'images sur le site.
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
}

//Indique où sont stockées les images (ici, dans le dossier appellé images)
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images")
  },
  //Renomme le nom du fichier afin d'être certains d'avoir des noms UNIQUES pour chacunes des images uploadées.
  //Permet donc de créer un nom de fichier comme suit :
  // NomDuFichierOriginal_DateUploadée.extension => exemple : Image01_01/01/2023.jpg.
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_")
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + Date.now() + "." + extension)
  },
})

module.exports = multer({ storage: storage }).single("image")
