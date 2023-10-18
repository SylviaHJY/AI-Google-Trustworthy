import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const getUserById = async (participantId) => {
  if (!participantId) throw 'You must provide an id to search for';
  
  if (typeof participantId === 'string') {
    if (participantId.trim().length === 0)
      throw 'Id cannot be an empty string or just spaces';
    participantId = participantId.trim();
    participantId = parseInt(participantId);
  }

  //console.log(participantId);
  
  const usersCollection = await users();
  const user =  await usersCollection.findOne({ participantId: participantId });
  if (user === null) return null;
  return user;
}


const getAllUsers = async () => {
  const usersCollection = await users();
  const allUsers = await usersCollection.find({}).toArray();
  if (allUsers.length === 0) throw 'No users in system';
  for (let i = 0; i < allUsers.length; i++) {
    allUsers[i]._id = allUsers[i]._id.toString();
  }
  return allUsers;
}

const updateUser = async (
  participantId,
  ratingId
  ) => {
  if (!participantId) throw 'You must provide an id to search for';
  if(!ratingId) throw 'You must provide a ratingId';
  const usersCollection = await users();
  const updateUser = await usersCollection.updateOne(
    { participantId: participantId },
    { $push: { ratings: ratingId } }
  );
  if (updateUser.modifiedCount === 0) {
    throw 'could not update user successfully';
  }
  return await getUserById(participantId);
}

const removeUser = async (id) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  const usersCollection = await users();
  const user = await getUserById(id);
  const deletionInfo = await usersCollection.removeOne({_id: new ObjectId(id)});
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete user with id of ${id}`;
  }
  return `${user.participantId} has been successfully deleted`;
}


export {getUserById, getAllUsers, updateUser, removeUser};

