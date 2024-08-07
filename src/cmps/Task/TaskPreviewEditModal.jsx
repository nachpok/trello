import { useRef, useState, useEffect } from "react";
import { Modal, Input } from "antd";
import editSvg from "../../assets/svgs/edit.svg";
import { TaskPreviewBadges } from "./TaskPreviewBadges";
import { TaskPreviewLabel } from "./TaskPreviewLabel";
import { utilService } from "../../services/util.service";
import cardIcon from "/img/taskActionBtns/cardIcon.svg";
import moveIcon from "/img/taskActionBtns/moveIcon.svg";
import labelIcon from "/img/taskActionBtns/labelIcon.svg";
import userIcon from "/img/taskActionBtns/userIcon.svg";
import timeIcon from "/img/taskActionBtns/timeIcon.svg";
import coverIcon from "/img/taskActionBtns/coverIcon.svg";
import copyIcon from "/img/taskActionBtns/copyIcon.svg";
import archiveIcon from "/img/taskActionBtns/archiveIcon.svg";
import { SvgButton } from "../CustomCpms/SvgButton";
import { ManageMembersPopover } from "./ManageTaskPopovers/ManageMembersPopover";
import { ManageLabelsPopover } from "./ManageTaskPopovers/ManageLabelsPopover";
import { ManageCoverPopover } from "./ManageTaskPopovers/ManageCoverPopover";
import { useSelector } from "react-redux";
import { MoveCardPopover } from "./ManageTaskPopovers/MoveCardPopover";
import { ManageDatesPopover } from "./ManageTaskPopovers/ManageDatesPopover";

const { TextArea } = Input;

export function TaskPreviewEditModal({
  task,
  isHovered,
  editTask,
  isOpen,
  openPreviewModal,
  taskWidth,
  labelActions,
}) {
  const boardLabels = useSelector((state) => state.boardModule.board.labels);
  const [taskLabels, setTaskLabels] = useState([]);

  const [modalStyle, setModalStyle] = useState({});
  const [taskName, setTaskName] = useState(task?.name || "");
  const [showEditModalBtn, setShowEditModalBtn] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setShowEditModalBtn(isHovered);
  }, [isHovered, isOpen]);

  useEffect(() => {
    const labels = task?.idLabels
      .filter((labelId) =>
        boardLabels?.some((boardLabel) => boardLabel.id === labelId)
      )
      .map((labelId) =>
        boardLabels.find((boardLabel) => boardLabel.id === labelId)
      );
    setTaskLabels(labels || []);
  }, [task?.idLabels, boardLabels]);

  function showModal(e) {
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    setModalStyle({
      position: "absolute",
      top: `${rect.top}px`,
      left: `${rect.right - taskWidth}px`,
    });
    openPreviewModal(true);
  }

  function handleOk(e) {
    e.stopPropagation();
    if (taskName !== task?.name) {
      editTask({ ...task, name: taskName });
    }
    openPreviewModal(false);
  }

  function handleCancel(e) {
    openPreviewModal(false);
  }

  const modalActionButtons = [
    // { label: 'Open card', icon: cardIcon, onClick: () => console.log('Add to X'), cover: false },
    {
      cover: false,
      popover: (
        <ManageLabelsPopover
          anchorEl={
            <SvgButton
              src={labelIcon}
              className="floating-button"
              label="Edit labels"
            />
          }
          editTask={editTask}
          task={task}
          labelActions={labelActions}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      cover: false,
      popover: (
        <ManageMembersPopover
          anchorEl={
            <SvgButton
              src={userIcon}
              className="floating-button"
              label="Change members"
              onClick={(e) => e.stopPropagation()}
            />
          }
          editTask={editTask}
          task={task}
        />
      ),
    },
    {
      cover: true,
      popover: (
        <ManageCoverPopover
          anchorEl={
            <SvgButton
              src={coverIcon}
              className="floating-button"
              label="Change cover"
              onClick={(e) => e.stopPropagation()}
            />
          }
          editTask={editTask}
          task={task}
        />
      ),
    },
    {
      cover: false,
      popover: (
        <ManageDatesPopover
          task={task}
          editTask={editTask}
          anchorEl={
            <SvgButton
              src={timeIcon}
              className="floating-button"
              label="Edit date"
              onClick={(e) => e.stopPropagation()}
            />
          }
        />
      ),
    },
    // { label: 'Move', icon: moveIcon, onClick: () => console.log('Add to Y'), cover: true },
    {
      cover: true,
      popover: (
        <MoveCardPopover
          task={task}
          onCloseTask={handleCancel}
          closeAfter={true}
          anchorEl={
            <SvgButton
              src={moveIcon}
              label="Move"
              className="floating-button"
              onClick={(e) => e.stopPropagation()}
            />
          }
        />
      ),
    },
    // { label: 'Copy', icon: copyIcon, onClick: () => console.log('Add to Y'), cover: true },
    {
      popover: (
        <SvgButton
          src={archiveIcon}
          className="floating-button"
          label="Archive"
          onClick={() => editTask({ ...task, closed: true })}
        />
      ),
      cover: true,
    },
  ];

  // const modalActionButtons =
  //   task.cover.size === "full"
  //     ? allModalActionButtons.filter((btn) => btn.cover)
  //     : allModalActionButtons;

  return (
    <div>
      {showEditModalBtn && (
        <div ref={containerRef} className="task-preview-edit-modal-anchor">
          <SvgButton
            src={editSvg}
            className="edit-button"
            onClick={showModal}
          />
        </div>
      )}
      <Modal
        className="task-preview-edit-modal"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer={() => containerRef.current}
        style={modalStyle}
        width={taskWidth}
        closable={false}
        footer={null}
        transitionName="" // Disable modal open animation
        maskTransitionName=""
      >
        {task?.cover.color && (
          <div
            className="group-task-header"
            style={{
              backgroundColor: utilService.getColorHashByName(task?.cover.color)
                .bgColor,
            }}
          ></div>
        )}
        {task?.cover.idUploadedBackground && (
          <div
            className="group-task-header img-cover"
            style={{ backgroundImage: `url(${task?.cover.scaled[2].url})` }}
          ></div>
        )}
        <main className="task-preview-edit-modal-content">
          <article className="preview-labels">
            {taskLabels?.map((label) => (
              <TaskPreviewLabel
                key={label.id}
                label={label}
                isExpanded={true}
              />
            ))}
          </article>
          <TextArea
            className="task-name-input"
            autoSize={{ minRows: 3, maxRows: 6 }}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <TaskPreviewBadges task={task} editTask={editTask} />
        </main>
        <button className="floating-button save-button" onClick={handleOk}>
          Save
        </button>
        <section
          className={`floating-buttons ${
            task?.cover.size === "full" ? "full-cover" : ""
          }`}
        >
          {modalActionButtons.map((btn, index) => (
            <div
              key={index}
              style={{
                display:
                  task?.cover.size === "normal" || btn.cover ? "block" : "none",
              }}
            >
              {btn.popover}
            </div>
          ))}
        </section>
      </Modal>
    </div>
  );
}
