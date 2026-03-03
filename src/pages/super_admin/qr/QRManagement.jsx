import { useState } from "react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function TokenManagement() {
    const [tokenType, setTokenType] = useState("EMPTY"); // EMPTY | PREASSIGNED
    const [mode, setMode] = useState("SINGLE"); // SINGLE | BULK

    return (
        <div className="max-w-6xl space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Token / QR Management
                </h1>
                <p className="text-sm text-gray-500">
                    Generate empty or pre-assigned tokens for students and print batches
                </p>
            </div>

            {/* TYPE SELECTOR */}
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                <Toggle
                    active={tokenType === "EMPTY"}
                    onClick={() => setTokenType("EMPTY")}
                    label="Empty Tokens"
                />
                <Toggle
                    active={tokenType === "PREASSIGNED"}
                    onClick={() => setTokenType("PREASSIGNED")}
                    label="Pre-assigned Tokens"
                />
            </div>

            {/* MODE SELECTOR */}
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                <Toggle
                    active={mode === "SINGLE"}
                    onClick={() => setMode("SINGLE")}
                    label="Single"
                />
                <Toggle
                    active={mode === "BULK"}
                    onClick={() => setMode("BULK")}
                    label="Bulk Batch"
                />
            </div>

            {/* FORM */}
            <Card className="p-6 space-y-6">

                {/* SETTINGS */}
                <Section title="Generation Settings">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input placeholder="School ID / Code" />
                        <Input type="date" placeholder="Expiry Date (optional)" />
                    </div>
                </Section>

                {/* PREASSIGNED DETAILS */}
                {tokenType === "PREASSIGNED" && mode === "SINGLE" && (
                    <Section title="Student Details">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input placeholder="Student Name" />
                            <Input placeholder="Student ID" />
                            <Input placeholder="Class / Section" />
                            <Input placeholder="Parent Contact (optional)" />
                        </div>
                    </Section>
                )}

                {/* BULK SETTINGS */}
                {mode === "BULK" && (
                    <Section title="Batch Configuration">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input type="number" placeholder="Quantity" />
                            <Input placeholder="Batch Notes (optional)" />
                        </div>
                    </Section>
                )}

                {/* ACTIONS */}
                <div className="flex items-center gap-4">
                    <Button>
                        {mode === "SINGLE" ? "Generate Token" : "Generate Batch"}
                    </Button>
                    <span className="text-sm text-gray-500">
                        Tokens will be ready for download instantly
                    </span>
                </div>

                {/* PREVIEW PANEL */}
                <div className="h-56 border-2 border-dashed rounded-xl flex items-center justify-center bg-gray-50 text-gray-400">
                    {mode === "SINGLE"
                        ? "QR Preview"
                        : "Batch Generation Status / PDF Preview"}
                </div>
            </Card>

            {/* INFO PANEL */}
            <Card className="p-4 text-sm text-gray-600">
                <p>
                    • Empty tokens can be assigned later to students
                    • Pre-assigned tokens are linked immediately
                    • Bulk batches generate printable PDF sheets
                </p>
            </Card>
        </div>
    );
}

/* ---------- UI HELPERS ---------- */

function Toggle({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-md text-sm font-medium ${active
                ? "bg-white shadow text-gray-900"
                : "text-gray-600"
                }`}
        >
            {label}
        </button>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">{title}</h2>
            {children}
        </div>
    );
}