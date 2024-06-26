import { useRef, useState, useEffect } from 'react';
import { Modal, Input } from 'antd';
import editSvg from '../../assets/svgs/edit.svg';
import { TaskPreviewBadges } from "./TaskPreviewBadges";
import { TaskPreviewLabel } from "./TaskPreviewLabel";
import { utilService } from '../../services/util.service';
import cardIcon from '/img/taskActionBtns/cardIcon.svg';
import moveIcon from '/img/taskActionBtns/moveIcon.svg';
import labelIcon from '/img/taskActionBtns/labelIcon.svg';
import userIcon from '/img/taskActionBtns/userIcon.svg';
import timeIcon from '/img/taskActionBtns/timeIcon.svg';
import coverIcon from '/img/taskActionBtns/coverIcon.svg';
import copyIcon from '/img/taskActionBtns/copyIcon.svg';
import archiveIcon from '/img/taskActionBtns/archiveIcon.svg';
import { SvgButton } from '../CustomCpms/SvgButton';
import { ManageMembersPopover } from './ManageTaskPopovers/ManageMembersPopover';
import { ManageLabelsPopover } from './ManageTaskPopovers/ManageLabelsPopover';
const { TextArea } = Input;

export function TaskPreviewEditModal({ task, isHovered, editTask, isOpen, openPreviewModal }) {
    const [modalStyle, setModalStyle] = useState({});
    const [taskName, setTaskName] = useState(task.name || '');
    const [showEditModalBtn, setShowEditModalBtn] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        setShowEditModalBtn(isHovered);
    }, [isHovered, isOpen]);

    const showModal = () => {
        const rect = containerRef.current.getBoundingClientRect();
        setModalStyle({
            position: 'absolute',
            top: `${rect.top - 4}px`,
            left: `${rect.left - 205}px`,
        });
        openPreviewModal(true);
    };

    const handleOk = () => {
        if (taskName !== task.name) {
            editTask({ ...task, name: taskName });
        }
        openPreviewModal(false);
    };

    const handleCancel = () => {
        openPreviewModal(false);
    };

    const allModalActionButtons = [
        // { label: 'Open card', icon: cardIcon, onClick: () => console.log('Add to X'), cover: false },
        {
            cover: false, popover: (
                <ManageLabelsPopover
                    anchorEl={
                        <SvgButton
                            src={labelIcon}
                            className="floating-button"
                            label="Edit labels"
                        />
                    }
                    taskLabels={task.labels}
                    editTask={editTask}
                    task={task}
                />
            )
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
                        />
                    }
                    taskMemberIds={task.idMembers}
                    editTask={editTask}
                    task={task}
                />
            )
        },
        // { label: 'Change cover', icon: coverIcon, onClick: () => console.log('Add to Y'), cover: true },
        // { label: 'Edit date', icon: timeIcon, onClick: () => console.log('Add to Y'), cover: false },
        // { label: 'Move', icon: moveIcon, onClick: () => console.log('Add to Y'), cover: true },
        // { label: 'Copy', icon: copyIcon, onClick: () => console.log('Add to Y'), cover: true },
        // { label: 'Archive', icon: archiveIcon, onClick: () => console.log('Add to Y'), cover: true },
    ];

    const modalActionButtons = task.cover.size === 'full' ? allModalActionButtons.filter(btn => btn.cover) : allModalActionButtons;

    return (
        <div>
            {showEditModalBtn &&
                (<div ref={containerRef} className="task-preview-edit-modal-anchor">
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
                width={236}
                closable={false}
                footer={null}
                transitionName=""          // Disable modal open animation
                maskTransitionName=""
            >
                {task.cover.color && (
                    <div
                        className="group-task-header"
                        style={{
                            backgroundColor: utilService.getColorHashByName(
                                task.cover.color
                            ).bgColor,
                        }}></div>
                )}
                {task.cover.idUploadedBackground && (
                    <div
                        className="group-task-header img-cover"
                        style={{ backgroundImage: `url(${task.cover.scaled[2].url})` }}
                    ></div>
                )}
                <main className="task-preview-edit-modal-content">
                    <article className="group-task-content-labels">
                        {task.labels.map((label) => (
                            <TaskPreviewLabel key={label.id} label={label} isExpanded={true} />
                        ))}
                    </article>
                    <TextArea
                        className="task-name-input"
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <TaskPreviewBadges task={task} />
                </main>
                <button className="floating-button save-button" onClick={handleOk}>
                    Save
                </button>
                <section className={`floating-buttons ${task.cover.size === 'full' ? 'full-cover' : ''}`}>
                    {modalActionButtons.map((btn, index) => (
                        <div key={index}>
                            {btn.popover}
                        </div>
                    ))}
                </section>
            </Modal>
        </div>
    )
}