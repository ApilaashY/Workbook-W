import "./ProgressIndicator.css";

export default function ProgressIndicator({ value }: { value: number }) {
  // Clamp value between 0 and 100
  value = Math.min(100, Math.max(0, value * 100));

  return (
    <div className="progress-indicator">
      <div className="progress" style={{ width: `${value}%` }}></div>
    </div>
  );
}
