import { Card } from "antd"
import { GroupFooter } from "./GroupFooter"
import { useState, useEffect, useCallback, useRef } from "react"
import { AddTaskInGroup } from "./AddTaskInGroup"
import { BoardGroupHeader } from "./BoardGroupHeader"
import { TaskPreview } from "../Task/TaskPreview"
import { TaskPreviewCover } from "../Task/TaskPreviewCover"

//TODO put add new task in array of sorted tasks based on position
export function BoardGroup({ group, addTask, archiveGroup, editGroup, editTask, editLabel, copyGroup, moveAllCards, archiveAllCards, sortGroup }) {
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
    const [newTaskIds, setNewTaskIds] = useState([])
    const [firstTaskPos, setFirstTaskPos] = useState(null)
    const [lastTaskPos, setLastTaskPos] = useState(null)
    const [sortedTasks, setSortedTasks] = useState([])
    const footerRef = useRef(null);
    const handleClickOutside = useCallback(
      (event) => {
        if (footerRef.current && !footerRef.current.contains(event.target)) {
          setIsAddTaskOpen(false);
        }
      },
      [footerRef]
    );
  
    useEffect(() => {
      if (isAddTaskOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isAddTaskOpen, handleClickOutside]);

    useEffect(() => {
        const filteredTasks = group.tasks?.filter(task => !task.closed) || [];
        setSortedTasks(filteredTasks.sort((a, b) => a.pos - b.pos) || [])
        setNewTaskIds(filteredTasks.filter(task => task.pos < firstTaskPos).map(task => task.id) || [])
    }, [group.tasks])

    useEffect(() => {
        const filteredTasks = group.tasks?.filter(task => !task.closed) || [];
        const sortedTasks = filteredTasks.sort((a, b) => a.pos - b.pos) || []
        if (sortedTasks.length > 0) {
            setFirstTaskPos(sortedTasks[0].pos)
            setLastTaskPos(sortedTasks[sortedTasks.length - 1].pos)
        }
    }, [])

    useEffect(() => {
        const filteredTasks = group.tasks?.filter(task => !task.closed) || [];
        const sortedTasks = filteredTasks.sort((a, b) => a.pos - b.pos) || []
        if (sortedTasks.length > 0) {
            setFirstTaskPos(sortedTasks[0].pos)
            setLastTaskPos(sortedTasks[sortedTasks.length - 1].pos)
        }
        setNewTaskIds(filteredTasks.filter(task => task.pos < firstTaskPos).map(task => task.id) || [])
    }, [isAddTaskOpen])


    const openAddTask = () => {
        setIsAddTaskOpen(true)
    }

    return (
        <div className="board-group-container">
            <Card className="board-group custom-card" ref={footerRef}>
                <BoardGroupHeader group={group} editGroup={editGroup} openAddTask={openAddTask} archiveGroup={archiveGroup} copyGroup={copyGroup} moveAllCards={moveAllCards} archiveAllCards={archiveAllCards} sortGroup={sortGroup} />
                <main className="board-group-main">
                    {newTaskIds.map(taskId => <TaskPreview key={taskId} task={group.tasks.find(task => task.id === taskId)} />)}
                    {isAddTaskOpen && <AddTaskInGroup groupId={group.id} closeAddTask={() => setIsAddTaskOpen(false)} addTask={addTask} addToTop={true} />}
                    {sortedTasks.filter(task => !newTaskIds.includes(task.id)).map(task => (
                        task.cover.size === "full"
                            ? <TaskPreviewCover key={task.id} task={task} editTask={editTask} editLabel={editLabel} />
                            : <TaskPreview key={task.id} task={task} editTask={editTask} editLabel={editLabel} />
                    ))}
                </main>
                {!isAddTaskOpen && <GroupFooter groupId={group.id} addTask={addTask} />}
            </Card>
        </div>
    )
}