import { CloseOutlined } from "@ant-design/icons"
import { Popover } from "antd"
import { useState } from "react"

export function MoreActionsItemPopover({
    anchorEl,
    onDeleteItem,
    onConvertToTask,
}) {
    const [isOpen, setIsOpen] = useState(false)

    function onClose() {
        setIsOpen(false)
    }

    return (
        <Popover
            trigger="click"
            placement="bottomLeft"
            open={isOpen}
            close={onClose}
            onOpenChange={setIsOpen}
            arrow={false}
            content={
                <section className="more-actions-item-popover">
                    <header className="more-actions-header">
                        <span>Item actions</span>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="close-btn"
                        >
                            <CloseOutlined />
                        </button>
                    </header>
                    <div className="more-actions-main">
                        <button className="btn" onClick={onConvertToTask}>
                            Convert to card
                        </button>
                        <button className="btn" onClick={onDeleteItem}>
                            Delete
                        </button>
                    </div>
                </section>
            }
        >
            {anchorEl}
        </Popover>
    )
}
