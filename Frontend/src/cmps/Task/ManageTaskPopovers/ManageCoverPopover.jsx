import { Image, Tooltip } from "antd"
import { useState, useRef } from "react"
import { ManageTaskPopoverHeader } from "../ManageTaskPopovers/ManageTaskPopoverHeader"
import { utilService } from "../../../services/util.service"
import { useSelector } from "react-redux"
import Popup from "@atlaskit/popup"

export function ManageCoverPopover({ anchorEl, editTask, task, isFullWidth }) {
    const boardCoverImgs = useSelector(
        (state) => state.boardModule.board.coverImgs,
    )
    const [isOpen, setIsOpen] = useState(false)
    const triggerRef = useRef(null)

    function onClose(e) {
        e.stopPropagation()
        setIsOpen(false)
    }

    function onSelectColor(e, color) {
        e.stopPropagation()
        const coverSize = task.cover.size === "full" ? "full" : "normal"
        editTask({
            ...task,
            cover: {
                ...task.cover,
                color,
                idUploadedBackground: null,
                scaled: null,
                brightness: "light",
                size: coverSize,
                attachment: null,
            },
        })
    }

    function onChangeSize(e, size) {
        e.stopPropagation()
        if (task.cover.color || task.cover.attachment) {
            editTask({ ...task, cover: { ...task.cover, size: size } })
        }
    }

    function onRemoveCover(e) {
        e.stopPropagation()
        editTask({
            ...task,
            cover: {
                ...task.cover,
                color: null,
                attachment: null,
                size: "normal",
                brightness: "light",
            },
        })
    }

    function onSelectPhoto(e, id) {
        e.stopPropagation()
        const img = boardCoverImgs.find((img) => img.id === id)

        const attachment = {
            link: img.scaledImgs[2].url,
            text: img.photographer,
            avgBgColor: {
                color: img.bg,
                isDark: img.brightness === "dark",
            },
        }

        const newTask = {
            ...task,
            cover: {
                ...task.cover,
                scaled: img.scaledImgs,
                color: null,
                attachment,
            },
        }

        editTask(newTask)
    }

    const isCover = task?.cover.color || task?.cover.attachment
    const backgroundColor =
        utilService.getColorHashByName(task?.cover.color)?.bgColor || null

    const content = (
        <section
            className="manage-cover-content"
            style={
                backgroundColor && {
                    "--dynamic-bg-color": backgroundColor,
                    "--active-bg-color": backgroundColor,
                    "--non-active-bg-color": "#dcdfe4",
                }
            }
        >
            <ManageTaskPopoverHeader title="Cover" close={onClose} />
            <section className="cover-body">
                <h3 className="cover-sub-title">Size</h3>
                <article className={`cover-btns `}>
                    <div
                        className={`half-size-wrapper ${
                            isCover && task?.cover?.size === "normal"
                                ? "active"
                                : "non-active"
                        }`}
                    >
                        <div
                            className={`half-size-btn `}
                            onClick={(e) => onChangeSize(e, "normal")}
                        >
                            <div
                                className={`sub-block-1 ${
                                    task?.cover.color ? "active" : "non-active"
                                }`}
                                style={{
                                    backgroundImage: task?.cover.attachment
                                        ? `url(${task?.cover?.attachment?.link})`
                                        : "none",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            ></div>
                            <div className="sub-block-2">
                                <div className="row-1"></div>
                                <div className="row-2"></div>
                                <div className="row-3">
                                    <div className="col-1"></div>
                                    <div className="col-2"></div>
                                </div>
                                <div className="row-4"></div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`full-size-wrapper ${
                            isCover && task.cover.size === "full"
                                ? "active"
                                : "non-active"
                        }`}
                    >
                        <div
                            className={`full-size-btn ${
                                task?.cover.attachment
                                    ? "has-image"
                                    : "no-image"
                            }`}
                            onClick={(e) => onChangeSize(e, "full")}
                            style={{
                                backgroundImage: task?.cover.attachment
                                    ? `url(${task?.cover?.attachment?.link})`
                                    : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="sub-block-1">
                                <div className="row-1"></div>
                                <div className="row-2"></div>
                            </div>
                        </div>
                    </div>
                </article>
                {isCover && (
                    <button
                        className="remove-cover-btn"
                        onClick={(e) => onRemoveCover(e)}
                    >
                        Remove cover
                    </button>
                )}
                <h3 className="cover-sub-title">Colors</h3>
                <article className="color-btns">
                    {utilService.getBaseColors().map((color) => (
                        <div
                            className={`color-btn ${
                                task?.cover.color === color.color
                                    ? "active"
                                    : ""
                            }`}
                            style={{ backgroundColor: color.bgColor }}
                            key={color.color}
                            onClick={(e) => onSelectColor(e, color.color)}
                        ></div>
                    ))}
                </article>
                <h3 className="cover-sub-title">Photos from Unsplash</h3>
                <article className="photo-btns">
                    {boardCoverImgs.map((img) => (
                        <div
                            className="photo-btn"
                            key={img.id}
                            onClick={(e) => onSelectPhoto(e, img.id)}
                        >
                            <Tooltip title={img.photographer} arrow={false}>
                                <Image
                                    className="photo-item"
                                    src={img.scaledImgs[0].url}
                                    alt={img.photographer}
                                    preview={false}
                                />
                            </Tooltip>
                        </div>
                    ))}
                </article>
            </section>
        </section>
    )

    const trigger = (triggerProps) => {
        return (
            <div
                ref={triggerRef}
                {...triggerProps}
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                style={{
                    display: "inline-block",
                    width: isFullWidth ? "100%" : "auto",
                }} // Ensure inline positioning
            >
                {anchorEl}
            </div>
        )
    }

    return (
        <Popup
            id="manage-cover-popover-popup"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement="bottom-start"
            fallbackPlacements={["top-start", "auto"]}
            content={() => content}
            trigger={trigger}
            zIndex={10000}
            triggerRef={triggerRef}
        />
    )
}
