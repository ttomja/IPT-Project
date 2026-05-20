export function saveSession(sessionData) {
  localStorage.setItem("ims_token", sessionData.token);
  localStorage.setItem("ims_user", JSON.stringify(sessionData.user));
}

export function getUser() {
  const user = localStorage.getItem("ims_user");
  return user ? JSON.parse(user) : null;
}

export function getToken() {
  return localStorage.getItem("ims_token");
}

export function isLoggedIn() {
  return Boolean(getUser());
}

export function logout() {
  localStorage.removeItem("ims_user");
  localStorage.removeItem("ims_token");
}
