// This reads the logged-in user's details out of the JWT token.
//
// A JWT is three pieces joined by dots:   header.payload.signature
// The middle piece (payload) holds the data the backend put in it,
// which for us is { id, name, email }.
// It is encoded in base64, so we decode it and turn it into an object.

function useAuthUser() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    // Take the middle piece of the token.
    let payloadPart = token.split(".")[1];

    // JWTs use a slightly different base64 alphabet, so we swap
    // "-" and "_" back to the characters atob() expects.
    payloadPart = payloadPart.replace(/-/g, "+").replace(/_/g, "/");

    const payloadText = atob(payloadPart);
    const payload = JSON.parse(payloadText);

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
    };
  } catch (error) {
    // If the token is damaged or not a real JWT, treat it as no user.
    return null;
  }
}

export default useAuthUser;
