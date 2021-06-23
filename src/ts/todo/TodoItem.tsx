import * as React from 'react';

interface TodoItemProp {
  id: number;
  x: number;
  y: number;
  isFocused: Boolean;
  onDelete: () => void;
  onFocus: (value: Boolean) => void;
}

export default function TodoItem(prop: TodoItemProp): JSX.Element {
  const innerElemRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = React.useState({ id: prop.id, content: '', created_at: new Date() });
  const [position, setPosition] = React.useState<[number, number]>([prop.x, prop.y]);
  const [grapPosition, setGrapPosition] = React.useState<[number, number] | null>(null);
  const [angle] = React.useState(Math.trunc(Math.random() * 12 - 6));

  const grapPositionRef = React.useRef<[number, number] | null>(null)
  grapPositionRef.current = grapPosition;

  const handlePinClick = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
      prop.onDelete();
    }
  };
  const handlePinDoubleClick = (e: React.MouseEvent) => {
    if (grapPositionRef.current) return;
    const [x, y] = position;
    prop.onFocus(true);
    setGrapPosition([e.clientX - x, e.clientY - y]);
  };
  const handleKeydown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.keyCode === 13) {
      prop.onFocus(false);
    }
  };
  const handleInput = (e: React.FormEvent) => {
    const target: HTMLDivElement = e.target as HTMLDivElement;
    setData({ ...data, content: target.innerText })
  };
  const eventInit = () => {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!grapPositionRef.current || !prop.isFocused) return;
      const [grapX, grapY] = grapPositionRef.current;
      const x = e.clientX - grapX;
      const y = e.clientY - grapY;
      setPosition([x, y]);
    });

    window.addEventListener('click', () => {
      if (!grapPositionRef.current) return;
      setGrapPosition(null);
    });
  };

  React.useEffect(() => {
    eventInit();
    if (innerElemRef && innerElemRef.current) {
      innerElemRef.current.focus();
    }
  }, []);

  return (
    <div
      className={'todo-item' + (prop.isFocused ? ' todo-item--zoom-in' : '')}
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
        contentEditable={prop.isFocused ? 'true' : 'false'}
      ></div>
    </div>
  );
}
