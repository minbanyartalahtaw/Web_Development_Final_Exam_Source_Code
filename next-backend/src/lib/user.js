// src/lib/user.js

// Never send the password hash back to the client
export function toPublicUser(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };
}
