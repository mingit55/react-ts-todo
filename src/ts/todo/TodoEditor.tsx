import * as React from 'react';
import CursorPin from './CursorPin';
import TodoItem from './TodoItem';

interface TodoComponent {
  id: number,
  x: number,
  y: number,
}


export default function TodoEditor(): JSX.Element {
  const [ cursorVisible, setCursorVisible ] = React.useState(false);
  const [ cursorPosition, setCursorPosition ] = React.useState<[number, number]>([0, 0]);
  const [ mode, setMode ] = React.useState('normal');
  const [ todoList, setTodoList ] = React.useState<Array<TodoComponent>>([]);
  const [ autoIncrementCounter, setAutoIncrementCounter ] = React.useState(1);

  // const hasFocusedTodo = () => {
  //   return Array.from(todoItemRef).some((v) => v.isFocused);
  // }

  const handleMouseMove = (e: MouseEvent) => {
    const x: number = e.clientX - 10;
    const y: number = e.clientY;

    setCursorPosition([x, y]);

    const target = e.target as Element;
    setCursorVisible(target.nodeName === 'BODY' && mode === 'add');
  }

  const handleDblclick = (e: MouseEvent) => {
    // if (mode === 'add' || hasFocusedTodo()) return;
    if (mode === 'add') return;

    const target = e.target as Element;
    if (target.nodeName !== 'BODY') return;
    setMode('add');
  }

  const handleClick = (e: MouseEvent) => {
    if (mode === 'normal') return;

    const target = e.target as Element;
    if (target.nodeName !== 'BODY') return;

    const x: number = e.clientX - 160;
    const y: number = e.clientY + 20;
    insertTodo(x, y);

    setMode('normal');
    setCursorVisible(false);
  }

  const eventInit = () => {
    window.addEventListener('mousemove', handleMouseMove);

    document.body.addEventListener('dblclick', handleDblclick);

    document.body.addEventListener('click', handleClick);
  }

  const insertTodo = (x: number, y: number) => {
    const id: number = autoIncrementCounter;
    const todoItem: TodoComponent = { id, x, y }
    setTodoList([ ...todoList, todoItem ]);
    setAutoIncrementCounter(id + 1);
  }

  const deleteTodo = (id: number) => {
    const idx: number = todoList.findIndex((v: TodoComponent) => v.id === id);
    if (idx >= 0) {
      todoList.splice(idx, 1);
    }
  }

  React.useEffect(() => {
    eventInit();
  });

  return (
    <div className="todo-editor">
      <p className="help-message">
        ※ 할 일을 붙이려면 아무 곳이나 더블클릭하세요.
        <br />※ 할 일을 삭제하려면 Ctrl을 누른채로 핀을 클릭하세요.
      </p>
      <CursorPin x={cursorPosition[0]} y={cursorPosition[1]} visible={cursorVisible} />
      {
        todoList.map(v => <TodoItem key={v.id} id={v.id} x={v.x} y={v.y} onDelete={deleteTodo} />)
      }
    </div>
  );
}