const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2026";

const resolveFileUrl = (value) => {
  const rawUrl = String(value || "").trim();

  if (!rawUrl) {
    return "";
  }

  if (/^(https?:|data:|blob:)/i.test(rawUrl)) {
    return rawUrl;
  }

  return `${API_BASE_URL}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
};

// Normalize issue data from backend response
const normalizeIssue = (issue = {}) => {
  const attachmentUrl = resolveFileUrl(
    issue.attachmentUrl ||
    issue.fileUrl ||
    issue.imageUrl ||
    issue.photoUrl ||
    issue.attachmentPath ||
    issue.filePath ||
    issue.imagePath ||
    issue.photoPath
  );
  const attachmentName =
    issue.attachmentName ||
    issue.fileName ||
    issue.imageName ||
    issue.photoName ||
    (attachmentUrl ? attachmentUrl.split("/").pop() : "");
  const attachmentType =
    issue.attachmentType ||
    issue.fileType ||
    issue.imageType ||
    issue.contentType ||
    "";

  return {
    id: issue.id || issue.issueId,
    description: issue.description || issue.title || "",
    category: issue.category || issue.issueCategory || "",
    location: issue.location || issue.address || "",
    status: issue.status || issue.issueStatus || "Pending",
    user: issue.user || issue.reporter || null,
    userId: issue.user?.id || issue.userId || issue.user_id || issue.userEmail || issue.email || "",
    userName: issue.user?.name || issue.userName || issue.name || "",
    userEmail: issue.user?.email || issue.userEmail || issue.email || issue.userId || "",
    createdAt: issue.createdAt || issue.created_at || "",
    attachmentUrl,
    attachmentName,
    attachmentType,
  };
};

// Submit issue (supports optional file upload via multipart/form-data)
import apiClient from "./apiClient";

export const submitIssue = async (issue, userId, file) => {
  try {
    const form = new FormData();
    form.append("category", issue.category || "");
    form.append("location", issue.location || "");
    form.append("description", issue.description || "");
    // backend expects userId as a form field
    form.append("userId", userId || "");

    if (file) {
      form.append("file", file);
    }

    const response = await apiClient.post("/issuesapi", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    // Normalize axios error
    const msg = error?.response?.data?.message || error.message || "Failed to submit issue";
    throw new Error(msg);
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
    const issues = Array.isArray(data) ? data : data?.data || data?.issues || [];
    return issues.map(normalizeIssue);
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
    const issues = Array.isArray(data) ? data : data?.data || data?.issues || [];
    return issues.map(normalizeIssue);
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
