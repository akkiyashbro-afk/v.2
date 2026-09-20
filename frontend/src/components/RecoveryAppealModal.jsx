import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Trash2,
  Check,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PLATFORMS = [
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
  "X / Twitter",
  "LinkedIn",
  "Snapchat",
  "Threads",
  "Other",
];

const PROBLEM_TYPES = [
  "Account Takeover / Hacked",
  "Impersonation",
  "Locked out / Disabled",
  "Phishing Breach",
  "Content Removed",
  "Business Manager Breach",
  "Credential Leak",
  "Other",
];

const YES_NO = ["Yes", "No"];

const STEPS = [
  { key: "validating", label: "Validating information" },
  { key: "preparing", label: "Preparing recovery case" },
  { key: "uploading", label: "Uploading attachments" },
  { key: "sending", label: "Sending secure request" },
  { key: "done", label: "Appeal submitted successfully" },
];

const emailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const initialForm = {
  full_name: "",
  email: "",
  platform: "",
  username: "",
  followers: "",
  problem_type: "",
  since_when: "",
  already_submitted_appeal: "",
  can_login: "",
  additional_details: "",
};

const Label = ({ children, required }) => (
  <label className="block text-[10px] uppercase tracking-[0.24em] text-white/50 font-body font-medium mb-2">
    {children}
    {required && <span className="text-white/70 ml-1">*</span>}
  </label>
);

const inputClass =
  "w-full rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-white/30 focus:bg-white/[0.05] px-4 py-3 text-white text-[14px] font-body placeholder:text-white/25 outline-none transition-colors";

const errorClass = "text-[11px] text-[#EF4444] mt-1.5 font-body";

export const RecoveryAppealModal = ({ open, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [stepIdx, setStepIdx] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");
  const [caseId, setCaseId] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, submitting]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setForm(initialForm);
        setFiles([]);
        setErrors({});
        setSubmitting(false);
        setStepIdx(-1);
        setErrorMessage("");
        setCaseId(null);
      }, 300);
    }
  }, [open]);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!emailValid(form.email)) e.email = "Invalid email";
    if (!form.platform) e.platform = "Required";
    if (!form.username.trim()) e.username = "Required";
    if (!form.followers.trim()) e.followers = "Required";
    if (!form.problem_type) e.problem_type = "Required";
    if (!form.since_when.trim()) e.since_when = "Required";
    if (!form.already_submitted_appeal) e.already_submitted_appeal = "Required";
    if (!form.can_login) e.can_login = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFiles = (fl) => {
    const arr = Array.from(fl || []);
    const filtered = arr.filter((f) => f.size <= 8 * 1024 * 1024); // 8MB per file
    setFiles((prev) => [...prev, ...filtered].slice(0, 6));
  };

  const removeFile = (i) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const submit = async () => {
    setErrorMessage("");
    if (!validate()) {
      return;
    }
    setSubmitting(true);
    setStepIdx(0);

    // Simulate step transitions
    const stepDelay = (ms) => new Promise((r) => setTimeout(r, ms));
    await stepDelay(700);
    setStepIdx(1);
    await stepDelay(700);
    setStepIdx(2);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach((f) => fd.append("screenshots", f));

    try {
      await stepDelay(500);
      setStepIdx(3);
      const res = await axios.post(`${API}/recovery/submit`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });
      setCaseId(res.data.case_id);
      await stepDelay(500);
      setStepIdx(4);
      setSubmitting(false);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(String(msg));
      setSubmitting(false);
      setStepIdx(-1);
    }
  };

  const canClose = Boolean(!submitting || stepIdx === 4 || errorMessage);

  const stepBadge = useMemo(() => {
    if (stepIdx < 0) return null;
    return STEPS.map((s, i) => ({
      ...s,
      state: i < stepIdx ? "done" : i === stepIdx ? "active" : "pending",
    }));
  }, [stepIdx]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="recovery-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Submit recovery appeal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={canClose ? onClose : undefined}
            className="absolute inset-0 bg-black/75 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl max-h-[92vh] rounded-3xl border border-white/[0.1] bg-[#0D0D0D]/90 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden font-body flex flex-col"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)",
              }}
            />

            {/* Header */}
            <div className="relative flex items-start justify-between px-6 sm:px-8 pt-7 pb-5 border-b border-white/[0.06]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1">
                  <ShieldCheck className="h-3 w-3 text-white/80" strokeWidth={2} />
                  <span className="text-[10px] uppercase tracking-[0.28em] text-white/70 font-medium">
                    Encrypted intake
                  </span>
                </span>
                <h2
                  className="mt-3 font-display font-black text-[22px] sm:text-[28px] leading-[1.05] text-white"
                  style={{ letterSpacing: "-0.03em" }}
                  data-testid="recovery-modal-title"
                >
                  Submit Recovery Appeal
                </h2>
                <p className="mt-1.5 text-white/50 text-[13px] font-body">
                  Tell us what happened. A recovery officer will respond via email.
                </p>
              </div>
              {canClose && (
                <button
                  data-testid="recovery-modal-close"
                  onClick={onClose}
                  className="h-9 w-9 grid place-items-center rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-white" strokeWidth={1.8} />
                </button>
              )}
            </div>

            {/* Content: form OR progress OR success */}
            <div className="relative overflow-y-auto flex-1">
              {/* SUCCESS STATE */}
              {stepIdx === 4 ? (
                <div
                  data-testid="recovery-success"
                  className="px-6 sm:px-10 py-12 sm:py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mx-auto h-16 w-16 rounded-full bg-white/[0.05] border border-white/20 flex items-center justify-center mb-6 relative"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full blur-2xl"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)",
                      }}
                    />
                    <Check className="relative h-7 w-7 text-white" strokeWidth={2.2} />
                  </motion.div>
                  <h3
                    className="font-display font-black text-[24px] sm:text-[30px] leading-[1.1] text-white"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    Appeal Submitted Successfully
                  </h3>
                  <p className="mt-4 text-white/55 max-w-md mx-auto text-[14px] leading-[1.7]">
                    Your recovery request has been received successfully. Our
                    recovery specialists will review your case and contact you via
                    email.
                  </p>
                  {caseId && (
                    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-1.5">
                      <span className="text-[9px] uppercase tracking-[0.28em] text-white/45">
                        Case ID
                      </span>
                      <span className="text-[11px] text-white/85 tracking-wider font-mono">
                        {caseId.slice(0, 8)}…{caseId.slice(-4)}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={onClose}
                    data-testid="recovery-success-close"
                    className="mt-10 group relative inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/[0.12] hover:border-white/35 px-6 py-3 text-[13px] font-medium text-white overflow-hidden transition-all"
                  >
                    <span className="relative">Close</span>
                  </button>
                </div>
              ) : submitting && stepIdx >= 0 ? (
                // SUBMIT LOADING SEQUENCE
                <div
                  data-testid="recovery-submitting"
                  className="px-6 sm:px-10 py-14 sm:py-20"
                >
                  <div className="max-w-md mx-auto">
                    <div className="text-center mb-10">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-white/45 font-medium">
                        Working
                      </div>
                      <h3
                        className="mt-2 font-display font-extrabold text-[22px] text-white"
                        style={{ letterSpacing: "-0.02em" }}
                      >
                        {STEPS[stepIdx].label}…
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {stepBadge?.map((s) => (
                        <motion.div
                          key={s.key}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4 }}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                            s.state === "done"
                              ? "border-white/15 bg-white/[0.04]"
                              : s.state === "active"
                              ? "border-white/25 bg-white/[0.06]"
                              : "border-white/[0.06] bg-white/[0.01]"
                          }`}
                        >
                          <span className="h-6 w-6 grid place-items-center rounded-full border border-white/15 bg-black/40">
                            {s.state === "done" ? (
                              <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                            ) : s.state === "active" ? (
                              <Loader2
                                className="h-3.5 w-3.5 text-white animate-spin"
                                strokeWidth={2}
                              />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                            )}
                          </span>
                          <span
                            className={`text-[13px] ${
                              s.state === "pending" ? "text-white/35" : "text-white/85"
                            }`}
                          >
                            {s.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // FORM
                <form
                  data-testid="recovery-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="px-6 sm:px-8 py-6 sm:py-8"
                  noValidate
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-1">
                      <Label required>Full Name</Label>
                      <input
                        data-testid="field-full_name"
                        className={inputClass}
                        placeholder="Amelia Chen"
                        value={form.full_name}
                        onChange={update("full_name")}
                      />
                      {errors.full_name && <div className={errorClass}>{errors.full_name}</div>}
                    </div>
                    <div className="sm:col-span-1">
                      <Label required>Email</Label>
                      <input
                        data-testid="field-email"
                        type="email"
                        className={inputClass}
                        placeholder="you@brand.com"
                        value={form.email}
                        onChange={update("email")}
                      />
                      {errors.email && <div className={errorClass}>{errors.email}</div>}
                    </div>

                    <div className="sm:col-span-1">
                      <Label required>Platform</Label>
                      <select
                        data-testid="field-platform"
                        className={inputClass}
                        value={form.platform}
                        onChange={update("platform")}
                      >
                        <option value="" className="bg-[#0D0D0D]">Select platform</option>
                        {PLATFORMS.map((p) => (
                          <option key={p} value={p} className="bg-[#0D0D0D]">
                            {p}
                          </option>
                        ))}
                      </select>
                      {errors.platform && <div className={errorClass}>{errors.platform}</div>}
                    </div>
                    <div className="sm:col-span-1">
                      <Label required>Username</Label>
                      <input
                        data-testid="field-username"
                        className={inputClass}
                        placeholder="@yourhandle"
                        value={form.username}
                        onChange={update("username")}
                      />
                      {errors.username && <div className={errorClass}>{errors.username}</div>}
                    </div>

                    <div className="sm:col-span-1">
                      <Label required>Followers</Label>
                      <input
                        data-testid="field-followers"
                        className={inputClass}
                        placeholder="e.g. 128K"
                        value={form.followers}
                        onChange={update("followers")}
                      />
                      {errors.followers && <div className={errorClass}>{errors.followers}</div>}
                    </div>

                    <div className="sm:col-span-1">
                      <Label required>Problem Type</Label>
                      <select
                        data-testid="field-problem_type"
                        className={inputClass}
                        value={form.problem_type}
                        onChange={update("problem_type")}
                      >
                        <option value="" className="bg-[#0D0D0D]">Select problem</option>
                        {PROBLEM_TYPES.map((p) => (
                          <option key={p} value={p} className="bg-[#0D0D0D]">
                            {p}
                          </option>
                        ))}
                      </select>
                      {errors.problem_type && (
                        <div className={errorClass}>{errors.problem_type}</div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <Label required>Since when?</Label>
                      <input
                        data-testid="field-since_when"
                        className={inputClass}
                        placeholder="e.g. 3 days ago, since Nov 12"
                        value={form.since_when}
                        onChange={update("since_when")}
                      />
                      {errors.since_when && (
                        <div className={errorClass}>{errors.since_when}</div>
                      )}
                    </div>

                    <div className="sm:col-span-1">
                      <Label required>Already submitted appeal?</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {YES_NO.map((v) => (
                          <button
                            type="button"
                            key={v}
                            data-testid={`toggle-already_submitted_appeal-${v.toLowerCase()}`}
                            onClick={() =>
                              setForm((f) => ({ ...f, already_submitted_appeal: v }))
                            }
                            className={`rounded-xl border px-4 py-3 text-[13px] font-medium transition-colors ${
                              form.already_submitted_appeal === v
                                ? "border-white/40 bg-white/[0.06] text-white"
                                : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.04]"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                      {errors.already_submitted_appeal && (
                        <div className={errorClass}>{errors.already_submitted_appeal}</div>
                      )}
                    </div>

                    <div className="sm:col-span-1">
                      <Label required>Can you still log in?</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {YES_NO.map((v) => (
                          <button
                            type="button"
                            key={v}
                            data-testid={`toggle-can_login-${v.toLowerCase()}`}
                            onClick={() =>
                              setForm((f) => ({ ...f, can_login: v }))
                            }
                            className={`rounded-xl border px-4 py-3 text-[13px] font-medium transition-colors ${
                              form.can_login === v
                                ? "border-white/40 bg-white/[0.06] text-white"
                                : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.04]"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                      {errors.can_login && (
                        <div className={errorClass}>{errors.can_login}</div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <Label>Additional details</Label>
                      <textarea
                        data-testid="field-additional_details"
                        rows={4}
                        className={inputClass + " resize-none"}
                        placeholder="Anything else our recovery officers should know — e.g. attempted phishing method, verified badge status, active ad campaigns."
                        value={form.additional_details}
                        onChange={update("additional_details")}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label>Upload Screenshots (up to 6 · 8 MB each)</Label>
                      <div
                        onClick={() => fileRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleFiles(e.dataTransfer.files);
                        }}
                        data-testid="field-screenshots"
                        className="cursor-pointer rounded-xl border border-dashed border-white/[0.15] hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.04] transition-colors px-5 py-6 flex items-center gap-4"
                      >
                        <div className="h-10 w-10 grid place-items-center rounded-full border border-white/10 bg-white/[0.03]">
                          <Upload className="h-4 w-4 text-white/80" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-white text-[13px] font-medium">
                            Drag &amp; drop screenshots or click to browse
                          </div>
                          <div className="text-white/40 text-[11px] mt-0.5">
                            PNG / JPG · Screenshots of platform messages help our officers act faster
                          </div>
                        </div>
                        <input
                          ref={fileRef}
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFiles(e.target.files)}
                        />
                      </div>
                      {files.length > 0 && (
                        <ul
                          data-testid="uploaded-files"
                          className="mt-3 space-y-2"
                        >
                          {files.map((f, i) => (
                            <li
                              key={`${f.name}-${i}`}
                              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                            >
                              <span className="text-[12px] text-white/70 truncate">
                                {f.name} · {(f.size / 1024).toFixed(0)} KB
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(i)}
                                className="text-white/50 hover:text-white transition-colors"
                                aria-label={`Remove ${f.name}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {errorMessage && (
                    <div
                      data-testid="recovery-form-error"
                      className="mt-6 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 text-[#FCA5A5] text-[13px] px-4 py-3"
                    >
                      {errorMessage}
                    </div>
                  )}

                  <div className="mt-8 flex items-center justify-between gap-3">
                    <p className="text-[11px] text-white/40 max-w-xs">
                      Your case is encrypted in transit. A recovery officer replies within 1 hour.
                    </p>
                    <button
                      type="submit"
                      data-testid="recovery-submit"
                      className="group relative inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.15] hover:border-white/40 px-6 py-3.5 text-[14px] font-medium text-white overflow-hidden transition-all"
                      style={{ boxShadow: "0 0 30px -8px rgba(255,255,255,0.15)" }}
                    >
                      <span className="relative">Submit Appeal</span>
                      <ArrowRight
                        className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecoveryAppealModal;
