import { useState, useEffect, useRef } from "react";
import { Badge } from "antd";
import { Bell } from "lucide-react";
import Notifiy from "../../assets/noticfication_icon.png"; // Ensure this path is correct

const NotificationPanel = () => {
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Set to an empty array to show the "No Notifications" state by default
    const notifications: any[] = [];

    // Example with notifications:
    // const notifications = Array.from({ length: 25 }, (_, i) => ({
    //   message: `Notification ${i + 1}: You have a new update.`,
    //   time: `${i + 1} mins ago`,
    // }));

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={panelRef}>
        {/* Notification Bell */}
        <div
            className="cursor-pointer w-7 h-7 flex items-center justify-center"
            onClick={() => setOpen(!open)}
        >
            <Badge count={notifications.length} offset={[0, 0]}>
            <Bell className="h-5 w-5" />
            </Badge>
        </div>

        {/* Dropdown Panel */}
        {open && (
            <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 text-base">Notifications</h3>
                <button
                onClick={() => setOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
                >
                Close
                </button>
            </div>

            {/* Scrollable Notification List */}
            <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <img
                    src={Notifiy} // Path from your public folder
                    alt="No Notifications"
                    className="w-24 mb-3" // Adjusted styling
                    />
                    <p className="text-sm font-medium">You're all caught up!</p>
                </div>
                ) : (
                notifications.map((n, i) => (
                    <div
                    key={i}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-all"
                    >
                    <p className="text-sm text-gray-700">{n.message}</p>
                    <p className="text-xs text-gray-400">{n.time}</p>
                    </div>
                ))
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="border-t border-gray-200 px-4 py-2 text-center text-sm text-[#049F99] cursor-pointer hover:underline">
                View All Notifications
                </div>
            )}
            </div>
        )}
        </div>
    );
};

export default NotificationPanel;