import type { ToastKind } from "@components/ui/status-toast";

export type ApiResponseLike = {
  status?: number;
  ok?: boolean;
  error?: string;
  message?: string;
};

export function getResponseToast(response: ApiResponseLike) {
  const status = response.status ?? 0;

  if (status >= 200 && status < 300) {
    return {
      kind: "success" as ToastKind,
      title: "Success",
      statusCode: status,
      message: response.message ?? "Your request was completed.",
    };
  }

  if (status === 401 || status === 403) {
    return {
      kind: "error" as ToastKind,
      title: "Authentication required",
      statusCode: status,
      message: response.error ?? "Please sign in and try again.",
    };
  }

  if (status === 409) {
    return {
      kind: "warning" as ToastKind,
      title: "Already exists",
      statusCode: status,
      message: response.error ?? "That account or item already exists.",
    };
  }

  if (status === 422) {
    return {
      kind: "warning" as ToastKind,
      title: "Check your details",
      statusCode: status,
      message: response.error ?? "Some submitted information is invalid.",
    };
  }

  if (status === 429) {
    return {
      kind: "warning" as ToastKind,
      title: "Please wait",
      statusCode: status,
      message: response.error ?? "Too many requests. Try again shortly.",
    };
  }

  if (status >= 400 && status < 500) {
    return {
      kind: "warning" as ToastKind,
      title: "Request not completed",
      statusCode: status,
      message: response.error ?? "Check your information and try again.",
    };
  }

  if (status >= 500) {
    return {
      kind: "error" as ToastKind,
      title: "Service unavailable",
      statusCode: status,
      message: response.error ?? "Please try again in a moment.",
    };
  }

  return {
    kind: "error" as ToastKind,
    title: "Network error",
    message: response.error ?? "Could not reach the server.",
  };
}