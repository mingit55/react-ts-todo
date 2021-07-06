interface HistoryItemProps {
  id: number;
  todoId: number;
  historyType: string;
  updatedKey?: string;
  oldValue?: any;
  newValue?: any;
  createdAt: Date;
}

export default function HistoryItem(props: HistoryItemProps): JSX.Element {
  const getActionText = () => {
    switch (props.historyType) {
      case "insert":
        return "추가되었습니다.";
      case "update":
        return "수정되었습니다.";
      case "delete":
        return "삭제되었습니다.";
      default:
        return "";
    }
  };
  const getUpdatedLabel = () => {
    switch (props.updatedKey) {
      case "content":
        return "내용";
      case "isCompleted":
        return "완료여부"
      default:
        return "";
    }
  };
  const getUpdatedValue = (value: any) => {
    switch (props.updatedKey) {
      case "content":
        return value.length > 6 ? value.substr(0, 6) + "..." : value;
      case "isCompleted":
        return value ? "완료" : "미완료";
      default:
        return value;
    }
  };
  const getCreatedAt = () => {
    let cd = props.createdAt;
    return `${String(cd.getMonth()).padStart(2, "0")}/${String(
      cd.getDate()
    ).padStart(2, "0")} ${String(cd.getHours()).padStart(2, "0")}:${String(
      cd.getMinutes()
    ).padStart(2, "0")}`;
  };

  const oldValue: any = props.oldValue !== undefined && props.oldValue;
  const newValue: any = props.newValue !== undefined && props.newValue;

  return (
    <div className={`history-item history-item--${props.historyType}`}>
      <p>
        {getCreatedAt()} :: {props.todoId}번째 메모가 {getActionText()}
      </p>
      {props.updatedKey && (
        <p>
          "{getUpdatedLabel()}" 값이 "{getUpdatedValue(oldValue)}"에서 "
          {getUpdatedValue(newValue)}"로 변경되었습니다.
        </p>
      )}
    </div>
  );
}
