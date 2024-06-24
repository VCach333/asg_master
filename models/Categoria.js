const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Categoria = new Schema({
    titulo: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    _date: {
        type: Date,
        required: true
    }
})

mongoose.model('cats', Categoria)