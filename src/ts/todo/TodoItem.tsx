import * as React from 'react';
import { UpdatableValues } from './TodoEditor';

interface TodoItemProp {
  id: number;
  x: number;
  y: number;
  content: String;
  isFocused: Boolean;
  isCompleted: Boolean;
  createdAt: Date;
  onDelete: () => void;
  onUpdate: (value: UpdatableValues) => void;
  onChange: (value: string) => void;
}

export default function TodoItem(props: TodoItemProp): JSX.Element {
  const innerElemRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<[number, number]>([props.x, props.y]);
  const [grapPosition, setGrapPosition] = React.useState<[number, number] | null>(null);
  const [angle] = React.useState(Math.trunc(Math.random() * 12 - 6));

  const getCreatedAt = () => {
    let cd = props.createdAt;
    return `${String(cd.getMonth()).padStart(2, "0")}/${String(
      cd.getDate()
    ).padStart(2, "0")} ${String(cd.getHours()).padStart(2, "0")}:${String(
      cd.getMinutes()
    ).padStart(2, "0")}`;
  };
  const handlePinClick = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
      props.onDelete();
    }
  };
  const handlePinDoubleClick = (e: React.MouseEvent) => {
    if (grapPosition) return;
    const [x, y] = position;
    props.onUpdate({ isFocused: true });
    setGrapPosition([e.clientX - x, e.clientY - y]);
  };
  const handleDblclick = () => {
    if(!props.isFocused) {
      props.onUpdate({ isCompleted: !props.isCompleted });
    }
  };
  const handleKeydown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.keyCode === 13) {
      const target: HTMLDivElement = e.target as HTMLDivElement;
      props.onUpdate({ isFocused: false });
      props.onChange(target.innerText)
    }
  };
  const handleInput = (e: React.FormEvent) => {
    const target: HTMLDivElement = e.target as HTMLDivElement;
    props.onUpdate({ content: target.innerText })
  };

  React.useEffect(() => {
    const handleMousemove = (e: MouseEvent) => {
      if (!grapPosition || !props.isFocused) return;
      const [grapX, grapY] = grapPosition;
      const x = e.clientX - grapX;
      const y = e.clientY - grapY;
      setPosition([x, y]);
    };
    const handleClick = () => {
      if (!grapPosition) return;
      setGrapPosition(null);
    };

    window.addEventListener('mousemove', handleMousemove);
    window.addEventListener('click', handleClick);

    if (innerElemRef && innerElemRef.current) {
      innerElemRef.current.focus();
    }

    return () => {
      window.removeEventListener('mousemove', handleMousemove);
      window.removeEventListener('click', handleClick);
    };
  }, [grapPosition, props.isFocused]);

  return (
    <div
      className={'todo-item' + (props.isFocused ? ' todo-item--focused' : '') + (props.isCompleted ? ' todo-item--completed' : '')}
      style={{
        transform: `rotate(${angle}deg)`,
        left: position[0] + 'px',
        top: position[1] + 'px',
      }}
    >
      <div
        className="todo-item__pin"
        onClick={handlePinClick}
        onDoubleClick={handlePinDoubleClick}
      ></div>
      <div className="todo-item__info">
        <span className="title">{ props.id }번째 메모</span>
        <span className="date">{getCreatedAt()}</span>
      </div>
      <div
        className="todo-item__inner"
        ref={innerElemRef}
        onKeyDown={handleKeydown}
        onInput={handleInput}
        onDoubleClick={handleDblclick}
        contentEditable={props.isFocused ? 'true' : 'false'}
      ></div>
    </div>
  );
}
