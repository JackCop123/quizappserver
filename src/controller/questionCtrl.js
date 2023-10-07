const Questions = require("../model/questionModel")
const Categories = require("../model/categoryModel");
const mongoose = require('mongoose')
const questionCtrl = {
    viewQuestions: async (req, res) => {
        try {
            const questions = await Questions.find()
            res.status(200).send(questions)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Something went wrong..." })
        }
    },
    viewOneQuestion: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Categories.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                {
                    $lookup:
                    {
                        from: "questions",
                        localField: "_id",
                        foreignField: "category",
                        as: "questions"

                    }
                }
            ]);

            if (!category) return res.status(404).send({ message: "Question not found" })
            res.status(200).send(category)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Something went wrong..." })
        }
    },
    addQuestion: async (req, res) => {
        try {
            const { questionName } = req.body;
            const isExists = await Questions.findOne({ questionName })
            if (isExists) return res.status(402).send({ message: "This question already exists!" })
            const newQuestion = await Questions.create(
                req.body
            )
            const category = await Questions.findOne({ _id: newQuestion.question })
            if (!category) return res.status(404).send({ message: "Category not found" })
            await Categories.findOneAndUpdate({ _id: newQuestion.category }, { $push: { questions: newQuestion } })
            res.status(201).send({ message: "Question created successfully", newQuestion })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Something went wrong" })
        }
    },

    updQuestion: async (req, res) => {
        const { id } = req.params;
        try {
            const updateQuestion = await Questions.findByIdAndUpdate(id, req.body, {new: true})
            if(updateQuestion) {
                return res.status(200).send({message: "Update question successfully"})
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({message: "Sometging went wrong"})
        }
    },

    delQuestion: async (req, res) => {
        const { id } = req.params;
        try {
            const categoryOne = await Categories.find();
            const category = await Categories.findOne({ _id: { $in: categoryOne } })
            console.log(category)
            const deleteQuestion = category.questions
            if (deleteQuestion == id) {
                await Categories.updateOne(
                    { _id: category._id },
                    { $pull: { questions: id } }
                )
            } else {
                res.status(403).send({ message: "Category don't have this question" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Something went wrong..." })
        }
    },

}

module.exports = questionCtrl
