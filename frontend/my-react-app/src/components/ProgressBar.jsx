// A simple bar that fills up to a percentage.
function ProgressBar({ percent }) {
  return (
    <div className="w-full h-3 bg-amber-100 rounded-full">
      <div
        className="h-3 bg-amber-800 rounded-full transition-all"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;
