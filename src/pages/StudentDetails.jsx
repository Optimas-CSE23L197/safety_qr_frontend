import React from "react";

export default function StudentEmergencyProfile() {
    const primaryNumber = "+919876543210";

    const shareLocation = () => {
        const phone = primaryNumber.replace(/\D/g, "");

        if (!navigator.geolocation) {
            alert("Location not supported on this device.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

                const message = encodeURIComponent(
                    `Hello, I found your child and I'm sharing my location:\n${mapsLink}`
                );

                const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
                window.open(whatsappUrl, "_blank");
            },
            () => {
                alert("Unable to retrieve location. Please allow location access.");
            },
            { enableHighAccuracy: true }
        );

    };

    return (<div className="min-h-screen bg-gray-100 text-gray-800 flex justify-center"> <div className="w-full max-w-md pb-24">

        {/* 🚨 Emergency Banner */}
        <div className="bg-red-50 border-b border-red-200 text-center py-3 px-4">
            <p className="text-sm font-semibold text-red-700">
                🚨 Emergency Safety Profile — Please contact guardian immediately
            </p>
        </div>

        <div className="p-4">

            {/* Profile */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-4 text-center">
                <img
                    src="https://via.placeholder.com/150"
                    alt="Student"
                    className="w-28 h-28 mx-auto rounded-xl object-cover border-4 border-blue-50 mb-3"
                />
                <h2 className="text-xl font-bold">Rahul Sharma</h2>
                <p className="text-gray-500 text-sm">
                    Class 8 • ABC Public School
                </p>
            </div>

            {/* 🟥 Primary Actions */}
            <div className="grid gap-2 mb-4">
                <a
                    href={`tel:${primaryNumber}`}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl text-center"
                >
                    Call Emergency Contact
                </a>

                <button
                    onClick={shareLocation}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl"
                >
                    Share My Location
                </button>

                <a
                    href={`https://wa.me/${primaryNumber.replace(/\D/g, "")}`}
                    className="bg-blue-900 hover:bg-blue-950 text-white font-semibold py-3 rounded-xl text-center"
                >
                    Message on WhatsApp
                </a>
            </div>

            {/* 🟧 Medical Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-4">
                <h3 className="text-orange-700 font-semibold text-sm mb-1">
                    ⚠️ Medical Information
                </h3>
                <p className="text-sm">
                    Allergy to peanuts. Asthma patient carries inhaler.
                </p>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-4">
                <h3 className="text-blue-900 font-semibold mb-3 text-sm">
                    Basic Information
                </h3>

                <InfoRow label="Blood Group" value="B+" />
                <InfoRow label="Date of Birth" value="12 Aug 2012" />
                <InfoRow label="Student ID" value="STU-45872" />
            </div>

            {/* Contacts */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                <h3 className="text-blue-900 font-semibold mb-3 text-sm">
                    Emergency Contacts
                </h3>

                <InfoRow label="Primary" value={primaryNumber} />
                <InfoRow label="Alternate" value="+919123456789" />
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
                Powered by Student Safety Network
            </p>
        </div>

        {/* 📞 Sticky Call Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:hidden">
            <a
                href={`tel:${primaryNumber}`}
                className="block w-full bg-red-600 text-white text-center font-semibold py-3 rounded-xl"
            >
                Call Guardian Now
            </a>
        </div>
    </div >
    </div >

    );
}

function InfoRow({ label, value }) {
    return (<div className="flex justify-between text-sm mb-2"> <span className="text-gray-500">{label}</span> <span className="font-medium">{value}</span> </div>
    );
}
