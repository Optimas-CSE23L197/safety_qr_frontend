import React, { useState } from "react";
import { Plus, Eye, Pencil, Trash2, Layout } from "lucide-react";

export default function CardTemplatesPage() {
    const [templates] = useState([
        {
            id: "1",
            name: "Standard School Card",
            version: "v1.2",
            status: "ACTIVE",
            preview:
                "https://via.placeholder.com/280x160?text=Template+Preview",
        },
        {
            id: "2",
            name: "Premium Blue Design",
            version: "v1.0",
            status: "DRAFT",
            preview:
                "https://via.placeholder.com/280x160?text=Template+Preview",
        },
    ]);

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Card Templates
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage ID card designs and layouts
                        </p>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <Plus size={16} /> New Template
                    </button>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                    {templates.map((t) => (
                        <div
                            key={t.id}
                            className="bg-white border rounded-xl overflow-hidden shadow-sm"
                        >
                            {/* Preview */}
                            <img
                                src={t.preview}
                                alt={t.name}
                                className="w-full h-40 object-cover"
                            />

                            {/* Info */}
                            <div className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">{t.name}</h3>

                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${t.status === "ACTIVE"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {t.status}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-400">Version {t.version}</p>

                                {/* Actions */}
                                <div className="flex justify-between pt-2">
                                    <button className="flex items-center gap-1 text-xs text-indigo-600">
                                        <Eye size={14} /> Preview
                                    </button>

                                    <button className="flex items-center gap-1 text-xs text-gray-600">
                                        <Pencil size={14} /> Edit
                                    </button>

                                    <button className="flex items-center gap-1 text-xs text-red-600">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {templates.length === 0 && (
                    <div className="bg-white border rounded-xl p-10 text-center">
                        <Layout className="mx-auto mb-3 text-gray-300" size={36} />
                        <p className="text-gray-500">No templates created yet</p>
                    </div>
                )}

                <p className="text-xs text-gray-400">
                    Templates control how student ID cards are generated and printed.
                </p>
            </div>
        </div>
    );
}