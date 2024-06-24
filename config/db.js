if(process.env.PORT) {
    module.exports = {MongoURI: "mongodb+srv://VCach333:fibonacci@loja.hpnkm.mongodb.net/asg"}
} else {
    module.exports = {MongoURI: "mongodb://localhost/asg"}
}
