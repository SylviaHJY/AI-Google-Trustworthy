import { Router } from "express";
const router = Router();
import { usersData} from "../data/index.js";
import { answersData } from "../data/index.js";

router
  .route("/")
  router
  .route("/")
  .get(async (req, res) => {
    try {
      if(req.session.user){
        const answer = await answersData.getAnswersByNumber(1);  // Fetch the first question if user is logged in
        if(answer){
          res.redirect('/answers/number/1');  // Redirect to the first question
        } else {
          res.render('../views/login', { error: 'No question available' });  // Render an error page if no question is available
        }
      } else {
        res.render('../views/login', {error: req.query.error });  // Render the login page if user is not logged in
      }
    } catch(e) {
      res.status(500).json({error: e});
      console.log(e);
    }
  })
  .post(async (req, res) => {
    if(req.session.user){
      res.redirect('/answers/number/1');  // 用户已登录，重定向到 /answers/number/1
    } else {
      const participantId = req.body.ParticipantId;  
      console.log(participantId);
      const parsedParticipantId = parseInt(participantId);
      try{
        const user = await usersData.getUserById(parsedParticipantId);
        if(user){
          req.session.user = {participantId: parsedParticipantId, _id: user._id};
          res.redirect('/answers/number/1');  
        } else {
           res.redirect('/login?error=Participant ID not found');  
           console.log('Participant ID not found');
        }      
      } catch(e){
        res.status(500).json({error: e});
        console.log(e);
      }
    }
});

export default router;

