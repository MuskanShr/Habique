// Shown when there is nothing to display yet.
// "message" is the text, "action" is an optional button.
function EmptyState({ message, action }) {
  return (
    <div className="bg-white rounded-2xl p-10 text-center">
      <p className="text-gray-600 mb-4">{message}</p>
      {action}
    </div>
  );
}

export default EmptyState;
