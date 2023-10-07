const express = require('express')
const router = express.Router()
const questionCtrl = require("../controller/questionCtrl")

router.get("/", questionCtrl.viewQuestions)
router.get("/:id", questionCtrl.viewOneQuestion)
router.post("/", questionCtrl.addQuestion)
router.put("/:id", questionCtrl.updQuestion)
router.delete("/:id", questionCtrl.delQuestion)


module.exports = router