interface cursorPinProps {
  x: number;
  y: number;
  visible: boolean;
}

export default function CursorPin({ x, y, visible }: cursorPinProps): JSX.Element {
  let className = 'push-pin';
  if (visible) className += ' push-pin--active';
  return <div className={className} style={{ left: x + 'px', top: y + 'px' }}></div>;
}
