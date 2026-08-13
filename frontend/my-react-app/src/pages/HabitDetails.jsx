import { useParams } from "react-router-dom";

function HabitDetails() {
  // useParams reads the ":id" part out of the URL.
  // For the URL /habits/123 it gives us { id: "123" }.
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-900 mb-6">Habit Details</h1>

      <p className="text-gray-600">Details for habit ID: {id}</p>
    </div>
  );
}

export default HabitDetails;
