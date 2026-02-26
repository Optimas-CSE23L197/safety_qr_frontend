import React, { useState } from "react";
import { Search, School, Mail, MapPin, Users, CreditCard, CheckCircle, XCircle, Building2 } from "lucide-react";

export default function SchoolLookupPage() {
    const [query, setQuery] = useState("");
    const [school, setSchool] = useState(null);
    const [searched, setSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setSearched(false);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        setSearched(true);
        setIsLoading(false);

        // 🔌 Replace with real API call
        const fakeSchool = {
            id: "sch_123",
            name: "Green Valley Public School",
            address: "MG Road, Bengaluru, Karnataka 560001",
            contact_email: "contact@gvps.com",
            plan: "Premium",
            students: 1245,
            status: "ACTIVE",
        };

        setSchool(fakeSchool);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-blue-600 rounded-xl">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">School Lookup</h1>
                            <p className="text-gray-600 mt-1">Search by school ID, name, or email address</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 transition-all hover:shadow-xl">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter school ID, name, or email..."
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={isLoading || !query.trim()}
                            className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Search
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center animate-pulse">
                        <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                            <Search className="w-8 h-8 text-blue-600 animate-bounce" />
                        </div>
                        <p className="text-gray-600 font-medium">Searching for school...</p>
                    </div>
                )}

                {/* Empty State */}
                {searched && !school && !isLoading && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                            <School className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No school found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We couldn't find a school matching your search. Please check the ID, name, or email and try again.
                        </p>
                    </div>
                )}

                {/* School Card */}
                {school && !isLoading && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
                        {/* School Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-white">{school.name}</h2>
                                        {school.status === "ACTIVE" ? (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-100 rounded-full text-sm font-medium backdrop-blur-sm">
                                                <CheckCircle className="w-4 h-4" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-100 rounded-full text-sm font-medium backdrop-blur-sm">
                                                <XCircle className="w-4 h-4" />
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-blue-100 font-mono text-sm">{school.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* School Details */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Address */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="p-2.5 bg-blue-100 rounded-lg shrink-0">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-500 mb-1">Address</p>
                                        <p className="text-gray-900 font-medium leading-relaxed">{school.address}</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="p-2.5 bg-green-100 rounded-lg shrink-0">
                                        <Mail className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-500 mb-1">Contact Email</p>
                                        <a
                                            href={`mailto:${school.contact_email}`}
                                            className="text-blue-600 font-medium hover:underline break-all"
                                        >
                                            {school.contact_email}
                                        </a>
                                    </div>
                                </div>

                                {/* Plan */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="p-2.5 bg-purple-100 rounded-lg shrink-0">
                                        <CreditCard className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-500 mb-1">Subscription Plan</p>
                                        <span className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-semibold">
                                            {school.plan}
                                        </span>
                                    </div>
                                </div>

                                {/* Students */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="p-2.5 bg-orange-100 rounded-lg shrink-0">
                                        <Users className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-500 mb-1">Total Students</p>
                                        <p className="text-2xl font-bold text-gray-900">{school.students.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Open School Details
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
        </div>
    );
}