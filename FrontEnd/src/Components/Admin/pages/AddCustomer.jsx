import React, { useState, useEffect } from "react";
import { getAreas, getSubareas, addCustomer } from "../api/adminApi";


import "./AddCustomer.css";

const defaultForm = {
    name: "",
    mobile: "",
    area: "",
    subarea: "",
    milkType: "cow", // default
};

export default function AddCustomer() {
    const [form, setForm] = useState(defaultForm);
    const [extraFields, setExtraFields] = useState([]); // { key, value }
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

    // mobile validation: 10 digits, start with 6-9
    const validate = () => {
        const e = {};

        if (!form.name.trim()) e.name = "Name is required";

        if (!form.mobile.trim()) {
            e.mobile = "Mobile is required";
        } else {
            const mobileRegex = /^[6-9]\d{9}$/;
            if (!mobileRegex.test(form.mobile.trim())) {
                e.mobile = "Enter a valid 10-digit Indian mobile (starts 6-9)";
            }
        }

        if (!form.area) e.area = "Please select an area";
        if (!form.subarea) e.subarea = "Please select a subarea";

        return e;
    };

    const onChange = (k, v) => {
        setForm((s) => ({ ...s, [k]: v }));
        setErrors((prev) => ({ ...prev, [k]: undefined }));
        setBackendError("");
    };

    const addExtraField = () => setExtraFields((s) => [...s, { key: "", value: "" }]);
    const updateExtraField = (i, prop, val) => {
        setExtraFields((s) => s.map((f, idx) => (idx === i ? { ...f, [prop]: val } : f)));
    };
    const removeExtraField = (i) => setExtraFields((s) => s.filter((_, idx) => idx !== i));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBackendError("");
        const eobj = validate();
        setErrors(eobj);
        if (Object.keys(eobj).length) return;

        // Build payload
        const payload = { ...form };
        // merge extras
        extraFields.forEach((f) => {
            if (f.key && f.key.trim()) payload[f.key.trim()] = f.value;
        });

        try {
            setLoading(true);
            const res = await addCustomer(payload);
            // success
            setSuccessInfo({
                msg: res?.data?.msg || "Customer created",
                customer: res?.data?.customer || payload,
            });
            setForm(defaultForm);
            setExtraFields([]);
        } catch (err) {
            // Show backend message if present
            const backendMsg = err?.response?.data?.msg || err?.response?.data?.message || err?.response?.data || err.message;
            setBackendError(backendMsg || "Failed to create customer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-customer-page">
            <h2 className="page-title">➕ Add Customer</h2>

            <div className="card form-card">
                <form onSubmit={handleSubmit} noValidate>
                    <label className="label">Name</label>
                    <input
                        name="name"
                        className={`input ${errors.name ? "invalid" : ""}`}
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        placeholder="Full name"
                    />
                    {errors.name && <div className="error">{errors.name}</div>}

                    <label className="label">Mobile</label>
                    <input
                        name="mobile"
                        className={`input ${errors.mobile ? "invalid" : ""}`}
                        value={form.mobile}
                        onChange={(e) => onChange("mobile", e.target.value)}
                        placeholder="10-digit mobile (starts with 6-9)"
                    />
                    {errors.mobile && <div className="error">{errors.mobile}</div>}

                    <label className="label">Area</label>
                    <select
                        className="input"
                        value={form.area}
                        onChange={async (e) => {
                            const areaId = e.target.value;
                            onChange("area", areaId);

                            // Clear previous subarea
                            onChange("subarea", "");
                            setSubareas([]);

                            if (!areaId) return;

                            try {
                                const res = await getSubareas(areaId);
                                setSubareas(res.data.subareas || []);
                            } catch (err) {
                                console.error("Failed to load subareas", err);
                            }
                        }}
                    >
                        <option value="">Select Area</option>
                        {areas.map((a) => (
                            <option key={a._id} value={a._id}>
                                {a.name}
                            </option>
                        ))}
                    </select>

                    <label className="label">Subarea</label>
                    <select
                        className="input"
                        value={form.subarea}
                        onChange={(e) => onChange("subarea", e.target.value)}
                    >
                        <option value="">Select Subarea</option>

                        {subareas.map((sub, idx) => (
                            <option key={idx} value={sub}>
                                {sub}
                            </option>
                        ))}
                    </select>

                    <label className="label">Milk Type</label>
                    <select className="input" value={form.milkType} onChange={(e) => onChange("milkType", e.target.value)}>
                        <option value="cow">Cow</option>
                        <option value="buffalo">Buffalo</option>
                        <option value="mixed">Mixed</option>
                    </select>

                    <div className="extra-section">
                        <div className="extra-header">
                            <strong>Extra fields</strong>
                            <button type="button" className="link-btn" onClick={addExtraField}>+ Add field</button>
                        </div>

                        {extraFields.map((f, i) => (
                            <div className="extra-row" key={i}>
                                <input
                                    className="input small"
                                    placeholder="field key (eg: note)"
                                    value={f.key}
                                    onChange={(ev) => updateExtraField(i, "key", ev.target.value)}
                                />
                                <input
                                    className="input small"
                                    placeholder="field value"
                                    value={f.value}
                                    onChange={(ev) => updateExtraField(i, "value", ev.target.value)}
                                />
                                <button type="button" className="remove-btn" onClick={() => removeExtraField(i)}>Remove</button>
                            </div>
                        ))}
                    </div>

                    {backendError && <div className="backend-error">{String(backendError)}</div>}

                    <div className="actions">
                        <button className="btn-primary" type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Customer"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {successInfo && (
                <div className="modal-backdrop" onClick={() => setSuccessInfo(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Customer Created</h3>
                        <p>{successInfo.msg}</p>
                        <pre className="created-json">{JSON.stringify(successInfo.customer, null, 2)}</pre>
                        <div className="modal-actions">
                            <button className="btn" onClick={() => setSuccessInfo(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
