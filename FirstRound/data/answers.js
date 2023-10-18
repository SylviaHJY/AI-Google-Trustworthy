import {answers} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const getAnswersById = async (id) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  const answersCollection = await answers();
  const answer =  await answersCollection.findOne({_id: new ObjectId(id)});
  if (answer === null) throw 'No answer with that id';
  answer._id = answer._id.toString();
  return answer;
}

const getAnswersByNumber = async (Number) => {
  if (!Number) throw 'You must provide a Number to search for';
  if(typeof Number === 'string') {
    if (Number.trim().length === 0)
      throw 'Number cannot be an empty string or just spaces';
    Number = Number.trim();
    Number = parseInt(Number);
  }

  const answersCollection = await answers();
  const answer =  await answersCollection.findOne({Number: Number});

  if (!answer) return null;  // Return null when no answer is found
  answer._id = answer._id.toString();
  return answer;
}

const getAllAnswers = async () => {
  const answersCollection = await answers();
  const allAnswers = await answersCollection.find({}).toArray();
  for (let i = 0; i < allAnswers.length; i++) {
    allAnswers[i]._id = allAnswers[i]._id.toString();
  }
  if (!allAnswers) {
    allAnswers = [];
  }
  return allAnswers;
}

const getTheNextAnswer = async (currentQuestionId) => {
  const answersCollection = await answers();
  // Find the question with an ID greater than the current question's ID
  const nextQuestion = await answersCollection.findOne({
     _id: { $gt: currentQuestionId } 
  });

  // If there's no next question, return null
  if (!nextQuestion) {
    return null;
  }

  // Otherwise, return the next question
  return nextQuestion;
};

const removeAnswer = async (id) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  const answersCollection = await answers();
  const answer = await getAnswersById(id);
  const deletionInfo = await answersCollection.removeOne({_id: new ObjectId(id)});
  if (deletionInfo.deletedCount === 0) throw `Could not delete answer with id of ${id}`;
  return answer.googleResultTitle + ' has been successfully deleted';
};

export {
  getAnswersById, 
  getAllAnswers, 
  removeAnswer, 
  getTheNextAnswer,
  getAnswersByNumber
};