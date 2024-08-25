import { boardService } from "../services/board.service.local";
import { utilService } from "../services/util.service";
import { workspaceService } from "../services/workspace.service";
import { setBoard } from "./board.actions";
import { store } from "./store";
import {
  EDIT_WORKSPACE,
  SET_BOARDS,
  ADD_BOARD,
  VIEW_BOARD,
} from "./workspace.reducer";
import { SET_BOARD } from "./board.reducer";

export async function setBoards() {
  const boards = await workspaceService.getAllBoards();
  store.dispatch({ type: SET_BOARDS, boards });
}

export async function viewWorkspaceBoard(boardId) {
  const boards = await workspaceService.getAllBoards();
  const board = boards.find((b) => b.id === boardId);
  store.dispatch({ type: VIEW_BOARD, boardId: board.id });
}
export async function editWorkspaceBoard(board) {
  store.dispatch({ type: EDIT_WORKSPACE, board: board });
  await boardService.save(board);
}

// export async function moveCard({
//   targetBoardId,
//   targetGroupId,
//   targetPos,
//   task,
//   user,
// }) {
//   try {
//     const newTask = {
//       ...task,
//       idBoard: targetBoardId,
//       idGroup: targetGroupId,
//       pos:
//         targetGroupId === task.idGroup && targetPos > task.pos
//           ? targetPos + 12111
//           : targetPos - 12111,
//     };
//     const boards = await workspaceService.getAllBoards();
//     const sourceBoard = boards.find((b) => b.id === task.idBoard);

//     const updatedSourceBoard = {
//       ...sourceBoard,
//       groups: sourceBoard.groups.map((g) =>
//         g.id === task.idGroup
//           ? { ...g, tasks: g.tasks.filter((t) => t.id !== task.id) }
//           : g
//       ),
//     };

//     const targetBoard =
//       task.idBoard === targetBoardId
//         ? updatedSourceBoard
//         : boards.find((b) => b.id === targetBoardId);

//     const updatedTargetBoard = {
//       ...targetBoard,
//       groups: targetBoard.groups.map((g) =>
//         g.id === targetGroupId
//           ? {
//               ...g,
//               tasks: [
//                 ...g.tasks.map((t) =>
//                   t.pos > newTask.pos
//                     ? { ...t, pos: t.pos + 12111 }
//                     : { ...t, pos: t.pos - 12111 }
//                 ),
//                 newTask,
//               ],
//             }
//           : g
//       ),
//     };

//     store.dispatch({ type: EDIT_WORKSPACE, board: updatedTargetBoard });
//     if (targetBoardId === task.idBoard) {
//       const newActivity = utilService.createActivity(
//         {
//           type: "movedTask",
//           targetId: task.id,
//           targetName: task.name,
//           from: sourceBoard.groups.find((g) => g.id === task.idGroup).name,
//           to: sourceBoard.groups.find((g) => g.id === targetGroupId).name,
//         },
//         user
//       );
//       updatedTargetBoard.activities.push(newActivity);
//       setBoard(updatedTargetBoard);
//     } else {
//       const sourceActivity = utilService.createActivity(
//         {
//           type: "transferTask",
//           targetId: task.id,
//           targetName: task.name,
//           boardId: targetBoard.id,
//           boardName: targetBoard.name,
//         },
//         user
//       );
//       const targetActivity = utilService.createActivity(
//         {
//           type: "receiveTask",
//           targetId: task.id,
//           targetName: task.name,
//           boardId: sourceBoard.id,
//           boardName: sourceBoard.name,
//         },
//         user
//       );
//       sourceBoard.activities.push(sourceActivity);
//       targetBoard.activities.push(targetActivity);
//       setBoard(updatedSourceBoard);
//       store.dispatch({ type: EDIT_WORKSPACE, board: updatedSourceBoard });
//       await boardService.save(updatedSourceBoard);
//     }
//     await boardService.save(updatedTargetBoard);
//   } catch (error) {
//     console.log(error);
//   }
// }

export async function moveTaskBetweenBoards(moveTaskEvent) {
  const {
    taskId,
    sourceBoardId,
    sourceGroupId,
    destinationBoardId,
    destinationGroupId,
    destinationIndex,
    user,
  } = moveTaskEvent;

  const boards = await workspaceService.getAllBoards();
  const sourceBoard = boards.find((b) => b.id === sourceBoardId);
  const destinationBoard = boards.find((b) => b.id === destinationBoardId);

  const task = sourceBoard.groups
    .find((g) => g.id === sourceGroupId)
    .tasks.find((t) => t.id === taskId);

  if (!task) {
    console.error(`Task ${taskId} not found in group ${sourceGroupId}`);
    return;
  }

  const newTask = {
    ...task,
    idBoard: destinationBoardId,
    idGroup: destinationGroupId,
    pos: destinationIndex,
  };

  //Remove task from source board
  const updatedSourceBoard = {
    ...sourceBoard,
    groups: sourceBoard.groups.map((g) => {
      if (g.id === sourceGroupId) {
        return {
          ...g,
          tasks: g.tasks
            .filter((t) => t.id !== taskId)
            .map((t) => (t.pos > task.pos ? { ...t, pos: t.pos - 1 } : t)),
        };
      }
      return g;
    }),
  };

  const sourceActivity = utilService.createActivity(
    {
      type: "transferTask",
      targetId: task.id,
      targetName: task.name,
      boardId: destinationBoard.id,
      boardName: destinationBoard.name,
    },
    user
  );
  updatedSourceBoard.activities.push(sourceActivity);
  store.dispatch({ type: SET_BOARD, board: updatedSourceBoard });
  store.dispatch({ type: EDIT_WORKSPACE, board: updatedSourceBoard });
  await boardService.save(updatedSourceBoard);

  //Add task to destination board
  const updatedDestinationBoard = {
    ...destinationBoard,
    groups: destinationBoard.groups.map((g) => {
      if (g.id === destinationGroupId) {
        const newGroup = {
          ...g,
          tasks: g.tasks.map((t) =>
            t.pos >= destinationIndex ? { ...t, pos: t.pos + 1 } : t
          ),
        };
        newGroup.tasks.splice(destinationIndex, 0, newTask);
        return newGroup;
      }
      return g;
    }),
  };
  const destinationActivity = utilService.createActivity(
    {
      type: "receiveTask",
      targetId: task.id,
      targetName: task.name,
      boardId: sourceBoard.id,
      boardName: sourceBoard.name,
    },
    user
  );
  updatedDestinationBoard.activities.push(destinationActivity);
  store.dispatch({ type: EDIT_WORKSPACE, board: updatedDestinationBoard });
  await boardService.save(updatedDestinationBoard);
}

export async function createBoard(board) {
  const newBoard = await boardService.save({ ...board, apdatedAt: Date.now() });
  store.dispatch({ type: ADD_BOARD, board: newBoard });
  return newBoard.id;
}
