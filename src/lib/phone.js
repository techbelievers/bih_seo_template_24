/**
 * API phone values can carry invisible Unicode direction marks
 * (e.g. ‪ / ‬) that break tel: and wa.me links — strip
 * everything except digits and a leading +.
 */
export const cleanPhone = (p) =>
  String(p || "").replace(/[^\d+]/g, "");

/**
 * Validate an enquiry phone number that carries its country dialling code
 * (the format react-phone-input-2 emits, e.g. "919876543210"). Known
 * countries are length-checked against their national number; anything else
 * falls back to a sane 8–15 digit range so we never block a real lead.
 */
const PHONE_RULES = {
  91: 10, // India
  971: 9, // UAE
  1: 10, // US / Canada
  44: 10, // UK
  61: 9, // Australia
};

export const isValidPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  for (const code of Object.keys(PHONE_RULES)) {
    if (digits.startsWith(code))
      return digits.slice(code.length).length === PHONE_RULES[code];
  }
  return digits.length >= 8 && digits.length <= 15;
};

export const waLink = (phone, propertyName) => {
  const digits = cleanPhone(phone).replace(/\D/g, "");
  const text = encodeURIComponent(
    `Hi, I am interested in ${propertyName || "your property"}. Please share details.`
  );
  return `https://wa.me/${digits}?text=${text}`;
};
