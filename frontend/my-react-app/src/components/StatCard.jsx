// One box on the dashboard showing a single number.
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-5">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-red-900">{value}</p>
    </div>
  );
}

export default StatCard;
