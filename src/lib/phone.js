/**
 * API phone values can carry invisible Unicode direction marks
 * (e.g. ‪ / ‬) that break tel: and wa.me links — strip
 * everything except digits and a leading +.
 */
export const cleanPhone = (p) =>
  String(p || "").replace(/[^\d+]/g, "");

export const waLink = (phone, propertyName) => {
  const digits = cleanPhone(phone).replace(/\D/g, "");
  const text = encodeURIComponent(
    `Hi, I am interested in ${propertyName || "your property"}. Please share details.`
  );
  return `https://wa.me/${digits}?text=${text}`;
};
