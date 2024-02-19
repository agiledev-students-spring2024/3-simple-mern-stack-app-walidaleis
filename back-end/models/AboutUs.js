const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
    text: { type: String, required: true },
    imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('AboutUs', aboutUsSchema);