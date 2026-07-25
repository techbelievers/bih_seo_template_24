import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/**
 * Country-code phone input, themed with the template's design tokens.
 * `dark` switches between the cream dialog card and the ink contact card.
 * The value it emits carries the dialling code (e.g. "919876543210"),
 * validated by isValidPhone() in ../lib/phone.
 */
const THEME = {
  light: {
    bg: "#fdfcf8", // --color-cream
    text: "#14110c", // --color-ink
    border: "#e8e2d3", // --color-line
  },
  dark: {
    bg: "#14110c", // --color-ink
    text: "#f7f4ec", // --color-ivory
    border: "#35301f", // --color-line-dark
  },
};

const GOLD = "#c2a05e"; // --color-gold
const ERROR = "#f87171"; // red-400

const PhoneField = ({ value, onChange, dark = false, invalid = false }) => {
  const t = dark ? THEME.dark : THEME.light;
  const borderColor = invalid ? ERROR : t.border;

  return (
    <PhoneInput
      country="in"
      value={value}
      onChange={onChange}
      countryCodeEditable={false}
      enableSearch
      specialLabel=""
      inputProps={{ name: "phone_number", required: true }}
      containerStyle={{ width: "100%" }}
      inputStyle={{
        width: "100%",
        height: "auto",
        padding: "0.75rem 0.75rem 0.75rem 3.25rem",
        fontSize: "0.875rem",
        color: t.text,
        background: t.bg,
        border: `1px solid ${borderColor}`,
        borderRadius: "0.75rem",
        boxShadow: "none",
      }}
      buttonStyle={{
        background: t.bg,
        border: `1px solid ${borderColor}`,
        borderRight: "none",
        borderTopLeftRadius: "0.75rem",
        borderBottomLeftRadius: "0.75rem",
      }}
      dropdownStyle={{
        background: t.bg,
        color: t.text,
        borderRadius: "0.5rem",
      }}
      searchStyle={{
        margin: "0.25rem",
        width: "calc(100% - 0.5rem)",
        background: t.bg,
        color: t.text,
        border: `1px solid ${t.border}`,
        borderRadius: "0.375rem",
      }}
    />
  );
};

export default PhoneField;
