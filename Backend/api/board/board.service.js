import { ObjectId } from "mongodb";
import { getCollection } from "../../data/mongoDb.js";

export const boardService = {
  save,
  query,
  getById,
  remove,
};
async function query() {
  try {
    const boards = await getCollection("boards");
    const pipeline = [
      {
        $addFields: { id: "$_id" }, // Add a new field 'id' with the value of '_id'
      },
      {
        $project: { _id: 0 }, // Exclude the '_id' field from the results
      },
    ];
    const boardsArray = await boards.aggregate(pipeline).toArray();
    return boardsArray;
  } catch (err) {
    console.log("Couldn't find boards", err);
    throw err;
  }
}

async function save(boardToSave) {
  try {
    const boards = await getCollection("boards");
    if (boardToSave.id) {
      const { id, ...updateFields } = boardToSave;
      const result = await boards.updateOne(
        {
          _id: ObjectId.createFromHexString(id),
        },
        { $set: updateFields }
      );
      if (result.matchedCount === 0) {
        throw `Couldn't update bug with id ${id}`;
      }
    } else {
      await boards.insertOne(boardToSave);
    }
    boardToSave.id = boardToSave._id;
    delete boardToSave._id;
    return boardToSave;
  } catch (err) {
    console.log("Couldn't find bug", err);
    throw err;
  }
}

async function getById(boardId) {
  try {
    const cursor = await getCollection("boards");

    const board = await cursor.findOne({
      _id: ObjectId.createFromHexString(boardId),
    });
    if (!board) {
      throw `Couldn't find board ${boardId}`;
    }
    board.id = board._id;
    delete board._id;
    return board;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function remove(boardId, user) {
  try {
    const cursor = await getCollection("boards");

    const board = await cursor.findOne({
      _id: ObjectId.createFromHexString(boardId),
      members: {
        $elemMatch: {
          id: user.id,
          permissionStatus: "admin",
        },
      },
    });
    if (!board) {
      throw `Couldn't remove board with id ${boardId}`;
    } else {
      cursor.deleteOne({
        _id: ObjectId.createFromHexString(boardId),
      });
    }
  } catch (err) {
    console.log("Couldn't find board", err);
    throw err;
  }
}