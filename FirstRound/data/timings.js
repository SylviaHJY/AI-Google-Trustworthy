import { timings } from '../config/mongoCollections.js';

const addTiming = async (participantId, questionNumber, elapsedTime) => {
  const timingsCollection = await timings();
  const newTiming = {
    participantId,
    questionNumber,
    elapsedTime
  };
  const insertInfo = await timingsCollection.insertOne(newTiming);
  if (insertInfo.insertedCount === 0) throw 'Could not add timing';
  return newTiming;
};

export { addTiming };