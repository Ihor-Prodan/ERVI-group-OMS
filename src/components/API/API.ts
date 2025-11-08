const API_URL = "https://api.ervi-group.com/api";
// const API_URL = "http://localhost:4000/api";

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Server error");
  }

  return res.json();
};

const fetchWithRefresh = async (input: string, init?: RequestInit, retry = true): Promise<any> => {
  const res = await fetch(`${API_URL}${input}`, { ...init, credentials: "include" });

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

    throw new Error(errorData.message || "Server error");
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/pdf")) {
    return res.blob();
  }

  return res.json();
};

export const createOrder = async (orderData: any) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  return handleResponse(res);
};

export const getOrderByTrackingNumber = async (trackingNumber: string) => {
  const res = await fetch(`${API_URL}/orders/${trackingNumber}`);

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

export const changeOrderStatus = async (
  id: string,
  status: "sent" | "paid" | "cancelled" | "delivered",
  date?: string
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

