import React, { useState } from "react";
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Globe,
    Image as ImageIcon,
    Hash,
    CheckCircle2,
} from "lucide-react";

export default function CreateSchool() {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        address: "",
        city: "",
        country: "IN",
        email: "",
        phone: "",
        logo_url: "",
        timezone: "Asia/Kolkata",
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({
            ...p,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/schools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error();

            setMessage("School created successfully 🎉");
        } catch {
            setMessage("Failed to create school");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg">
                        <Building2 className="text-white w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Register New School
                        </h1>
                        <p className="text-gray-600">
                            Create and configure a school workspace
                        </p>
                    </div>
                </div>

                {/* Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-8"
                >
                    {/* Basic Info */}
                    <Section title="Basic Information">
                        <Grid>
                            <Input icon={Building2} label="School Name" name="name" value={formData.name} onChange={handleChange} required />
                            <Input icon={Hash} label="School Code" name="code" value={formData.code} onChange={handleChange} required />
                        </Grid>
                    </Section>

                    {/* Location */}
                    <Section title="Location">
                        <Grid>
                            <Input icon={MapPin} label="Address" name="address" value={formData.address} onChange={handleChange} />
                            <Input icon={MapPin} label="City" name="city" value={formData.city} onChange={handleChange} />
                            <Input icon={Globe} label="Country" name="country" value={formData.country} onChange={handleChange} />
                            <Input icon={Globe} label="Timezone" name="timezone" value={formData.timezone} onChange={handleChange} />
                        </Grid>
                    </Section>

                    {/* Contact */}
                    <Section title="Contact Details">
                        <Grid>
                            <Input icon={Mail} label="Email" name="email" value={formData.email} onChange={handleChange} />
                            <Input icon={Phone} label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                        </Grid>
                    </Section>

                    {/* Branding */}
                    <Section title="Branding">
                        <Input icon={ImageIcon} label="Logo URL" name="logo_url" value={formData.logo_url} onChange={handleChange} />
                    </Section>

                    {/* Status */}
                    <Section title="Status">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="w-5 h-5"
                            />
                            <span className="font-medium text-gray-700">Active School</span>
                        </label>
                    </Section>

                    {/* Submit */}
                    <div className="flex justify-between items-center pt-4 border-t">
                        {message && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                {message}
                            </p>
                        )}

                        <button
                            disabled={loading}
                            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
                        >
                            {loading ? "Creating..." : "Create School"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ---------- UI Helpers ---------- */

function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                {title}
            </h2>
            {children}
        </div>
    );
}

function Grid({ children }) {
    return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}

function Input({ label, icon: Icon, ...props }) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
                {label}
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3">
                {Icon && <Icon className="w-4 h-4 text-gray-400 mr-2" />}
                <input
                    {...props}
                    className="w-full py-2 outline-none text-sm"
                />
            </div>
        </div>
    );
}