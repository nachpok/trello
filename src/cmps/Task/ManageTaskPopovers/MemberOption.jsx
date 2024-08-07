import { UserAvatar } from "../../UserAvatar";
import { SvgButton } from "../../CustomCpms/SvgButton";

export function MemberOption({ task, member, isSelected, editTask }) {
  function onEditTask() {
    const newTaskMemberIds = [...task.idMembers];
    if (isSelected) {
      newTaskMemberIds.splice(newTaskMemberIds.indexOf(member.id), 1);
    } else {
      newTaskMemberIds.push(member.id);
    }
    editTask({ ...task, idMembers: newTaskMemberIds });
  }
  return (
    <div className="change-members-option" onClick={onEditTask}>
      <UserAvatar memberId={member?.id} />
      <p className="member-name">{member.fullName}</p>
      {isSelected && (
        <SvgButton src="/img/xIcon.svg" className="remove-member-button" />
      )}
    </div>
  );
}
