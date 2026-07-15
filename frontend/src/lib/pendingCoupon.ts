const STORAGE_KEY = "anandi_pending_coupon";

export function setPendingCoupon(code: string) {
  localStorage.setItem(STORAGE_KEY, code);
}

export function getPendingCoupon(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function clearPendingCoupon() {
  localStorage.removeItem(STORAGE_KEY);
}
