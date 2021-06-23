import * as React from 'react';

interface TodoItemProp {
  id: number;
  x: number;
  y: number;
  onDelete: (id: number) => void;
}

export default function TodoItem(prop: TodoItemProp): JSX.Element {
  const innerElemRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = React.useState({ id: prop.id, content: '', created_at: new Date() });
  const [position, setPosition] = React.useState<[number, number]>([0, 0]);
  const [grapPosition, setGrapPosition] = React.useState<[number, number] | null>(null);
  const [focused, setFocused] = React.useState(true);
  const [angle] = React.useState(Math.trunc(Math.random() * 12 - 6));

  const handlePinClick = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
      prop.onDelete(data.id);
    }
  };
  const handlePinDoubleClick = (e: React.MouseEvent) => {
    if (!grapPosition) return;
    const [x, y] = position;
    setFocused(true);
    setGrapPosition([e.clientX - x, e.clientY - y]);
  };
  const handleKeydown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.keyCode === 13) {
      setFocused(false);
    }
  };
  const handleInput = (e: React.FormEvent) => {
    const target: HTMLDivElement = e.target as HTMLDivElement;
    setData({ ...data, content: target.innerText })
  };
  const eventInit = () => {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!grapPosition || !focused) return;
      const [grapX, grapY] = grapPosition;
      const x = e.clientX - grapX;
      const y = e.clientY - grapY;
      setPosition([x, y]);
    });

    window.addEventListener('click', () => {
      if (!grapPosition) return;
      setGrapPosition(null);
    });
  };

  React.useEffect(() => {
    eventInit();
    if (innerElemRef && innerElemRef.current) {
      innerElemRef.current.focus();
    }
  });

  return (
    <div
      className={'todo-item' + (focused ? ' todo-item--zoom-in' : '')}
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
      <div
        className="todo-item__inner"
        ref={innerElemRef}
        onKeyDown={handleKeydown}
        onInput={handleInput}
        contentEditable={focused ? 'true' : 'false'}
      ></div>
    </div>
  );
}
