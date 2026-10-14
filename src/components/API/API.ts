const API_URL = "https://api.ervi-group.com/api";
// const API_URL = "http://localhost:4000/api";

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Server error");
  }

  return res.json();
};

const getCsrfToken = (): string | null => {
  const match = document.cookie.match(/(?:^|; )csrfToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const fetchWithRefresh = async (input: string, init?: RequestInit, retry = true): Promise<any> => {
  const method = (init?.method || "GET").toUpperCase();
  const headers = new Headers(init?.headers);

  if (method !== "GET" && method !== "HEAD") {
    const csrfToken = getCsrfToken();
    if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  }

  const res = await fetch(`${API_URL}${input}`, { ...init, headers, credentials: "include" });

  if (res.status === 401 && retry) {

    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      throw new Error("Not authenticated");
    }

    return fetchWithRefresh(input, init, false);
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    if (
      errorData.code === "PASSWORD_CHANGE_REQUIRED" &&
      !window.location.hash.includes("/change-password")
    ) {
      window.location.hash = "/change-password";
    }

    throw new Error(errorData.message || "Server error");
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/pdf")) {
    return res.blob();
  }

  return res.json();
};

export const createOrder = async (orderData: any) =>
  fetchWithRefresh("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

export const getOrderByTrackingNumber = async (trackingNumber: string) => {
  const res = await fetch(`${API_URL}/orders/${trackingNumber}`);

  return handleResponse(res);
};

export const sendContactMessage = async (data: {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  honeypot: string;
  gdpr: boolean;
}) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  
  return handleResponse(res);
};

export const checkAuth = async () => {
  try {
    const res = await fetchWithRefresh(`/auth/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return res;
  } catch {
    return null;
  }
};

export const getOrders = async () => fetchWithRefresh("/orders", { method: "GET" });

export const getOrderCounts = async (): Promise<Record<string, number>> =>
  fetchWithRefresh("/orders/counts", { method: "GET" });

export const changeOrderStatus = async (
  id: string,
  status: "accepted" | "sent" | "paid" | "cancelled" | "delivered",
  date?: string | null
) => {
  return fetchWithRefresh(`/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, date }),
  });
};

export const deleteOrder = async (id: string) => {
  return fetchWithRefresh(`/orders/${id}`, { method: "DELETE" });
};

export const generateAndSendPdf = async (id: string) => {
  return fetchWithRefresh(`/orders/${id}/pdf`, { method: "GET" });
};

export const generateOrderDocument = async (id: string) => {
  return fetchWithRefresh(`/orders/${id}/doc`, { method: "GET" });
};

export const generateDayOrdersDocument = async (ids: string[], date: string) => {
  const params = new URLSearchParams({ ids: ids.join(","), date });
  return fetchWithRefresh(`/orders/day-doc?${params.toString()}`, { method: "GET" });
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  return fetchWithRefresh("/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
};

export const logout = async () => {
  return fetchWithRefresh("/auth/logout", { method: "POST" });
};

export const fetchAvailableSlots = async (company: string, date: string) =>
  fetchWithRefresh(
    `/orders/timeslots?company=${encodeURIComponent(company)}&date=${encodeURIComponent(date)}`,
    { method: "GET" }
  );

// ─── Documents ────────────────────────────────────────────────────────────────

export const getDocuments = async () =>
  fetchWithRefresh("/documents", { method: "GET" });

export const getDocumentPresignedUrl = async (id: string): Promise<{ url: string }> =>
  fetchWithRefresh(`/documents/${id}/presigned`, { method: "GET" });

export const uploadDocumentFile = async (file: File): Promise<{
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
}> => {
  const body = new FormData();
  body.append("file", file);
  // no Content-Type header — browser sets it automatically with boundary for multipart
  return fetchWithRefresh("/documents/upload", { method: "POST", body });
};

export const createDocument = async (data: {
  name: string;
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  sumWithDph: number;
  sumWithoutDph: number;
  date: string;
  dueDate?: string;
  isPaid?: boolean;
  note?: string;
}) =>
  fetchWithRefresh("/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteDocument = async (id: string) =>
  fetchWithRefresh(`/documents/${id}`, { method: "DELETE" });

export const toggleDocumentPaid = async (id: string, isPaid: boolean) =>
  fetchWithRefresh(`/documents/${id}/paid`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPaid }),
  });

export const toggleDocumentVisibility = async (id: string, visibleToAccountant: boolean) =>
  fetchWithRefresh(`/documents/${id}/visibility`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visibleToAccountant }),
  });

// ─── Users (admin only) ───────────────────────────────────────────────────────

export const getUsers = async () => fetchWithRefresh("/auth/users", { method: "GET" });

export const createUser = async (data: {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'accountant' | 'company';
  companyId?: string;
}) =>
  fetchWithRefresh("/auth/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const resetUserPassword = async (id: string) =>
  fetchWithRefresh(`/auth/users/${id}/reset-password`, { method: "POST" });

export const deleteUser = async (id: string) =>
  fetchWithRefresh(`/auth/users/${id}`, { method: "DELETE" });

// ─── Companies (admin only) ───────────────────────────────────────────────────

export type Company = {
  id: string;
  slug: string;
  name: string;
  street: string;
  psc: string;
  city: string;
  country: string;
  email: string;
  phone: string;
};

export const getCompanies = async (): Promise<Company[]> =>
  fetchWithRefresh("/companies", { method: "GET" });

export const createCompany = async (data: {
  name: string;
  street?: string;
  psc?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
}): Promise<Company> =>
  fetchWithRefresh("/companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const mergePrintDocuments = async (ids: string[]): Promise<Blob> =>
  fetchWithRefresh("/documents/merge-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

// ─── Reviews ──────────────────────────────────────────────────────────────────

export type Review = {
  id: string;
  name: string;
  company: string | null;
  rating: number;
  message: string;
  approved?: boolean;
  createdAt: string;
};

export const submitReview = async (data: {
  name: string;
  company: string;
  rating: number;
  message: string;
  honeypot: string;
  gdprConsent: boolean;
}) => {
  const res = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

export const getApprovedReviews = async (): Promise<Review[]> => {
  const res = await fetch(`${API_URL}/reviews/public`);
  return handleResponse(res);
};

export const getAllReviews = async (): Promise<Review[]> =>
  fetchWithRefresh("/reviews", { method: "GET" });

export const setReviewApproved = async (id: string, approved: boolean) =>
  fetchWithRefresh(`/reviews/${id}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approved }),
  });

export const deleteReview = async (id: string) =>
  fetchWithRefresh(`/reviews/${id}`, { method: "DELETE" });

