import * as React from "react";
import CursorPin from "./CursorPin";
import TodoItem from "./TodoItem";
import HistoryItem from "./HistoryItem";

export interface TodoSchema {
  [index: string]: any,
  id: number;
  x: number;
  y: number;
  content: String;
  createdAt: Date;
  isFocused: Boolean;
  isCompleted: Boolean;
}

export interface HistorySchema {
  [index: string]: any,
  id: number;
  todoId: number;
  historyType: "insert" | "update" | "delete";
  updatedKey?: string;
  oldValue?: any;
  newValue?: any;
  createdAt: Date;
}

export interface UpdatableValues {
  [index: string]: any,
  content?: String;
  isFocused?: Boolean;
  isCompleted?: Boolean;
}

export default function TodoEditor(): JSX.Element {
  const [cursorVisible, setCursorVisible] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState<[number, number]>([
    0, 0,
  ]);
  const [historyList, setHistoryList] = React.useState<Array<HistorySchema>>(
    []
  );
  const [mode, setMode] = React.useState("normal");
  const [todoList, setTodoList] = React.useState<Array<TodoSchema>>([]);
  const [todoAICounter, setTodoAICounter] = React.useState(1);
  const [historyAICounter, setHistoryAICounter] = React.useState(1);

  const deleteTodo = (idx: number) => {
    if(!todoList[idx]) return;

    const todo = todoList[idx];
    setTodoList(todoList.filter((v, vIdx) => vIdx !== idx));
    const history: HistorySchema = {
      id: historyAICounter,
      todoId: todo.id,
      historyType: "delete",
      createdAt: new Date(),
    };
    setHistoryList([...historyList, history]);
    setHistoryAICounter(historyAICounter + 1);
  };
  const updateTodo = (idx: number, valueObj: UpdatableValues) => {
    if(!todoList[idx]) return;

    const todo = todoList[idx];
    setTodoList(
      todoList.map((v, vIdx) => (vIdx === idx ? { ...v, ...valueObj } : v))
    );

    const storableValues = ['isCompleted'];
    Object.keys(valueObj).forEach((key: string) => {
      if(!storableValues.includes(key)) return;
      const history: HistorySchema = {
        id: historyAICounter,
        todoId: todo.id,
        historyType: "update",
        updatedKey: key,
        oldValue: todo[key],
        newValue: valueObj[key],
        createdAt: new Date(),
      };
      setHistoryList([...historyList, history]);
      setHistoryAICounter(historyAICounter + 1);
    });
  };
  const handleTodoChange = (idx: number, value: string) => {
    const todo: TodoSchema = todoList[idx];
    const history: HistorySchema = {
      id: historyAICounter,
      todoId: todo.id,
      historyType: "update",
      updatedKey: 'content',
      oldValue: todo.content,
      newValue: value,
      createdAt: new Date(),
    };
    setHistoryList([...historyList, history]);
    setHistoryAICounter(historyAICounter + 1);
  };

  React.useEffect(() => {
    const hasFocusedTodo = () => {
      return Array.from(todoList).some((v) => v.isFocused);
    };

    const insertTodo = (x: number, y: number) => {
      const todoItem: TodoSchema = {
        id: todoAICounter,
        x,
        y,
        content: "",
        createdAt: new Date(),
        isFocused: true,
        isCompleted: false,
      };
      const history: HistorySchema = {
        id: historyAICounter,
        todoId: todoAICounter,
        historyType: "insert",
        createdAt: new Date(),
      };

      setTodoList([...todoList, todoItem]);
      setTodoAICounter(todoAICounter + 1);
      setHistoryList([...historyList, history]);
      setHistoryAICounter(historyAICounter + 1);
    };

    const handleMousemove = (e: MouseEvent) => {
      const x: number = e.clientX - 10;
      const y: number = e.clientY;

      setCursorPosition([x, y]);

      const target = e.target as Element;
      setCursorVisible(target.nodeName === "BODY" && mode === "add");
    };
    const handleDblclick = (e: MouseEvent) => {
      if (mode === "add" || hasFocusedTodo()) return;

      const target = e.target as Element;
      if (target.nodeName !== "BODY") return;
      setMode("add");
      setCursorVisible(true);
    };
    const handleClick = (e: MouseEvent) => {
      if (mode === "normal") return;

      const target = e.target as Element;
      if (target.nodeName !== "BODY") return;

      const x: number = e.clientX - 160;
      const y: number = e.clientY + 20;

      insertTodo(x, y);
      setMode("normal");
      setCursorVisible(false);
    };

    window.addEventListener("mousemove", handleMousemove);
    document.body.addEventListener("dblclick", handleDblclick);
    document.body.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMousemove);
      document.body.removeEventListener("dblclick", handleDblclick);
      document.body.removeEventListener("click", handleClick);
    };
  }, [historyAICounter, historyList, mode, todoAICounter, todoList]);

  return (
    <div id="app">
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
          <TodoItem
            {...v}
            key={v.id}
            onDelete={() => deleteTodo(idx)}
            onUpdate={(val) => updateTodo(idx, val)}
            onChange={(val) => handleTodoChange(idx, val)}
          />
        ))}
      </div>
      <div className="todo-history">
        {historyList.map((v) => (
          <HistoryItem {...v} key={v.id} />
        ))}
      </div>
    </div>
  );
}
