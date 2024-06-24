const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Crono = new Schema({
    acao: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    num: {
        type: Number,
        required: true
    },
    date: {
        type: String
    },
    _date: {
        type: Date
    }
})

mongoose.model('cronos', Crono)