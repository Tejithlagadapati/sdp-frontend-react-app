const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2026";

// Submit issue
export const submitIssue = async (issue, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/issuesapi?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issue),
    });

    if (!response.ok) {
      throw new Error("Failed to submit issue");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Get all issues (Admin)
export const getAllIssues = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/adminapi/issues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch issues");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Get user issues
export const getUserIssues = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/issuesapi/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user issues");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Update issue status (Admin)
export const updateIssueStatus = async (issueId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/adminapi/issues/${issueId}/status?status=${status}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update issue status");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};