export default function ColoredConnector({ color = "#999" }) {
    return (
        <div className="relative flex justify-center">
            <svg width="60" height="40">
                <line
                    x1="30"
                    y1="0"
                    x2="30"
                    y2="40"
                    stroke={color}
                    strokeWidth="4"
                />
            </svg>
        </div>
    );
}
