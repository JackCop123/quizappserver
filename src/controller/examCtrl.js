const Exams = require("../model/examModel");
const Questions = require("../model/questionModel")
const examCtrl = {
    viewExams: async (req, res) => {
        try {
            const exams = await Exams.find();
            res.status(200).send(exams)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Something went wrong..." })
        }
    },

    viewOneExams: async (req, res) => {
        const { id } = req.params;
        try {
            const {exam, questionsCount} = await Exams.findById(id);
            const questions = await Questions.aggregate([{ $sample: { size: questionsCount * 1 } }]);
            exam.questions = questions;
            if(exam) {
                return res.status(200).send(exam)
            }
            res.status(404).send({message: "Exam not found"})
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Something went wrong..." })
        }
    },

    addExam: async (req, res) => {
        const {examName, questionsCount, time, Category} = req.body;
        try {
            if(req.body.role = 101 || req.existingUser) {

                if(!examName || !time || !questionsCount || !Category ) {
                  return res.status(403).send({message: "Please fill all the fields"})
                }

                const examOld = await Exams.findOne({ examName })
                if(examOld) {
                    return res.status(400).send({message: `Exam name is ${examOld.examName} already exists`});
                }

                const examNew = new Exams(req.body)
                await examNew.save()
                res.status(200).send({message: "Exam created successfully", exam: examNew})
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: error.message })
        }
    },

    updExam: async (req, res) => {
        const { id } = req.params;
        const { examName } = req.body;
        try {
            if(req.body.role = 101 || req.existingUser) {
                const examOld = await Exams.findOne({ examName });
                if(examOld) {
                    return res.status(400).send({message: `Exam named is ${examOld.examName} already exists`});
                }
                const updateExam = await Exams.findByIdAndUpdate(id, req.body, { new: true });
                if(updateExam) {
                    res.status(400).send({message: "Exam not found"})
                }

                return res.status(200).send({message: "Exam update successfully", exam: updateExam})

            }


        } catch (error) {
            console.error(error);
            res.status(500).send({message: "Something went wrong"});
        }
    },

    delExam: async (req, res) => {
        const { id } = req.params;
        try {
            await Exams.findByIdAndDelete(id)
            res.status(200).send({ message: "Exam deleted successfully" })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Something went wrong..." })
        }
    }
}

module.exports = examCtrl