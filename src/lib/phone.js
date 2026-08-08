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
// National-number digit-length range [min, max] keyed by country calling code.
// The longest matching calling-code prefix wins, so ambiguous leading digits
// resolve correctly. Covers common countries; unknown codes fall back to a
// sane 8-15 digit range so a genuine lead is never blocked.
const PHONE_RULES = {
  "1":[10,10],"7":[10,10],"20":[9,10],"27":[9,9],"30":[10,10],"31":[9,9],"32":[8,9],
  "33":[9,9],"34":[9,9],"36":[8,9],"39":[9,11],"40":[9,9],"41":[9,9],"43":[10,13],
  "44":[9,10],"45":[8,8],"46":[7,9],"47":[8,8],"48":[9,9],"49":[10,11],"51":[9,9],
  "52":[10,10],"53":[8,8],"54":[10,11],"55":[10,11],"56":[9,9],"57":[10,10],"58":[10,10],
  "60":[7,9],"61":[9,9],"62":[9,11],"63":[10,10],"64":[8,10],"65":[8,8],"66":[9,9],
  "81":[10,10],"82":[9,10],"84":[9,10],"86":[11,11],"90":[10,10],"91":[10,10],"92":[10,10],
  "93":[9,9],"94":[9,9],"95":[8,10],"98":[10,10],"212":[9,9],"213":[9,9],"216":[8,8],
  "218":[9,9],"220":[7,7],"233":[9,9],"234":[8,10],"249":[9,9],"251":[9,9],"254":[9,9],
  "255":[9,9],"256":[9,9],"260":[9,9],"263":[9,9],"264":[9,9],"351":[9,9],"352":[9,9],
  "353":[9,9],"354":[7,9],"355":[9,9],"356":[8,8],"357":[8,8],"358":[9,10],"359":[8,9],
  "370":[8,8],"371":[8,8],"372":[7,8],"373":[8,8],"374":[8,8],"375":[9,9],"377":[8,9],
  "380":[9,9],"381":[8,9],"382":[8,8],"385":[8,9],"386":[8,8],"387":[8,8],"389":[8,8],
  "420":[9,9],"421":[9,9],"852":[8,8],"853":[8,8],"855":[8,9],"856":[9,10],"880":[10,10],
  "886":[9,9],"960":[7,7],"961":[7,8],"962":[9,9],"963":[9,9],"964":[10,10],"965":[8,8],
  "966":[9,9],"967":[9,9],"968":[8,8],"970":[9,9],"971":[9,9],"972":[9,9],"973":[8,8],
  "974":[8,8],"975":[8,8],"976":[8,8],"977":[10,10],"992":[9,9],"993":[8,8],"994":[9,9],
  "995":[9,9],"998":[9,9],
};

export const isValidPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return false;
  // Longest calling-code prefix wins (codes are 1-3 digits).
  for (let len = 3; len >= 1; len--) {
    const rule = PHONE_RULES[digits.slice(0, len)];
    if (rule) {
      const nat = digits.length - len;
      return nat >= rule[0] && nat <= rule[1];
    }
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
