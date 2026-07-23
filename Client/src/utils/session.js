export const getGuestSessionId = () => {
  let guestId = localStorage.getItem('guest_cart_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('guest_cart_id', guestId);
  }
  return guestId;
};