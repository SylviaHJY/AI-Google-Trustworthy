import {ratings} from '../config/mongoCollections.js';
import {getUserById,updateUser} from './users.js';
import {ObjectId} from 'mongodb';

const addRating = async (
  participantId, 
  userId,
  ratingOption, 
  questionNumber
) => {

  if(!participantId) throw 'You must provide a participantId';
  if(!userId) throw 'You must provide a userId';
  if(!ratingOption) throw 'You must provide a rating option';
  if(!['Correct', 'Incorrect', "I'm not sure"].includes(ratingOption)) throw 'Invalid rating option';

  const user = await getUserById(participantId);
  if(!user) throw 'No user with that id';
  userId = user._id.toString();

  const newRating = {
    participantId: participantId,
    userId: userId,
    ratingOption: ratingOption,
    questionNumber: questionNumber
  };

  const ratingsCollection = await ratings();
  const insertInfo = await ratingsCollection.insertOne(newRating);
  if (insertInfo.insertedCount === 0) throw 'Could not add ratings';
  const newId = insertInfo.insertedId.toString();

  await updateUser(participantId, newId);
  const Rating = await getRatingById(newId);
  return Rating;  
};

const getRatingById = async (ratingId) => {
  if (!ratingId) throw 'You must provide an id to search for';
  if (typeof ratingId !== 'string') throw 'Id must be a string';
  if (ratingId.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  ratingId = ratingId.trim();
  const ratingsCollection = await ratings();
  const rating =  await ratingsCollection.findOne({ _id: new ObjectId(ratingId) });
  if (rating === null) throw 'No rating with that id';
  return rating;
}

const GetAllUserRatings = async (participantId) => {
  if (!participantId) throw 'You must provide an id to search for';
  if (typeof participantId !== 'string') throw 'Id must be a string';
  if (participantId.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  participantId = participantId.trim();
  const thisUser = await userClass.getUserById(participantId);
  if (thisUser === null) throw 'No user with that id';

  let ratingsArray = thisUser.ratings;
  ratingsArray = Promise.all(ratingsArray.map(async (ratingId) => {
    return await getRatingById(ratingId);
  }));

  return ratingsArray;
}

export {addRating, getRatingById, GetAllUserRatings};