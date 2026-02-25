import React, { useState } from "react";

export default function CreateSchool() {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        contact_email: "",
        contact_phone: "",
        plan_type: "standard",
        contract_start: "",
        contract_end: "",
        metadata: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const payload = {
                ...formData,
                metadata: formData.metadata
                    ? JSON.parse(formData.metadata)
                    : null,
            };

            const res = await fetch("/api/schools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error();

            setMessage("✅ School created successfully");
        } catch {
            setMessage("❌ Failed to create school");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Create School
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Register a new school and configure subscription details
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* School Info */}
                        <Section title="School Information">
                            <Grid>
                                <Input label="School Name" name="name" value={formData.name} onChange={handleChange} required />
                                <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
                            </Grid>
                        </Section>

                        {/* Contact */}
                        <Section title="Contact Details">
                            <Grid>
                                <Input label="Contact Email" type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} required />
                                <Input label="Contact Phone" name="contact_phone" value={formData.contact_phone} onChange={handleChange} required />
                            </Grid>
                        </Section>

                        {/* Subscription */}
                        <Section title="Subscription">
                            <Grid>
                                <Select
                                    label="Plan Type"
                                    name="plan_type"
                                    value={formData.plan_type}
                                    onChange={handleChange}
                                    options={["standard", "premium", "enterprise"]}
                                />
                                <Input label="Contract Start" type="date" name="contract_start" value={formData.contract_start} onChange={handleChange} />
                                <Input label="Contract End" type="date" name="contract_end" value={formData.contract_end} onChange={handleChange} />
                            </Grid>
                        </Section>

                        {/* Metadata */}
                        <Section title="Additional Metadata (optional)">
                            <textarea
                                name="metadata"
                                value={formData.metadata}
                                onChange={handleChange}
                                placeholder='Example: { "board": "CBSE", "principal": "Mr Sharma" }'
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm h-28"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                JSON format — optional custom fields
                            </p>
                        </Section>

                        {/* Submit */}
                        <div className="flex justify-end pt-4">
                            <button
                                disabled={loading}
                                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm"
                            >
                                {loading ? "Creating..." : "Create School"}
                            </button>
                        </div>

                        {message && (
                            <p className="text-sm text-center text-gray-600">{message}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

/* ---------- UI Helpers ---------- */

function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-4">{title}</h2>
            {children}
        </div>
    );
}

function Grid({ children }) {
    return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input {...props} className="w-full border border-gray-300 rounded-lg p-2" />
        </div>
    );
}

function Select({ label, options, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <select {...props} className="w-full border border-gray-300 rounded-lg p-2">
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o.charAt(0).toUpperCase() + o.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
}