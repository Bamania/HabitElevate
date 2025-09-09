"use client"; // Required in Next.js App Router
import { useState } from "react";

const ReminderForm = () => {
    const [webhookUrl, setWebhookUrl] = useState("");
    const [datetime, setDatetime] = useState("");
    const [loading, setLoading] = useState(false);

    const scheduleReminder = async () => {
        if (!webhookUrl || !datetime) {
            alert("Please enter a valid webhook URL and time.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ webhookUrl, datetime }),
            });

            const data = await response.json();
            alert(data.message || "Failed to schedule reminder.");
        } catch (error) {
            console.error("Error scheduling reminder:", error);
            alert("Failed to schedule reminder.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded">
            <input 
                type="text" 
                placeholder="Enter Webhook URL" 
                value={webhookUrl} 
                onChange={(e) => setWebhookUrl(e.target.value)} 
                className="border p-2 w-full mb-2"
            />
            <input 
                type="datetime-local" 
                value={datetime} 
                onChange={(e) => setDatetime(e.target.value)} 
                className="border p-2 w-full mb-2"
            />
            <button 
                onClick={scheduleReminder} 
                className="px-4 py-2 bg-blue-600 text-white rounded w-full"
                disabled={loading}
            >
                {loading ? "Scheduling..." : "Set Reminder"}
            </button>
        </div>
    );
};

export default ReminderForm;
