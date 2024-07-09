import TextArea from "antd/es/input/TextArea";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../customHooks/useClickOutside";
import { useEffectUpdate } from "../../customHooks/useEffectUpdate";

export function NameInput({
  value = "",
  onSubmit,
  expandInputWidth = true,
  maxRows = 1,
  className,
  autoSelect = true,
  maxLength = 30,
  ...other
}) {
  const [sectionRef, isChangeable, setIsChangeable] = useClickOutside(false);

  const [newName, setNewName] = useState(value);
  const [customWidth, setCustomWidth] = useState(null);
  const textAreaRef = useRef(null);
  const spanRef = useRef(null);

  useEffectUpdate(() => {
    if (!isChangeable && newName !== value) {
      onRename();
    }
  }, [isChangeable]);

  useEffect(() => {
    setNewName(value);

    if (textAreaRef.current) {
      const textAreaElement = textAreaRef.current.resizableTextArea.textArea;
      textAreaElement.focus();
      if (autoSelect) {
        textAreaElement.setSelectionRange(0, textAreaElement.value.length); // Select all text
      } else {
        textAreaElement.setSelectionRange(
          textAreaElement.value.length,
          textAreaElement.value.length
        );
      }
    }
  }, [isChangeable, value]);

  //sutom width
  useEffect(() => {
    if (spanRef.current && expandInputWidth) {
      const currentWidth = spanRef.current.offsetWidth;
      setCustomWidth(currentWidth);
    }
  }, [value, newName,isChangeable]);

  async function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      onRename();
    } else if (e.key === "Escape") {
      setNewName(value);
      setIsChangeable(false);
    }
  }

  function onRename() {
    setIsChangeable(false);
    if (newName === value || newName.trim() === "") {
      return;
    }
    if (onSubmit) {
      onSubmit(newName);
    }
  }

  return (
    <section
      className={`name-input ${className ? className : ""}`}
      {...other}
      ref={sectionRef}
    >
      {isChangeable ? (
        <>
          <span className="title-input" ref={spanRef}>
            {newName}
          </span>
          <TextArea
            ref={textAreaRef}
            className="title-input"
            autoSize={{ minRows: 1, maxRows: maxRows }}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={onKeyDown}
            style={expandInputWidth ? { width: customWidth + "px" } : {}}
            maxLength={maxLength}
          />
        </>
      ) : (
        <p className="title" onClick={() => setIsChangeable(true)}>
          {value}
        </p>
      )}
    </section>
  );
}