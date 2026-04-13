import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA (replace with API response) ───────────────────────────────────
const MOCK = {
    student: { name: "Rahul Sharma", photo: null, class: "Class 8", section: "A" },
    school: { name: "Green Valley School", phone: "+911234567890" },
    medical: {
        blood: "B+",
        allergies: "Peanuts",
        conditions: "Asthma",
        medications: "Inhaler (Blue)",
        doctor: "Dr. Mehta",
        notes: "Always carries inhaler in bag. Do not give any nuts.",
    },
    contacts: [
        { label: "Father", masked: true },
        { label: "Mother", masked: true },
    ],
    scan: {
        count: 1,         // how many times scanned today
        flagged: false,   // anomaly detected
        location: "Delhi, India",
        time: new Date().toISOString(),
    },
};

// ─── DETERRENCE CONFIG ────────────────────────────────────────────────────────
const DETERRENCE_THRESHOLD = 3; // scans before showing warning

export default function EmergencyProfile() {
    const [scanCount, setScanCount] = useState(MOCK.scan.count);
    const [showDeterrence, setShowDeterrence] = useState(false);
    const [calling, setCalling] = useState(null);
    const [callTimer, setCallTimer] = useState(null);
    const [locationShared, setLocationShared] = useState(false);
    const [showMedical, setShowMedical] = useState(false);
    const [mounted, setMounted] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        // Simulate: if scan count exceeds threshold, show deterrence
        if (scanCount >= DETERRENCE_THRESHOLD) setShowDeterrence(true);
    }, []);

    const handleCall = (index) => {
        setCalling(index);
        // Masked call — initiates via backend, not direct tel: link
        // In production: POST /api/scan/call { call_token }
        let t = 3;
        setCallTimer(t);
        timerRef.current = setInterval(() => {
            t -= 1;
            setCallTimer(t);
            if (t === 0) {
                clearInterval(timerRef.current);
                setCalling(null);
                setCallTimer(null);
            }
        }, 1000);
    };

    const handleShareLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            const link = `https://maps.google.com/?q=${latitude},${longitude}`;
            // In production: POST /api/scan/share-location { call_token, location }
            // Backend sends location to parent via SMS/WhatsApp — number never exposed
            setLocationShared(true);
            setTimeout(() => setLocationShared(false), 4000);
        });
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --red:     #E8342A;
          --red-dk:  #B91C1C;
          --amber:   #F59E0B;
          --green:   #16A34A;
          --bg:      #0C0C0E;
          --surface: #141416;
          --card:    #1C1C1F;
          --border:  rgba(255,255,255,0.07);
          --text:    #F2F2F3;
          --muted:   #6B6B75;
          --accent:  #E8342A;
        }

        body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

        .page {
          min-height: 100svh;
          max-width: 420px;
          margin: 0 auto;
          padding-bottom: 160px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .page.visible { opacity: 1; transform: translateY(0); }

        /* ── TOP BAR ── */
        .top-bar {
          background: var(--red);
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .top-bar-pulse {
          width: 10px; height: 10px;
          background: white;
          border-radius: 50%;
          animation: pulse 1.2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        .top-bar-text { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; color: white; }

        /* ── DETERRENCE BANNER ── */
        .deterrence {
          background: #1A0A0A;
          border-bottom: 1px solid rgba(232,52,42,0.3);
          padding: 14px 20px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .deter-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
        .deter-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; color: var(--red); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 4px; }
        .deter-body  { font-size: 12px; color: #9CA3AF; line-height: 1.5; }
        .deter-body strong { color: #D1D5DB; }

        /* ── CONTENT ── */
        .content { padding: 24px 20px 0; }

        /* ── PROFILE CARD ── */
        .profile-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          gap: 18px;
          align-items: center;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }
        .profile-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--red), transparent);
        }
        .avatar {
          width: 80px; height: 80px;
          border-radius: 16px;
          background: #2A2A2E;
          flex-shrink: 0;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: var(--muted);
        }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .student-name { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; line-height: 1.1; margin-bottom: 4px; }
        .student-meta { font-size: 13px; color: var(--muted); margin-bottom: 6px; }
        .school-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(232,52,42,0.1);
          border: 1px solid rgba(232,52,42,0.2);
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 11px; font-weight: 500; color: #F87171;
        }

        /* ── SECTION LABEL ── */
        .section-label {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 10px;
        }

        /* ── CTA BUTTONS ── */
        .cta-primary {
          width: 100%;
          background: var(--red);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 18px;
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background 0.15s, transform 0.1s;
          margin-bottom: 10px;
          letter-spacing: 0.02em;
        }
        .cta-primary:hover  { background: var(--red-dk); }
        .cta-primary:active { transform: scale(0.98); }
        .cta-primary.dialing {
          background: #374151;
          cursor: default;
          animation: none;
        }

        .cta-secondary {
          width: 100%;
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 15px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, border-color 0.15s, transform 0.1s;
          margin-bottom: 10px;
          letter-spacing: 0.02em;
        }
        .cta-secondary:hover  { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.15); }
        .cta-secondary:active { transform: scale(0.98); }
        .cta-secondary.success { border-color: var(--green); color: #4ADE80; }

        /* ── CONTACTS ── */
        .contacts-block { margin-bottom: 20px; }
        .contact-row {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .contact-left { display: flex; flex-direction: column; }
        .contact-label { font-size: 12px; color: var(--muted); margin-bottom: 2px; }
        .contact-name  { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; }
        .contact-masked {
          font-size: 12px;
          color: var(--muted);
          display: flex; align-items: center; gap: 5px;
          margin-top: 2px;
        }
        .masked-dot { width: 5px; height: 5px; background: var(--muted); border-radius: 50%; }
        .call-btn {
          background: var(--red);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .call-btn:hover  { background: var(--red-dk); }
        .call-btn:active { transform: scale(0.95); }
        .call-btn.dialing { background: #374151; cursor: default; }

        /* ── PRIVACY NOTE ── */
        .privacy-note {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .privacy-note-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
        .privacy-note-text { font-size: 12px; color: var(--muted); line-height: 1.5; }
        .privacy-note-text strong { color: #9CA3AF; }

        /* ── MEDICAL ── */
        .medical-block { margin-bottom: 20px; }
        .medical-toggle {
          width: 100%;
          background: var(--card);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 14px;
          padding: 16px;
          display: flex; align-items: center; justify-content: space-between;
          cursor: pointer;
          color: var(--text);
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          transition: background 0.15s;
        }
        .medical-toggle:hover { background: #222226; }
        .medical-toggle-left { display: flex; align-items: center; gap: 10px; }
        .blood-badge {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 16px;
          font-weight: 800;
          color: #F87171;
          font-family: 'Syne', sans-serif;
        }
        .chevron { transition: transform 0.25s ease; font-size: 12px; color: var(--muted); }
        .chevron.open { transform: rotate(180deg); }

        .medical-details {
          background: var(--card);
          border: 1px solid rgba(245,158,11,0.15);
          border-top: none;
          border-radius: 0 0 14px 14px;
          padding: 0 16px;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s ease, padding 0.25s ease;
        }
        .medical-details.open { max-height: 400px; padding: 16px; }

        .med-row {
          display: flex; justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }
        .med-row:last-child { border-bottom: none; }
        .med-key   { color: var(--muted); }
        .med-value { font-weight: 500; text-align: right; max-width: 55%; }
        .med-note  { font-size: 12px; color: #9CA3AF; background: rgba(245,158,11,0.05); border-radius: 8px; padding: 10px; margin-top: 10px; line-height: 1.5; border: 1px solid rgba(245,158,11,0.1); }

        /* ── GUIDANCE ── */
        .guidance {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 20px;
        }
        .guidance-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 12px; color: #9CA3AF; letter-spacing: 0.05em; text-transform: uppercase; }
        .guidance-step {
          display: flex; gap: 12px; align-items: flex-start;
          margin-bottom: 12px;
        }
        .step-num {
          width: 24px; height: 24px;
          background: rgba(232,52,42,0.15);
          border: 1px solid rgba(232,52,42,0.3);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 800;
          color: var(--red);
          flex-shrink: 0;
        }
        .step-text { font-size: 13px; color: #9CA3AF; line-height: 1.5; padding-top: 3px; }

        /* ── FOOTER ── */
        .footer { text-align: center; padding: 10px 0 20px; }
        .footer p { font-size: 11px; color: #3D3D45; }
        .scan-meta { font-size: 11px; color: #3D3D45; margin-top: 4px; }

        /* ── STICKY BOTTOM ── */
        .sticky-bottom {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(12,12,14,1) 70%, rgba(12,12,14,0));
          padding: 20px;
          max-width: 420px;
          margin: 0 auto;
        }

        /* ── CALLING OVERLAY ── */
        .calling-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          z-index: 100;
          gap: 16px;
        }
        .calling-ring {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: var(--red);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px;
          animation: ring 1s ease-in-out infinite;
        }
        @keyframes ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,52,42,0.4); }
          50%       { box-shadow: 0 0 0 20px rgba(232,52,42,0); }
        }
        .calling-text { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; }
        .calling-sub  { font-size: 14px; color: var(--muted); }
        .calling-timer {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          color: var(--muted);
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 6px 16px;
        }
      `}</style>

            {/* CALLING OVERLAY */}
            {calling !== null && (
                <div className="calling-overlay">
                    <div className="calling-ring">📞</div>
                    <div className="calling-text">Connecting...</div>
                    <div className="calling-sub">
                        Connecting you to {MOCK.contacts[calling].label}
                    </div>
                    <div className="calling-timer">
                        Number protected · Connecting in {callTimer}s
                    </div>
                </div>
            )}

            <div className={`page ${mounted ? "visible" : ""}`}>

                {/* TOP BAR */}
                <div className="top-bar">
                    <div className="top-bar-pulse" />
                    <div className="top-bar-text">Emergency — Child Needs Help</div>
                </div>

                {/* DETERRENCE BANNER */}
                {showDeterrence && (
                    <div className="deterrence">
                        <div className="deter-icon">⚠️</div>
                        <div>
                            <div className="deter-title">Scan Activity Flagged</div>
                            <div className="deter-body">
                                This card has been scanned <strong>{scanCount} times</strong> recently.
                                Repeated scans without emergency purpose are <strong>logged with your device ID and location</strong> and reported to the school.
                                Misuse may be escalated to authorities.
                            </div>
                        </div>
                    </div>
                )}

                <div className="content">

                    {/* PROFILE */}
                    <div className="profile-card">
                        <div className="avatar">
                            {MOCK.student.photo
                                ? <img src={MOCK.student.photo} alt="" />
                                : MOCK.student.name.charAt(0)
                            }
                        </div>
                        <div>
                            <div className="student-name">{MOCK.student.name}</div>
                            <div className="student-meta">{MOCK.student.class} · Section {MOCK.student.section}</div>
                            <div className="school-tag">✓ {MOCK.school.name}</div>
                        </div>
                    </div>

                    {/* CONTACTS */}
                    <div className="contacts-block">
                        <div className="section-label">Emergency Contacts</div>
                        {MOCK.contacts.map((c, i) => (
                            <div className="contact-row" key={i}>
                                <div className="contact-left">
                                    <div className="contact-label">{c.label}</div>
                                    <div className="contact-name">{c.label === "Father" ? "Primary Guardian" : "Guardian"}</div>
                                    <div className="contact-masked">
                                        {[...Array(4)].map((_, j) => <div className="masked-dot" key={j} />)}
                                        <span style={{ fontSize: 11, marginLeft: 2 }}>number protected</span>
                                    </div>
                                </div>
                                <button
                                    className={`call-btn ${calling === i ? "dialing" : ""}`}
                                    onClick={() => calling === null && handleCall(i)}
                                    disabled={calling !== null}
                                >
                                    {calling === i ? `${callTimer}s...` : `📞 Call ${c.label}`}
                                </button>
                            </div>
                        ))}

                        {/* LOCATION SHARE */}
                        <button
                            className={`cta-secondary ${locationShared ? "success" : ""}`}
                            onClick={handleShareLocation}
                        >
                            {locationShared ? "✓ Location Sent to Guardian" : "📍 Send My Location to Guardian"}
                        </button>

                        {/* PRIVACY NOTE */}
                        <div className="privacy-note">
                            <div className="privacy-note-icon">🔒</div>
                            <div className="privacy-note-text">
                                <strong>Phone numbers are never shown.</strong> Calls are connected through a secure relay. Your number is also not shared with the guardian. This scan has been <strong>logged with your IP, device, and timestamp.</strong>
                            </div>
                        </div>
                    </div>

                    {/* MEDICAL — COLLAPSED BY DEFAULT */}
                    <div className="medical-block">
                        <div className="section-label">Medical Information</div>
                        <button
                            className="medical-toggle"
                            style={{ borderRadius: showMedical ? "14px 14px 0 0" : "14px" }}
                            onClick={() => setShowMedical(v => !v)}
                        >
                            <div className="medical-toggle-left">
                                <div className="blood-badge">{MOCK.medical.blood}</div>
                                <span>Medical Details</span>
                            </div>
                            <span className={`chevron ${showMedical ? "open" : ""}`}>▼</span>
                        </button>
                        <div className={`medical-details ${showMedical ? "open" : ""}`}>
                            {MOCK.medical.allergies && (
                                <div className="med-row">
                                    <span className="med-key">⚠️ Allergies</span>
                                    <span className="med-value" style={{ color: "#FCA5A5" }}>{MOCK.medical.allergies}</span>
                                </div>
                            )}
                            {MOCK.medical.conditions && (
                                <div className="med-row">
                                    <span className="med-key">🫁 Condition</span>
                                    <span className="med-value">{MOCK.medical.conditions}</span>
                                </div>
                            )}
                            {MOCK.medical.medications && (
                                <div className="med-row">
                                    <span className="med-key">💊 Medication</span>
                                    <span className="med-value">{MOCK.medical.medications}</span>
                                </div>
                            )}
                            {MOCK.medical.doctor && (
                                <div className="med-row">
                                    <span className="med-key">🩺 Doctor</span>
                                    <span className="med-value">{MOCK.medical.doctor}</span>
                                </div>
                            )}
                            {MOCK.medical.notes && (
                                <div className="med-note">📝 {MOCK.medical.notes}</div>
                            )}
                        </div>
                    </div>

                    {/* GUIDANCE */}
                    <div className="guidance">
                        <div className="guidance-title">How to help this child</div>
                        {[
                            "Stay with the child in a safe, visible location.",
                            "Tap Call Father or Call Mother to reach a guardian immediately.",
                            "Use Send Location to share exactly where you are.",
                            "Do not leave the child alone until the guardian arrives.",
                        ].map((text, i) => (
                            <div className="guidance-step" key={i}>
                                <div className="step-num">{i + 1}</div>
                                <div className="step-text">{text}</div>
                            </div>
                        ))}
                    </div>

                    <div className="footer">
                        <p>Powered by ResQID · Child Safety Network</p>
                        <p className="scan-meta">
                            Scanned · {MOCK.scan.location} · {new Date(MOCK.scan.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                    </div>
                </div>

                {/* STICKY BOTTOM CTA */}
                <div className="sticky-bottom">
                    <button
                        className={`cta-primary ${calling === 0 ? "dialing" : ""}`}
                        onClick={() => calling === null && handleCall(0)}
                    >
                        {calling === 0 ? `Connecting... ${callTimer}s` : "📞 Call Guardian Now"}
                    </button>
                </div>
            </div>
        </>
    );
}
