import { SvgButton } from "../../CustomCpms/SvgButton";
import { ManageLabelsPopover } from "../ManageTaskPopovers/ManageLabelsPopover";
import { useSelector } from "react-redux";
import { utilService } from "../../../services/util.service";
import { useState } from "react";

export function TaskDetailsLabels({ task, editTask, labelActions }) {
    const boardLabels = useSelector((state) => state.boardModule.board.labels);
    const [hoveredLabelId, setHoveredLabelId] = useState(null);
    return (
        <section className="task-details-labels">
            <p className="sub-title">Labels</p>

            <ManageLabelsPopover editTask={editTask} labelActions={labelActions} task={task} anchorEl={<article className="label-list">
                {task.idLabels.map((tLabelId) => {
                    const labelInfo = boardLabels?.find((bLabel) => bLabel.id === tLabelId)
                    if (!labelInfo) return null
                    return (
                        <div
                            className="task-details-label"
                            key={labelInfo.id}
                            style={{
                                backgroundColor: hoveredLabelId === labelInfo?.id ? utilService.getColorHashByName(labelInfo.color).hoverdBgColor : utilService.getColorHashByName(labelInfo.color).bgColor,
                                color: utilService.getColorHashByName(labelInfo?.color).lightFontColor
                            }}
                            onMouseEnter={() => setHoveredLabelId(labelInfo.id)}
                            onMouseLeave={() => setHoveredLabelId(null)}
                        >
                            {labelInfo.name}
                        </div>)
                })}
                <SvgButton src="/img/workspace/pluseIcon.svg" className="add-label-btn" />
            </article>} />
        </section>
    )
}
