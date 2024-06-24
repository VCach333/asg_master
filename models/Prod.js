const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Prod = new Schema({
    foto: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    cores: {
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

mongoose.model('prods', Prod)