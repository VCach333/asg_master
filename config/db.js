if(process.env.PORT) {
    module.exports = {MongoURI: "mongodb+srv://VCach333:j!b$yTj#6B$9aeS@blogdio.2cysr.mongodb.net/blogdio"}
} else {
    module.exports = {MongoURI: "mongodb://localhost/asg"}
}