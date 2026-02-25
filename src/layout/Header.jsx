import { Bell, Search, User } from "lucide-react";
import Input from "../components/ui/Input";

export default function Header() {
    return (
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <h2 className="font-semibold text-gray-800">Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
                    <Input placeholder="Search..." className="pl-8" />
                </div>

                <Bell className="text-gray-600" />
                <User className="text-gray-600" />
            </div>
        </header>
    );
}