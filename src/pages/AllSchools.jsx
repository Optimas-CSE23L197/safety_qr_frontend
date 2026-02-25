import React, { useState } from "react";
import { Search, School } from "lucide-react";

export default function SchoolLookupPage() {
    const [query, setQuery] = useState("");
    const [school, setSchool] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setSearched(true);

        // 🔌 Replace with real API call
        const fakeSchool = {
            id: "sch_123",
            name: "Green Valley Public School",
            address: "MG Road, Bengaluru",
            contact_email: "contact@gvps.com",
            plan: "Premium",
            students: 1245,
            status: "ACTIVE",
        };

        setSchool(fakeSchool);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        School Lookup
                    </h1>
                    <p className="text-sm text-gray-500">
                        Search a school by ID, name, or email
                    </p>
                </div>

                {/* Search */}
                <div className="bg-white border rounded-xl p-4 flex gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter school ID or name"
                        className="flex-1 border rounded-lg px-3 py-2"
                    />
                    <button
                        onClick={handleSearch}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                        <Search size={16} /> Search
                    </button>
                </div>

                {/* Empty State */}
                {searched && !school && (
                    <div className="bg-white border rounded-xl p-10 text-center">
                        <School className="mx-auto mb-3 text-gray-300" size={36} />
                        <p className="text-gray-500">No school found</p>
                    </div>
                )}

                {/* School Card */}
                {school && (
                    <div className="bg-white border rounded-xl p-6 space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">{school.name}</h2>
                            <p className="text-sm text-gray-500">{school.id}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                            <p><strong>Address:</strong> {school.address}</p>
                            <p><strong>Email:</strong> {school.contact_email}</p>
                            <p><strong>Plan:</strong> {school.plan}</p>
                            <p><strong>Total Students:</strong> {school.students}</p>
                        </div>

                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                            Open School Details
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}