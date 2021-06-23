import * as React from "react";
import CursorPin from "./CursorPin";
import TodoItem from "./TodoItem";

interface TodoComponent {
  id: number;
  x: number;
  y: number;
  isFocused: Boolean;
}

export default function TodoEditor(): JSX.Element {
  const [cursorVisible, setCursorVisible] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState<[number, number]>([
    0, 0,
  ]);
  const [mode, setMode] = React.useState("normal");
  const [todoList, setTodoList] = React.useState<Array<TodoComponent>>([]);
  const [autoIncrementCounter, setAutoIncrementCounter] = React.useState(1);

  const modeRef = React.useRef<string>();
  modeRef.current = mode;

  const listRef = React.useRef<Array<TodoComponent>>([]);
  listRef.current = todoList;

  const counterRef = React.useRef<number>(1);
  counterRef.current = autoIncrementCounter;

  const hasFocusedTodo = () => {
    return Array.from(listRef.current).some((v) => v.isFocused);
  }
  const handleMouseMove = (e: MouseEvent) => {
    const x: number = e.clientX - 10;
    const y: number = e.clientY;

    setCursorPosition([x, y]);

    const target = e.target as Element;
    setCursorVisible(target.nodeName === "BODY" && modeRef.current === "add");
  };

  const handleDblclick = (e: MouseEvent) => {
    if (mode === 'add' || hasFocusedTodo()) return;
    // if (modeRef.current === "add") return;

    const target = e.target as Element;
    if (target.nodeName !== "BODY") return;
    setMode("add");
    setCursorVisible(true);
  };

  const handleClick = (e: MouseEvent) => {
    if (modeRef.current === "normal") return;

    const target = e.target as Element;
    if (target.nodeName !== "BODY") return;
    
    const x: number = e.clientX - 160;
    const y: number = e.clientY + 20;
    
    insertTodo(x, y);
    setMode("normal");
    setCursorVisible(false);
  };

  const eventInit = () => {
    window.addEventListener("mousemove", handleMouseMove);

    document.body.addEventListener("dblclick", handleDblclick);

    document.body.addEventListener("click", handleClick);
  };

  const insertTodo = (x: number, y: number) => {
    const id: number = counterRef.current;
    const todoList: Array<TodoComponent> = listRef.current;
    const todoItem: TodoComponent = { id, x, y, isFocused: true };
    setTodoList([...todoList, todoItem]);
    setAutoIncrementCounter(id + 1);
  };

  const deleteTodo = (idx: number) => {
    if (idx >= 0) {
      todoList.splice(idx, 1);
    }
  };

  const focusTodo = (idx: number, value: Boolean) => {
    todoList[idx].isFocused = value;
  };

  React.useEffect(() => {
    eventInit();
  }, []);

  return (
    <div className="todo-editor">
      <p className="help-message">
        ※ 할 일을 붙이려면 아무 곳이나 더블클릭하세요.
        <br />※ 할 일을 삭제하려면 Ctrl을 누른채로 핀을 클릭하세요.
      </p>
      <CursorPin
        x={cursorPosition[0]}
        y={cursorPosition[1]}
        visible={cursorVisible}
      />
      {todoList.map((v, idx) => (
        <TodoItem key={v.id} id={v.id} x={v.x} y={v.y} isFocused={v.isFocused} onDelete={() => deleteTodo(idx)} onFocus={(val) => focusTodo(idx, val)} />
      ))}
    </div>
  );
}
