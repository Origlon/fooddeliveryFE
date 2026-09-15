export function sanitizeUser(value) {
  if (
    !value ||
    typeof value !== "object" ||
    typeof value._id !== "string" ||
    !value._id ||
    typeof value.email !== "string" ||
    !value.email ||
    !["user", "admin"].includes(value.role)
  ) {
    return null;
  }

  return {
    _id: value._id,
    email: value.email,
    role: value.role,
  };
}