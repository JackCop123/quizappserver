const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    questionName: {type: String, required: true},

    variantOne: {type: String, required: true},
    variantTwo: {type: String, required: true},
    variantThree: {type: String, required: true},
    rightVariant: {type: String, required: true},
    
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
})
module.exports = mongoose.model("Question", QuestionSchema)