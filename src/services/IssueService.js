// Get issues from localStorage
const getStoredIssues = () => {
  let data = JSON.parse(localStorage.getItem("issues"));

  // If no data, insert demo data
  if (!data || data.length === 0) {
    data = [
      {
        id: 1,
        category: "Water",
        location: "Ward 3",
        description: "Water leakage near main road",
        status: "Pending",
        userEmail: "user1@gmail.com",
      },
      {
        id: 2,
        category: "Road",
        location: "Sector 12",
        description: "Potholes causing traffic",
        status: "Resolved",
        userEmail: "user2@gmail.com",
      },
      {
        id: 3,
        category: "Electricity",
        location: "Ward 7",
        description: "Street lights not working",
        status: "Pending",
        userEmail: "user1@gmail.com",
      },
      {
        id: 4,
        category: "Waste",
        location: "Sector 5",
        description: "Garbage not collected",
        status: "Resolved",
        userEmail: "user3@gmail.com",
      },
      {
        id: 5,
        category: "Water",
        location: "Ward 9",
        description: "Low water pressure",
        status: "Resolved",
        userEmail: "user2@gmail.com",
      },
    ];

    localStorage.setItem("issues", JSON.stringify(data));
  }

  return data;
};

// Save issues
const saveIssues = (issues) => {
  localStorage.setItem("issues", JSON.stringify(issues));
};

// Submit issue
export const submitIssue = async (issue, userEmail) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const issues = getStoredIssues();

      const newIssue = {
        id: Date.now(),
        status: "Pending",
        userEmail,
        ...issue,
      };

      issues.push(newIssue);

      saveIssues(issues);

      resolve("Issue Submitted");
    }, 300);
  });
};

// Get all issues
export const getAllIssues = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredIssues());
    }, 300);
  });
};

// Get user issues
export const getUserIssues = async (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const issues = getStoredIssues();

      resolve(
        issues.filter((i) => i.userEmail === email)
      );
    }, 300);
  });
};