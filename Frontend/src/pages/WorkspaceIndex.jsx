import { Outlet, useSearchParams } from "react-router-dom";
import { WorkspaceHeader } from "../cmps/Workspace/WorkspaceHeader";
import { WorkspaceMenu } from "../cmps/Workspace/WorkspaceMenu";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  loadBoard,
  loadBoardByTaskId,
  viewBoard,
} from "../store/board.actions";
import { login, editUser, loadWorkspaceUsers } from "../store/user.actions";
import { createBoard } from "../store/workspace.actions";
import { useSelector } from "react-redux";
import { setBoards } from "../store/workspace.actions";
import { updateBoard } from "../store/board.actions";
import { BoardMenu } from "../cmps/BoardHeader/BoardMenu/BoardMenu";
import { utilService } from "../services/util.service";
import { ErrorPage } from "./ErrorPage";

export function WorkspaceIndex() {
  const user = useSelector((state) => state.userModule.user);
  const [isLoaded, setIsLoaded] = useState(true);
  const boardsInfo = useSelector((state) => state.workspaceModule.boards)
    ?.filter((b) => user && b?.members?.some((m) => m.id === user.id))
    .filter((b) => !b.closed)
    .map((b) => ({
      id: b.id,
      name: b.name,
      closed: b.closed,
      coverImg: b.prefs.backgroundImage,
    }));
  const boards = useSelector((state) => state.workspaceModule.boards);
  const board = useSelector((state) => state.boardModule.board);
  const boardBgPrefs = useSelector((state) => state.boardModule.board)?.prefs;

  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [starredBoardIds, setStarredBoardIds] = useState([]);
  const [wrongInviteLink, setWrongInviteLink] = useState(false);
  const [isUserBoards, setIsUserBoards] = useState(false);
  const [darkMode, setDarkMode] = useState();
  const [openBoardMenu, setOpenBoardMenu] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setWorkSpaceBoards();
    getUser();
  }, []);

  useEffect(() => {
    if (window.location.pathname === "" || window.location.pathname === "/") {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      setDarkMode(user.darkMode);
    }
  }, [user]);
  async function setWorkSpaceBoards() {
    setIsLoaded(false);
    await setBoards();
    setIsLoaded(true);
  }
  useEffect(() => {
    if (params.boardId) {
      loadBoard(params.boardId);
      setSelectedBoardId(params.boardId);
      setIsUserBoards(false);
      viewBoard(params.boardId);
    }
    if (params.cardId) {
      loadBoardByTaskId(params.cardId).then((boardId) => {
        setSelectedBoardId(boardId);
        setIsUserBoards(false);
        viewBoard(boardId);
      });
    }
  }, [params]);

  //Notice any change in user page is through this
  //Make sure that changes dont break navigation
  useEffect(() => {
    if (!params.boardId && !params.cardId && user && !isUserBoards) {
      setSelectedBoardId(null);
    }
  }, [params, user, isUserBoards]);

  async function getUser() {
    const user = await login();
    if (!user) {
      navigate("/home");
    }
  }

  useEffect(() => {
    setStarredBoardIds(user?.starredBoardIds);
  }, [user]);
  useEffect(() => {
    if (params.link && params.link !== board.invLink) {
      setWrongInviteLink(true);
    } else {
      setWrongInviteLink(false);
    }
  }, [params, board]);
  useEffect(() => {
    // Update localStorage and <html> class based on darkMode state
    if (darkMode === "dark") {
      document.querySelector("html").classList.add("dark");
    } else if (darkMode === "light") {
      document.querySelector("html").classList.remove("dark");
    }
    if (darkMode === "default") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.querySelector("html").classList.add("dark");
      } else if (!window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.querySelector("html").classList.remove("dark");
      }
    }
  }, [darkMode]);

  function onStarClick(boardId) {
    const isStarred = user?.starredBoardIds.includes(boardId);
    const starredBoardIds = isStarred
      ? user.starredBoardIds.filter((id) => id !== boardId)
      : [...user.starredBoardIds, boardId];
    editUser({ ...user, starredBoardIds });
  }

  async function onAddBoard(board) {
    const boardId = await createBoard(board);
    navigate(`/b/${boardId}`);
  }

  function onCloseBoard(boardId) {
    console.log("onCloseBoard", boardId);
    const board = boards.find((b) => b.id === boardId);
    const newActivity = utilService.createActivity(
      {
        type: "closeBoard",
      },
      user
    );
    if (board) {
      updateBoard({
        ...board,
        closed: true,
        activities: [...board?.activities, newActivity],
      });
    }
  }

  function onLeaveBoard(boardId) {
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      updateBoard({
        ...board,
        members: board.members.filter((m) => m.id !== user.id),
      });
    }
  }
  const contextValues = {
    setOpenBoardMenu,
    openBoardMenu,
    showBtn,
    setShowBtn,
  };
  return (
    <section
      className={`workspace ${isUserBoards ? "user-boards-bg" : ""}`}
      style={{
        backgroundImage:
          selectedBoardId && boardBgPrefs?.backgroundImage
            ? `url(${boardBgPrefs.backgroundImage})`
            : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <WorkspaceHeader
        bgColor={
          (!wrongInviteLink &&
            selectedBoardId &&
            boardBgPrefs?.backgroundColor) ||
          ""
        }
        userName={user?.username}
        setDarkMode={setDarkMode}
        darkMode={darkMode}
      />
      {!wrongInviteLink ? (
        <>
          {user && starredBoardIds && selectedBoardId ? (
            <section className="workspace-content">
              {isLoaded && (
                <>
                  {board.id ? (
                    <>
                      <WorkspaceMenu
                        colorTheme={boardBgPrefs?.backgroundBrightness}
                        boardsInfo={boardsInfo}
                        selectedBoardId={selectedBoardId}
                        starredBoardIds={starredBoardIds}
                        onStarClick={onStarClick}
                        onAddBoard={onAddBoard}
                        closeBoard={onCloseBoard}
                        leaveBoard={onLeaveBoard}
                      />
                      <Outlet context={contextValues} />
                    </>
                  ) : (
                    <ErrorPage wrongUrl={true} />
                  )}
                </>
              )}
              {openBoardMenu && (
                <BoardMenu
                  setOpenBoarMenu={setOpenBoardMenu}
                  setShowBtn={setShowBtn}
                />
              )}
            </section>
          ) : (
            <Outlet />
          )}
        </>
      ) : (
        <ErrorPage wrongUrl={true} />
      )}
    </section>
  );
}