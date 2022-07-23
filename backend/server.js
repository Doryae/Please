const http = require("http")
const app = require("./app")

const normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

// Défini le port d'écoute sur 3000 (exemple : localhost:3000)
const port = normalizePort(process.env.PORT || "3000")
app.set("port", port)

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error
  }
  const address = server.address()
  //Si le type de valeur de la variable adress est strictement égale à un string, il va renvoyer l'adresse d'écoute.
  //Dans le cas contraire : il renverra juste "port" : suivi du port d'écoute (3000 ici)
  const bind = typeof address === "string" ? "pipe " + address : "port: " + port
  switch (error.code) {
    //Dans le cas où le niveau de privilège n'est pas suffisament élevé :
    case "EACCES":
      console.error(bind + " requires elevated privileges.")
      process.exit(1)
      break
    //Dans le cas où le port d'écoute est déjà utilisé par une autre instance :
    case "EADDRINUSE":
      console.error(bind + " is already in use.")
      process.exit(1)
      break
    default:
      throw error
  }
}

const server = http.createServer(app)

server.on("error", errorHandler)
server.on("listening", () => {
  const address = server.address()
  const bind = typeof address === "string" ? "pipe " + address : "port " + port
  console.log("Listening on " + bind)
})

server.listen(port)
