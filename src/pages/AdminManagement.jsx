import React, { useState } from "react";
import {
    Shield,
    UserPlus,
    Building2,
} from "lucide-react";

export default function AdminRegisterPage() {
    const [type, setType] = useState("SUPER_ADMIN");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-600 rounded-xl">
                        <Shield className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Register Admin
                        </h1>
                        <p className="text-gray-600">
                            Create super admins or school-level administrators
                        </p>
                    </div>
                </div>

                {/* Type Selector */}
                <div className="bg-white border rounded-xl p-4 flex gap-3">
                    <TypeButton
                        active={type === "SUPER_ADMIN"}
                        onClick={() => setType("SUPER_ADMIN")}
                        icon={Shield}
                        label="Super Admin"
                    />
                    <TypeButton
                        active={type === "SCHOOL_ADMIN"}
                        onClick={() => setType("SCHOOL_ADMIN")}
                        icon={Building2}
                        label="School Admin"
                    />
                </div>

                {/* Form Card */}
                <div className="bg-white border rounded-xl shadow-sm p-6">
                    {type === "SUPER_ADMIN" ? <SuperAdminForm /> : <SchoolAdminForm />}
                </div>
            </div>
        </div>
    );
}

/* ---------- Super Admin Form ---------- */

function SuperAdminForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        is_active: true,
    });

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    return (
        <FormLayout title="Super Admin Details">
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} />

            <Checkbox label="Active" name="is_active" />

            <SubmitButton />
        </FormLayout>
    );
}

/* ---------- School Admin Form ---------- */

function SchoolAdminForm() {
    const [form, setForm] = useState({
        school_id: "",
        name: "",
        email: "",
        password: "",
        role: "ADMIN",
        is_active: true,
    });

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    return (
        <FormLayout title="School Admin Details">
            <Input label="School ID" name="school_id" value={form.school_id} onChange={handleChange} />
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} />

            <Select
                label="Role"
                name="role"
                options={["ADMIN", "STAFF", "VIEWER"]}
                value={form.role}
                onChange={handleChange}
            />

            <Checkbox label="Active" name="is_active" />

            <SubmitButton />
        </FormLayout>
    );
}

/* ---------- UI Helpers ---------- */

function FormLayout({ title, children }) {
    return (
        <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">{title}</h2>
            <div className="grid md:grid-cols-2 gap-4">{children}</div>
        </div>
    );
}

function TypeButton({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${active
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white hover:bg-gray-50"
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="text-sm font-medium mb-1 block">{label}</label>
            <input {...props} className="w-full border rounded-lg p-2" />
        </div>
    );
}

function Select({ label, options, ...props }) {
    return (
        <div>
            <label className="text-sm font-medium mb-1 block">{label}</label>
            <select {...props} className="w-full border rounded-lg p-2">
                {options.map((o) => (
                    <option key={o}>{o}</option>
                ))}
            </select>
        </div>
    );
}

function Checkbox({ label }) {
    return (
        <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
}

function SubmitButton() {
    return (
        <div className="md:col-span-2 flex justify-end pt-4">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg">
                Create Admin
            </button>
        </div>
    );
}