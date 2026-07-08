import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Phone, User, Mail, MessageSquare, Send, Loader2, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import useApi from "../hooks/useApi";
import { postEnquiry } from "../lib/api";

const inputBase =
  "w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink placeholder:text-mist focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition";

const EnquiryDialog = ({ intent, onClose }) => {
  const navigate = useNavigate();
  const { data: header } = useApi("header");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [serverError, setServerError] = useState("");

  // Lock background scroll + close on Escape
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const set = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: null }));
  };

  const validate = () => {
    const er = {};
    if (!form.first_name.trim()) er.first_name = "First name is required";
    if (!form.last_name.trim()) er.last_name = "Last name is required";
    if (!form.phone_number.trim()) er.phone_number = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phone_number.trim()))
      er.phone_number = "Enter a valid 10-digit number";
    return er;
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validate();
    if (Object.keys(er).length) return setErrors(er);
    setSubmitting(true);
    setStatus(null);
    try {
      await postEnquiry({ ...form, message: form.message || intent });
      setStatus("success");
      setTimeout(() => {
        onClose();
        navigate("/thank-you");
      }, 900);
    } catch (err) {
      setStatus("error");
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Enquiry form"
    >
      <div className="animate-fade-up w-full max-w-lg overflow-hidden rounded-t-3xl bg-cream shadow-deep sm:rounded-3xl">
        {/* Header */}
        <div className="relative bg-ink px-6 pb-6 pt-7 text-center">
          <button
            onClick={onClose}
            aria-label="Close enquiry form"
            className="absolute right-4 top-4 rounded-full p-2 text-mist transition hover:bg-white/10 hover:text-ivory"
          >
            <X size={20} />
          </button>
          {header?.logo && (
            <img
              src={header.logo}
              alt={header?.property_name || "Logo"}
              className="mx-auto mb-3 h-10 object-contain"
              loading="lazy"
              decoding="async"
            />
          )}
          <h2 className="font-display text-2xl font-semibold text-ivory">
            {intent || "Enquire Now"}
          </h2>
          <p className="mt-1 text-sm text-mist">
            {header?.property_name
              ? `${header.property_name} — our team responds within minutes`
              : "Our team responds within minutes"}
          </p>
        </div>

        {/* Body */}
        <form onSubmit={submit} className="space-y-4 p-6" noValidate>
          {status === "success" && (
            <p className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 p-3 text-sm font-medium text-gold-deep">
              <CheckCircle2 size={17} /> Thank you! Redirecting…
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-600">
              <AlertCircle size={17} /> {serverError}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {["first_name", "last_name"].map((field) => (
              <div key={field}>
                <div className="relative">
                  <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-deep" />
                  <input
                    name={field}
                    value={form[field]}
                    onChange={set}
                    placeholder={field === "first_name" ? "First name*" : "Last name*"}
                    autoComplete={field === "first_name" ? "given-name" : "family-name"}
                    className={`${inputBase} pl-10 ${errors[field] ? "border-red-400" : ""}`}
                  />
                </div>
                {errors[field] && (
                  <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="relative">
              <Phone size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-deep" />
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={set}
                placeholder="10-digit mobile number*"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                className={`${inputBase} pl-10 ${errors.phone_number ? "border-red-400" : ""}`}
              />
            </div>
            {errors.phone_number && (
              <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>
            )}
          </div>

          <div className="relative">
            <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-deep" />
            <input
              type="email"
              name="email_id"
              value={form.email_id}
              onChange={set}
              placeholder="Email (optional)"
              autoComplete="email"
              className={`${inputBase} pl-10`}
            />
          </div>

          <div className="relative">
            <MessageSquare size={15} className="pointer-events-none absolute left-3.5 top-4 text-gold-deep" />
            <textarea
              name="message"
              rows="2"
              value={form.message}
              onChange={set}
              placeholder="Message (optional)"
              className={`${inputBase} resize-none pl-10`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold w-full disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send size={17} /> Request Details
              </>
            )}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-stone">
            <ShieldCheck size={13} className="text-gold-deep" />
            100% privacy — your details are never shared
          </p>
        </form>
      </div>
    </div>
  );
};

export default EnquiryDialog;
