import useAuthUser from "../hooks/useAuthUser";

function Profile() {
  const user = useAuthUser();

  // If we could not read the token, ask the user to log in again.
  if (!user) {
    return (
      <p className="text-red-900">
        We could not read your account details. Please log in again.
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-900 mb-6">Profile</h1>

      <div className="bg-white rounded-2xl p-6 max-w-md">
        <p className="mb-3">
          <span className="font-semibold text-red-900">Name: </span>
          {user.name}
        </p>

        <p className="mb-3">
          <span className="font-semibold text-red-900">Email: </span>
          {user.email}
        </p>

        <p className="text-sm text-gray-500 break-all">
          <span className="font-semibold">User ID: </span>
          {user.id}
        </p>
      </div>
    </div>
  );
}

export default Profile;
