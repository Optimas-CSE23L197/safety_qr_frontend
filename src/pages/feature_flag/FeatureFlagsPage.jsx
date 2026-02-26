import React, { useState } from "react";
import Card from "../../components/ui/Card";
import {
    ToggleRight,
    ToggleLeft,
    Search,
    SlidersHorizontal,
    ShieldCheck,
    Activity,
    Layers,
    Settings2,
    ChevronRight
} from "lucide-react";

export default function FeatureFlagsPage() {
    const [query, setQuery] = useState("");
    const [selectedFlag, setSelectedFlag] = useState(null);

    const flags = [
        {
            key: "ADVANCED_ANALYTICS",
            description: "Enable advanced dashboard insights",
            enabled: true,
            scope: "GLOBAL",
            rollout: 100,
            overrides: 3,
            updatedAt: "2 hours ago"
        },
        {
            key: "TOKEN_AUTO_REPLACE",
            description: "Automatically replace expired tokens",
            enabled: false,
            scope: "EXPERIMENT",
            rollout: 25,
            overrides: 0,
            updatedAt: "1 day ago"
        }
    ];

    const stats = [
        { label: "Active Flags", value: 18, icon: ToggleRight },
        { label: "Overrides", value: 6, icon: Layers },
        { label: "Experiments", value: 3, icon: Activity },
        { label: "Security Flags", value: 4, icon: ShieldCheck }
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Feature Flags
                    </h1>
                    <p className="text-sm text-gray-500">
                        Control feature rollouts, experiments, and system capabilities
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                    {stats.map(({ label, value, icon: Icon }) => (
                        <Card key={label}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{label}</p>
                                    <p className="text-2xl font-semibold">{value}</p>
                                </div>
                                <Icon className="text-indigo-600" size={20} />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white border rounded-xl p-4 flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                            placeholder="Search flags"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full border rounded-lg pl-9 pr-3 py-2"
                        />
                    </div>

                    <select className="border rounded-lg px-3 py-2">
                        <option>All Scopes</option>
                        <option>Global</option>
                        <option>Experiment</option>
                    </select>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                        <SlidersHorizontal size={16} /> Filters
                    </button>
                </div>

                {/* Flags Table */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">Feature</th>
                                <th className="p-3 text-left">Scope</th>
                                <th className="p-3 text-left">Rollout</th>
                                <th className="p-3 text-left">Overrides</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-right">Manage</th>
                            </tr>
                        </thead>

                        <tbody>
                            {flags.map((flag) => (
                                <tr
                                    key={flag.key}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedFlag(flag)}
                                >
                                    <td className="p-3">
                                        <p className="font-medium">{flag.key}</p>
                                        <p className="text-xs text-gray-500">{flag.description}</p>
                                    </td>

                                    <td className="p-3">{flag.scope}</td>
                                    <td className="p-3">{flag.rollout}%</td>
                                    <td className="p-3">{flag.overrides}</td>

                                    <td className="p-3">
                                        {flag.enabled ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                                                Enabled
                                            </span>
                                        ) : (
                                            <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full">
                                                Disabled
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3 text-right">
                                        <ChevronRight size={16} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Detail Panel */}
                {selectedFlag && (
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold">{selectedFlag.key}</h3>
                                <p className="text-sm text-gray-500">
                                    {selectedFlag.description}
                                </p>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                                <Settings2 size={16} /> Edit
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <Detail label="Scope" value={selectedFlag.scope} />
                            <Detail label="Rollout" value={`${selectedFlag.rollout}%`} />
                            <Detail label="Last Updated" value={selectedFlag.updatedAt} />
                        </div>
                    </Card>
                )}

            </div>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div className="border rounded-lg p-3 bg-gray-50">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    );
}