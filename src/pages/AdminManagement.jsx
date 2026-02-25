import React, { useState } from "react";
import { Shield, UserPlus, Trash2, Pencil } from "lucide-react";

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState([
        {
            id: "1",
            name: "Super Admin",
            email: "super@qr.com",
            phone: "9999999999",
            role: "SUPER_ADMIN",
            status: "ACTIVE",
        },
        {
            id: "2",
            name: "Support Agent",
            email: "support@qr.com",
            phone: "8888888888",
            role: "SUPPORT",
            status: "ACTIVE",
        },
    ]);

    const [showCreate, setShowCreate] = useState(false);

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Admin Management
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage access, roles, and permissions
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <UserPlus size={16} /> Add Admin
                    </button>
                </div>

                {/* Admin Table */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Role</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{admin.name}</td>
                                    <td className="p-3">{admin.email}</td>
                                    <td className="p-3">{admin.phone}</td>

                                    {/* Role */}
                                    <td className="p-3">
                                        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                                            {admin.role}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="p-3">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                            {admin.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 rounded-lg hover:bg-gray-100">
                                                <Pencil size={16} />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-red-100 text-red-600">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create Modal */}
                {showCreate && (
                    <CreateAdminModal onClose={() => setShowCreate(false)} />
                )}
            </div>
        </div>
    );
}

/* ---------- Create Admin Modal ---------- */

function CreateAdminModal({ onClose }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "ADMIN",
        password: "",
    });

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold">Add New Admin</h2>

                <Input label="Name" name="name" value={form.name} onChange={handleChange} />
                <Input label="Email" name="email" value={form.email} onChange={handleChange} />
                <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} />

                <div>
                    <label className="text-sm font-medium mb-1 block">Role</label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                    >
                        <option>ADMIN</option>
                        <option>SUPER_ADMIN</option>
                        <option>SUPPORT</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg">
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        Create
                    </button>
                </div>
            </div>
        </div>
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