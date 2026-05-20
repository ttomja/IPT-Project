export const temporaryLoginUser = async (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        resolve({
          token: "fake-admin-token",
          user: { fullName: "Admin User", username: "admin", role: "Administrator" }
        });
      } else if (username === "staff" && password === "staff123") {
        resolve({
          token: "fake-staff-token",
          user: { fullName: "Staff Member", username: "staff", role: "Staff" }
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

export const saveSession = (token, user) => {
  localStorage.setItem("ims_token", token);
  localStorage.setItem("ims_user", JSON.stringify(user));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("ims_user");
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem("ims_token");
  localStorage.removeItem("ims_user");
};
