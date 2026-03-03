import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { getAreas, getSubareas, addCustomer } from "../api/adminApi";
import "./AddCustomer.css";

const defaultForm = {
  name: "",
  mobile: "",
  area: "",
  subarea: "",
  milkType: "cow",
};

/* ----------------------------------------
   Premium Select
---------------------------------------- */

function PremiumSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="premium-select-wrapper">
      <label className="label">{label}</label>

      <Listbox value={value} onChange={onChange}>
        <div className="premium-select">
          <Listbox.Button
            className={`premium-button ${error ? "invalid" : ""}`}
          >
            <span className={!value ? "placeholder" : ""}>
              {value ? value.label : placeholder}
            </span>

            <svg
              className="premium-arrow"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-120"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <Listbox.Options className="premium-options">
              {options.map((item) => (
                <Listbox.Option
                  key={item.value}
                  value={item}
                  className={({ active }) =>
                    `premium-option ${active ? "active" : ""}`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className="option-label">
                        {item.icon && (
                          <span className="option-icon">{item.icon}</span>
                        )}
                        {item.label}
                      </span>

                      {selected && <span className="option-check">✓</span>}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {error && <div className="error">{error}</div>}
    </div>
  );
}

/* ----------------------------------------
   Page
---------------------------------------- */

export default function AddCustomer() {
  const [form, setForm] = useState(defaultForm);
  const [extraFields, setExtraFields] = useState([]);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await getAreas();
        setAreas(res.data.areas || []);
      } catch (err) {
        console.error("Failed to load areas", err);
      }
    };

    fetchAreas();
  }, []);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name is required";

    if (!form.mobile.trim()) {
      e.mobile = "Mobile is required";
    } else {
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(form.mobile.trim())) {
        e.mobile = "Enter valid 10-digit mobile (starts with 6–9)";
      }
    }

    if (!form.area) e.area = "Please select an area";
    if (!form.subarea) e.subarea = "Please select a subarea";

    return e;
  };

  const onChange = (k, v) => {
    setForm((s) => ({ ...s, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
    setBackendError("");
  };

  const addExtraField = () => {
    setExtraFields((prev) => {
      // if last row exists and both inputs are empty → do not add new row
      if (
        prev.length > 0 &&
        prev[prev.length - 1].key.trim() === "" &&
        prev[prev.length - 1].value.trim() === ""
      ) {
        return prev;
      }

      return [...prev, { key: "", value: "" }];
    });
  };

  const updateExtraField = (i, prop, val) => {
    setExtraFields((s) =>
      s.map((f, idx) => (idx === i ? { ...f, [prop]: val } : f)),
    );
  };

  const removeExtraField = (i) =>
    setExtraFields((s) => s.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;

    const payload = { ...form };

    extraFields.forEach((f) => {
      if (f.key && f.key.trim()) payload[f.key.trim()] = f.value;
    });

    try {
      setLoading(true);
      const res = await addCustomer(payload);

      setSuccessInfo({
        msg: res?.data?.msg || "Customer created",
        customer: res?.data?.customer || payload,
      });

      setForm(defaultForm);
      setExtraFields([]);
      setSubareas([]);
    } catch (err) {
      const backendMsg =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message;

      setBackendError(backendMsg || "Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  const areaOptions = areas.map((a) => ({
    value: a._id,
    label: a.name,
  }));

  const subareaOptions = subareas.map((s) => ({
    value: s,
    label: s,
  }));

  const milkTypeOptions = [
    { value: "cow", label: "Cow Milk 🐄" },
    { value: "buffalo", label: "Buffalo Milk 🐃" },
    { value: "mixed", label: "Mixed Milk 🥛" },
  ];

  const selectedArea = areaOptions.find((a) => a.value === form.area) || null;

  const selectedSubarea =
    subareaOptions.find((s) => s.value === form.subarea) || null;

  const selectedMilkType =
    milkTypeOptions.find((m) => m.value === form.milkType) || null;

  return (
    <div className="add-customer-page">
      <div className="lux-header">
        <div className="lux-icon">👤</div>
        <div>
          <h2 className="page-title">Add New Customer</h2>
          <p className="lux-subtitle">
            Create and manage your milk delivery customers
          </p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          {/* ================= MAIN FORM ================= */}

          <div className="form-grid">
            <div>
              <label className="label">Customer Name</label>
              <input
                className={`input ${errors.name ? "invalid" : ""}`}
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Full name"
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>

            <div>
              <label className="label">Mobile</label>
              <input
                className={`input ${errors.mobile ? "invalid" : ""}`}
                value={form.mobile}
                onChange={(e) => onChange("mobile", e.target.value)}
                placeholder="10-digit mobile"
              />
              {errors.mobile && <div className="error">{errors.mobile}</div>}
            </div>

            <PremiumSelect
              label="Area"
              value={selectedArea}
              options={areaOptions}
              placeholder="Select area"
              error={errors.area}
              onChange={async (opt) => {
                onChange("area", opt.value);
                onChange("subarea", "");
                setSubareas([]);

                try {
                  const res = await getSubareas(opt.value);
                  setSubareas(res.data.subareas || []);
                } catch (err) {
                  console.error(err);
                }
              }}
            />

            <PremiumSelect
              label="Subarea"
              value={selectedSubarea}
              options={subareaOptions}
              placeholder="Select subarea"
              error={errors.subarea}
              onChange={(opt) => onChange("subarea", opt.value)}
            />

            <PremiumSelect
              label="Milk Type"
              value={selectedMilkType}
              options={milkTypeOptions}
              placeholder="Select milk type"
              onChange={(opt) => onChange("milkType", opt.value)}
            />
          </div>

          {/* ================= EXTRA INFORMATION ================= */}

          <div className="extra-info-block">
            <div className="extra-info-header">
              <div className="extra-info-title">Extra information</div>
              <div>
                <button
                  type="button"
                  className="extra-add-btn"
                  onClick={addExtraField}
                >
                  + Add field
                </button>
              </div>
            </div>

            <div className="extra-rows-grid">
              {extraFields.map((f, i) => (
                <div className="extra-row" key={i}>
                  <div>
                    <input
                      className="input"
                      placeholder="Field name"
                      value={f.key}
                      onChange={(e) =>
                        updateExtraField(i, "key", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <input
                      className="input"
                      placeholder="Value"
                      value={f.value}
                      onChange={(e) =>
                        updateExtraField(i, "value", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      className="extra-remove-btn"
                      onClick={() => removeExtraField(i)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {backendError && (
            <div className="backend-error">{String(backendError)}</div>
          )}

          {/* ================= ACTIONS ================= */}

          <div className="actions">
            <button className="btn-primary" disabled={loading}>
              {loading ? "Creating…" : "Create Customer"}
            </button>
          </div>
        </form>
      </div>

      {successInfo && (
        <div className="modal-backdrop" onClick={() => setSuccessInfo(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Customer created successfully</h3>
            <p>{successInfo.msg}</p>

            <pre className="created-json">
              {JSON.stringify(successInfo.customer, null, 2)}
            </pre>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => setSuccessInfo(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
