import { useState } from "react";

function HabitForm({ habit, onSubmit, onCancel, isBusy, submitLabel }) {
  const [name, setName] = useState(habit ? habit.name : "");
  const [description, setDescription] = useState(
    habit ? habit.description : "",
  );
  const [category, setCategory] = useState(habit ? habit.category : "General");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a habit name.");
      return;
    }

    // Hand the values back to the page that is using this form.
    onSubmit({
      name: name,
      description: description,
      category: category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 mb-6">
      <label className="block text-sm font-semibold text-red-900 mb-1">
        Habit name
      </label>
      <input
        className="w-full border rounded-lg px-4 py-3 mb-4"
        type="text"
        placeholder="e.g. Drink Water"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="block text-sm font-semibold text-red-900 mb-1">
        Description
      </label>
      <input
        className="w-full border rounded-lg px-4 py-3 mb-4"
        type="text"
        placeholder="e.g. Drink 8 glasses a day"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="block text-sm font-semibold text-red-900 mb-1">
        Category
      </label>
      <select
        className="w-full border rounded-lg px-4 py-3 mb-4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="General">General</option>
        <option value="Health">Health</option>
        <option value="Fitness">Fitness</option>
        <option value="Learning">Learning</option>
        <option value="Work">Work</option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isBusy}
          className="px-5 py-3 rounded-lg bg-amber-800 text-amber-50 hover:bg-amber-600 transition disabled:opacity-50"
        >
          {submitLabel}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default HabitForm;
