import { Router } from "express";
const router = Router();
import { ratingsData, usersData, answersData, timingsData } from "../data/index.js";

router
  .route("/addRating")
  .get((req, res) => {
    res.render('addRating', {
      isSubmitted: false,  
      error: null 
    });
  })
  .post(async (req, res) => {
    try {
      if(!req.session.user){
        const error = 'You have to login to play!';
        return res.render('../views/partials/addRating', { error: error, isSubmitted: false });
      }
      const participantId = req.session.user.participantId;
      const userId = req.session.user._id;
      const ratingOption = req.body.ratingOption; 
      const questionNumber = parseInt(req.body.questionNumber);

      if(!participantId) throw 'You must provide a participantId';
      if(!userId) throw 'You must provide a userId';
      if(!ratingOption) throw 'You must provide a rating option';
      if(!['Correct', 'Incorrect', "I'm not sure"].includes(ratingOption)) throw 'Invalid rating option';
      
      console.log(participantId);
      console.log(ratingOption); 
      console.log(questionNumber);

      // add timing
      const elapsedTime = parseFloat(req.body.elapsedTime);
      if(!isNaN(elapsedTime)){
        await timingsData.addTiming(participantId, questionNumber, elapsedTime);
      }

      const rating = await ratingsData.addRating(
        participantId, userId, ratingOption, questionNumber);  
      let ratingId = rating._id.toString();
      // update user
      await usersData.updateUser(participantId, ratingId);
      // get the next question
      const answer = await answersData.getAnswersByNumber(questionNumber + 1);
      if(answer){
        res.redirect(`/answers/number/${questionNumber + 1}`);
      }else{
        res.render('../views/LastPage');
      }
    } catch (error) {
      console.error(error.stack);
      return res.status(500).render('../views/partials/addRating', { error: error.toString(), isSubmitted: false });
    }    
  });

export default router;

