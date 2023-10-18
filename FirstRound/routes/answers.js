import { Router } from "express";
const router = Router();
import { answersData } from "../data/index.js";

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const answer = await answersData.getAnswersById(req.params.id);
      if (answer) {
        res.render('../views/questionPage', {
          question: answer.question,
          chatgptAnswer: answer.chatgptAnswer,
          questionNumber: answer.questionNumber
        });
      } else {
        return res.status(404).send("Answer not found");
      }
    } catch (error) {
     res.status(500).send(error);
     console.log(error);
    }
  }
);

router
  .route("/")
  .get(async (req, res) => {
    try {
      const answersList = await answersData.getAllAnswers();
      res.json(answersList);
    } catch (error) {
      res.status(500).send(error);
      console.log(error);
    }
  }
);

router
  .route("/number/:num")
  .get(async (req, res) => {
    try {
      let num = parseInt(req.params.num);
      if (isNaN(num)) {
        return res.status(400).send("Invalid number parameter");
      }
      const answer = await answersData.getAnswersByNumber(num);
      if (answer) {
        res.render('../views/questionPage', {
          question: answer.question,
          chatgptAnswer: answer.chatgptAnswer,
          questionNumber: answer.Number
        });
      } else {
        res.render('../views/LastPage');
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.log(error);
    }
  }
);

export default router;
