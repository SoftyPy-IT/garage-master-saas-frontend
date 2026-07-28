export function getReturnPath(location) {
  if (!location) return null;
  return `${location.pathname}${location.search}`;
}

export function getReturnTo(location) {
  return location?.state?.returnTo || null;
}

export function withReturnTo(returnTo) {
  return returnTo ? { returnTo } : undefined;
}

export function getProfileParams(search) {
  const params =
    typeof search === "string" ? new URLSearchParams(search) : search;

  return {
    userType: params.get("user_type"),
    userId: params.get("user"),
  };
}

export function appendProfileParams(url, userType, userId) {
  if (!userType || !userId) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}user_type=${encodeURIComponent(userType)}&user=${encodeURIComponent(userId)}`;
}

export function buildViewUrl(basePath, itemId, userType, userId) {
  return appendProfileParams(`${basePath}?id=${itemId}`, userType, userId);
}

export function buildEditUrl(basePath, itemId, search = "") {
  const { userType, userId } = getProfileParams(search);
  return appendProfileParams(`${basePath}?id=${itemId}`, userType, userId);
}

export function getProfilePath(userType, userId) {
  if (!userType || !userId) return null;

  const paths = {
    customer: `/dashboard/customer-profile?id=${userId}`,
    company: `/dashboard/company-profile?id=${userId}`,
    showRoom: `/dashboard/show-room-profile?id=${userId}`,
  };

  return paths[userType] || null;
}

export function navigateWithReturnTo(navigate, path, returnTo, extraState = {}) {
  const state = returnTo ? { returnTo, ...extraState } : extraState;
  navigate(path, Object.keys(state).length ? { state } : undefined);
}

export function navigateAfterSave(
  navigate,
  location,
  { userType, userId, defaultPath },
) {
  const returnTo = getReturnTo(location);
  if (returnTo) {
    navigate(returnTo);
    return;
  }

  navigate(getProfilePath(userType, userId) || defaultPath);
}

export function navigateAfterProfileEdit(navigate, userType, userId, listPath) {
  navigate(getProfilePath(userType, userId) || listPath);
}
