import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    Calendar,
    Activity,
    Droplet,
    AlertCircle,
    MapPin,
    Clock,
    QrCode,
    CreditCard,
    Shield,
} from "lucide-react";
import useAuth from "../../hooks/useAuth.js";
import useStudentStore from "../../store/student.store.js";
import { formatDate } from "../../utils/formatters.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { useToast } from "../../hooks/useToast.js";

export default function StudentDetail() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const schoolId = user?.school_id;

    const { currentStudent, loading, fetchStudentById, clearCurrentStudent } = useStudentStore();
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        if (schoolId && studentId) {
            fetchStudentById(schoolId, studentId).catch((error) => {
                console.error("Failed to fetch student:", error);
                showToast("Failed to load student details", "error");
            });
        }

        return () => {
            clearCurrentStudent();
        };
    }, [schoolId, studentId, fetchStudentById, clearCurrentStudent, showToast]);

    if (loading.detail) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                }}
            >
                <Spinner size={48} />
            </div>
        );
    }

    if (!currentStudent) {
        return (
            <div style={{ textAlign: "center", padding: "60px" }}>
                <AlertCircle size={48} style={{ marginBottom: "16px", color: "var(--color-danger-500)" }} />
                <h3>Student not found</h3>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        marginTop: "16px",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-default)",
                        background: "white",
                        cursor: "pointer",
                    }}
                >
                    Go back
                </button>
            </div>
        );
    }

    const tokenBadge = currentStudent.current_token?.status_badge || {
        bg: "#F1F5F9",
        color: "#475569",
        label: "Unassigned",
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Header with back button */}
            <div style={{ marginBottom: "24px" }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "8px 0",
                        marginBottom: "16px",
                    }}
                >
                    <ArrowLeft size={20} /> Back to Students
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {currentStudent.photo_url ? (
                        <img
                            src={currentStudent.photo_url}
                            alt={currentStudent.full_name}
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                fontWeight: 700,
                                color: "var(--color-brand-700)",
                            }}
                        >
                            {currentStudent.full_name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
                            {currentStudent.full_name}
                        </h1>
                        <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                            {currentStudent.class && `${currentStudent.class} - ${currentStudent.section}`}
                            {currentStudent.roll_number && ` • Roll No: ${currentStudent.roll_number}`}
                            {currentStudent.admission_number && ` • Admission: ${currentStudent.admission_number}`}
                        </p>
                        <div style={{ marginTop: "8px" }}>
                            <Badge style={{ background: tokenBadge.bg, color: tokenBadge.color }}>
                                {tokenBadge.label}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div
                style={{
                    display: "flex",
                    gap: "4px",
                    borderBottom: "1px solid var(--border-default)",
                    marginBottom: "24px",
                }}
            >
                {[
                    { id: "profile", label: "Profile", icon: User },
                    { id: "emergency", label: "Emergency", icon: AlertCircle },
                    { id: "scans", label: "Scan History", icon: Activity },
                    { id: "token", label: "Token & Card", icon: QrCode },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 20px",
                            background: "none",
                            border: "none",
                            borderBottom:
                                activeTab === tab.id ? "2px solid var(--color-brand-600)" : "2px solid transparent",
                            color: activeTab === tab.id ? "var(--color-brand-600)" : "var(--text-secondary)",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "profile" && (
                <div style={{ display: "grid", gap: "24px" }}>
                    <Card>
                        <h3 style={{ marginBottom: "16px" }}>Basic Information</h3>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "16px",
                            }}
                        >
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Admission Number
                                </label>
                                <p>{currentStudent.admission_number || "Not assigned"}</p>
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Roll Number
                                </label>
                                <p>{currentStudent.roll_number || "Not assigned"}</p>
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Enrolled On
                                </label>
                                <p>{currentStudent.created_at_formatted}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 style={{ marginBottom: "16px" }}>Linked Parents</h3>
                        {currentStudent.parent_details?.length > 0 ? (
                            <div style={{ display: "grid", gap: "16px" }}>
                                {currentStudent.parent_details.map((parent, idx) => (
                                    <div
                                        key={parent.id}
                                        style={{
                                            padding: "16px",
                                            background: "var(--color-slate-50)",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    background: "var(--color-brand-100)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <User size={20} style={{ color: "var(--color-brand-600)" }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600 }}>{parent.name || "Parent"}</div>
                                                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                                                    {parent.relationship}
                                                    {parent.is_primary && (
                                                        <Badge
                                                            style={{
                                                                marginLeft: "8px",
                                                                background: "#ECFDF5",
                                                                color: "#047857",
                                                            }}
                                                        >
                                                            Primary
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                {parent.phone && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <Phone size={12} style={{ color: "var(--text-muted)" }} />
                                                        <span style={{ fontSize: "0.875rem" }}>{parent.phone_formatted}</span>
                                                    </div>
                                                )}
                                                {parent.email && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <Mail size={12} style={{ color: "var(--text-muted)" }} />
                                                        <span style={{ fontSize: "0.875rem" }}>{parent.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)" }}>No parents linked to this student</p>
                        )}
                    </Card>
                </div>
            )}

            {activeTab === "emergency" && currentStudent.emergency_profile && (
                <div style={{ display: "grid", gap: "24px" }}>
                    <Card>
                        <h3 style={{ marginBottom: "16px" }}>Medical Information</h3>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "16px",
                            }}
                        >
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    <Droplet size={12} style={{ display: "inline", marginRight: "4px" }} />
                                    Blood Group
                                </label>
                                <p>{currentStudent.emergency_profile.blood_group_label || "Unknown"}</p>
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Allergies
                                </label>
                                <p>{currentStudent.emergency_profile.allergies || "None reported"}</p>
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Medical Conditions
                                </label>
                                <p>{currentStudent.emergency_profile.conditions || "None reported"}</p>
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Medications
                                </label>
                                <p>{currentStudent.emergency_profile.medications || "None reported"}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 style={{ marginBottom: "16px" }}>Emergency Contacts</h3>
                        {currentStudent.emergency_profile.contacts?.length > 0 ? (
                            <div style={{ display: "grid", gap: "12px" }}>
                                {currentStudent.emergency_profile.contacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "12px",
                                            background: "var(--color-slate-50)",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{contact.name}</div>
                                            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                                                {contact.relationship}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Phone size={12} style={{ color: "var(--text-muted)" }} />
                                                <span>{contact.phone_encrypted?.replace(/^(\+91)(\d{5})(\d{5})$/, "$1 $2 $3") || "Not provided"}</span>
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                                Priority: {contact.priority}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)" }}>No emergency contacts added</p>
                        )}
                    </Card>
                </div>
            )}

            {activeTab === "scans" && (
                <Card>
                    <h3 style={{ marginBottom: "16px" }}>Recent Scan Activity</h3>
                    {currentStudent.recent_scans?.length > 0 ? (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
                                        <th style={{ textAlign: "left", padding: "12px" }}>Date & Time</th>
                                        <th style={{ textAlign: "left", padding: "12px" }}>Result</th>
                                        <th style={{ textAlign: "left", padding: "12px" }}>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentStudent.recent_scans.map((scan) => (
                                        <tr key={scan.id} style={{ borderBottom: "1px solid var(--border-default)" }}>
                                            <td style={{ padding: "12px" }}>{formatDate(scan.created_at)}</td>
                                            <td style={{ padding: "12px" }}>
                                                <Badge
                                                    style={{
                                                        background:
                                                            scan.result === "SUCCESS" ? "#ECFDF5" : "#FEF2F2",
                                                        color: scan.result === "SUCCESS" ? "#047857" : "#B91C1C",
                                                    }}
                                                >
                                                    {scan.result}
                                                </Badge>
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                                {scan.latitude && scan.longitude ? (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <MapPin size={12} />
                                                        <span>
                                                            {scan.latitude.toFixed(4)}, {scan.longitude.toFixed(4)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    "Not available"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: "var(--text-muted)" }}>No scan records found</p>
                    )}
                </Card>
            )}

            {activeTab === "token" && (
                <div style={{ display: "grid", gap: "24px" }}>
                    <Card>
                        <h3 style={{ marginBottom: "16px" }}>Token Details</h3>
                        {currentStudent.current_token ? (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "16px",
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        <QrCode size={12} style={{ display: "inline", marginRight: "4px" }} />
                                        Token ID
                                    </label>
                                    <p style={{ fontFamily: "monospace" }}>
                                        {currentStudent.current_token.id.slice(-8).toUpperCase()}
                                    </p>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Status
                                    </label>
                                    <Badge
                                        style={{
                                            background: currentStudent.current_token.status_badge.bg,
                                            color: currentStudent.current_token.status_badge.color,
                                        }}
                                    >
                                        {currentStudent.current_token.status_badge.label}
                                    </Badge>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        <Clock size={12} style={{ display: "inline", marginRight: "4px" }} />
                                        Assigned On
                                    </label>
                                    <p>{formatDate(currentStudent.current_token.assigned_at)}</p>
                                </div>
                                {currentStudent.current_token.expires_at && (
                                    <div>
                                        <label
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                color: "var(--text-muted)",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Expires On
                                        </label>
                                        <p>{formatDate(currentStudent.current_token.expires_at)}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)" }}>No active token assigned</p>
                        )}
                    </Card>

                    {currentStudent.current_card && (
                        <Card>
                            <h3 style={{ marginBottom: "16px" }}>Card Details</h3>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "16px",
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        <CreditCard size={12} style={{ display: "inline", marginRight: "4px" }} />
                                        Card Number
                                    </label>
                                    <p style={{ fontFamily: "monospace" }}>{currentStudent.current_card.card_number}</p>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Print Status
                                    </label>
                                    <Badge
                                        style={{
                                            background: currentStudent.current_card.print_status === "PRINTED" ? "#ECFDF5" : "#FEF3C7",
                                            color: currentStudent.current_card.print_status === "PRINTED" ? "#047857" : "#B45309",
                                        }}
                                    >
                                        {currentStudent.current_card.print_status}
                                    </Badge>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        <Shield size={12} style={{ display: "inline", marginRight: "4px" }} />
                                        Token Status
                                    </label>
                                    <p>{currentStudent.current_card.token?.status || "Unknown"}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}