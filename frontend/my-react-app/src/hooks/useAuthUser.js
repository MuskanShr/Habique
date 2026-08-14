function useAuthUser() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    let payloadPart = token.split(".")[1];

    payloadPart = payloadPart.replace(/-/g, "+").replace(/_/g, "/");

    const payloadText = atob(payloadPart);
    const payload = JSON.parse(payloadText);

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
    };
  } catch (error) {
    return null;
  }
}

export default useAuthUser;
