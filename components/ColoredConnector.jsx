// components/ColoredConnector.jsx
export default function ColoredConnector({ color = "#999", height = 40, width = 4 }) {
  return (
    <div className="relative flex justify-center" style={{ height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <line
          x1={Math.floor(width / 2)}
          y1="0"
          x2={Math.floor(width / 2)}
          y2={height}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

