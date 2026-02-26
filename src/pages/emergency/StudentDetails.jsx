import React from "react";

export default function EmergencyProfilePage() {
    const primaryNumber = "+919876543210";

    const data = {
        student: {
            name: "Rahul Sharma",
            photo: "https://via.placeholder.com/200",
            class: "Class 8 • Section A",
        },
        school: {
            name: "Green Valley School",
            phone: "+911234567890",
        },
        medical: {
            blood: "B+",
            allergies: "Peanuts",
            conditions: "Asthma",
            medications: "Inhaler",
            doctor: "Dr. Mehta (+91 9988776655)",
            notes: "Carries inhaler in bag",
        },
        contacts: [
            { name: "Father", phone: primaryNumber, primary: true },
            { name: "Mother", phone: "+919123456789" },
        ],
    };

    const call = (phone) => `tel:${phone}`;
    const whatsapp = (phone) =>
        `https://wa.me/${phone.replace(/\D/g, "")}`;

    // Opens WhatsApp with a prefilled emergency message
    const shareLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported on this device");
            return;
        }

        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
            const message = encodeURIComponent(
                `I found Rahul Sharma. Sharing current location: ${mapsLink}`
            );
            window.open(`https://wa.me/${primaryNumber.replace(/\D/g, "")}?text=${message}`);
        });
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">

            {/* 🚨 TOP EMERGENCY BAR */}
            <div className="bg-red-600 text-white text-center py-3 px-4">
                <p className="font-semibold">
                    🚨 LOST CHILD — Please call guardian immediately
                </p>
            </div>

            <div className="max-w-md mx-auto p-4 pb-32">

                {/* PROFILE */}
                <div className="text-center mb-5">
                    <img
                        src={data.student.photo}
                        alt="Student"
                        className="w-32 h-32 rounded-2xl mx-auto object-cover border-4 border-blue-50"
                    />
                    <h1 className="text-2xl font-bold mt-3">{data.student.name}</h1>
                    <p className="text-gray-500">{data.student.class}</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Verified by {data.school.name}
                    </p>
                </div>

                {/* PRIMARY ACTION */}
                <a
                    href={call(data.contacts[0].phone)}
                    className="block w-full bg-red-600 text-white text-lg font-semibold py-4 rounded-xl text-center mb-3"
                >
                    📞 Call Guardian
                </a>

                {/* SECONDARY ACTIONS */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <a
                        href={whatsapp(data.contacts[0].phone)}
                        className="bg-green-600 text-white py-3 rounded-xl text-center font-semibold"
                    >
                        WhatsApp
                    </a>
                    <button
                        onClick={shareLocation}
                        className="bg-purple-600 text-white py-3 rounded-xl text-center font-semibold"
                    >
                        📍 Share Location
                    </button>
                </div>

                {/* 🟧 MEDICAL ALERT */}
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-4">
                    <h3 className="font-semibold text-orange-700 mb-2">
                        ⚠️ Medical Information
                    </h3>
                    <Info label="Blood Group" value={data.medical.blood} />
                    <Info label="Allergies" value={data.medical.allergies} />
                    <Info label="Conditions" value={data.medical.conditions} />
                    <Info label="Medications" value={data.medical.medications} />
                    <Info label="Doctor" value={data.medical.doctor} />
                </div>

                {/* CONTACTS */}
                <div className="bg-gray-50 border rounded-2xl p-4 mb-4">
                    <h3 className="font-semibold mb-2">Emergency Contacts</h3>
                    {data.contacts.map((c, i) => (
                        <div key={i} className="flex justify-between py-2 border-b last:border-0">
                            <span>{c.name}</span>
                            <a href={call(c.phone)} className="text-blue-600 font-medium">
                                {c.phone}
                            </a>
                        </div>
                    ))}
                </div>

                {/* GUIDANCE */}
                <div className="text-sm text-gray-700 bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="font-semibold mb-2">How you can help this child</p>
                    <ul className="list-disc ml-5 space-y-1">
                        <li>Please stay with the child in a safe place</li>
                        <li>Tap <b>Call Guardian</b> or <b>Share Location</b></li>
                        <li>If urgent, contact the school</li>
                        <li>Reassure the child and avoid crowd gathering</li>
                    </ul>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                    Powered by Student Safety Network
                </p>
            </div>

            {/* STICKY ACTION */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 space-y-2">
                <a
                    href={call(data.contacts[0].phone)}
                    className="block w-full bg-red-600 text-white text-center font-semibold py-3 rounded-xl"
                >
                    Call Guardian Now
                </a>
                <button
                    onClick={shareLocation}
                    className="block w-full bg-purple-600 text-white text-center font-semibold py-3 rounded-xl"
                >
                    Share Live Location
                </button>
            </div>
        </div>
    );
}

function Info({ label, value }) {
    if (!value) return null;
    return (
        <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
