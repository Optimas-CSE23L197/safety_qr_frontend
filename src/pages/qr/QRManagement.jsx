import { useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function QRManagement() {
    const [tab, setTab] = useState("single");

    return (
        <div className="space-y-6 max-w-5xl">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">QR Management</h1>
                <p className="text-sm text-gray-500">
                    Generate single QR codes or create bulk batches for printing.
                </p>
            </div>

            {/* Tabs */}
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => setTab("single")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === "single"
                            ? "bg-white shadow text-gray-900"
                            : "text-gray-600"
                        }`}
                >
                    Single QR
                </button>

                <button
                    onClick={() => setTab("bulk")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === "bulk"
                            ? "bg-white shadow text-gray-900"
                            : "text-gray-600"
                        }`}
                >
                    Bulk QR
                </button>
            </div>

            {/* SINGLE QR */}
            {tab === "single" && (
                <Card className="p-6 space-y-6">

                    <div>
                        <h2 className="text-sm font-semibold text-gray-700 mb-3">
                            Student Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <Input placeholder="School Key ID" />
                            <Input placeholder="Student Name" />
                            <Input placeholder="Class / Grade" />
                            <Input placeholder="Student ID (optional)" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button>Generate QR</Button>
                        <p className="text-sm text-gray-500">
                            QR will be generated instantly and ready to download.
                        </p>
                    </div>

                    <div className="h-48 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 bg-gray-50">
                        QR Preview
                    </div>
                </Card>
            )}

            {/* BULK QR */}
            {tab === "bulk" && (
                <Card className="p-6 space-y-6">

                    <div>
                        <h2 className="text-sm font-semibold text-gray-700 mb-3">
                            Batch Settings
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <Input placeholder="School Key ID" />
                            <Input type="number" placeholder="Number of QR Codes (e.g. 500)" />
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            A unique QR code will be generated for each card.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button>Generate Batch</Button>
                        <p className="text-sm text-gray-500">
                            This will create a downloadable PDF file.
                        </p>
                    </div>

                    <div className="h-48 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 bg-gray-50">
                        PDF Preview / Status
                    </div>
                </Card>
            )}
        </div>
    );
}