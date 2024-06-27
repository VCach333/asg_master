const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Faq = new Schema({
    titulo: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    _date: {
        type: Date
    }
})

mongoose.model('faqs', Faq)