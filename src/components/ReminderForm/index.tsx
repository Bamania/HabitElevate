"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { createSupabaseClient } from "../../lib/supabase/client";
import axios from 'axios';

const ReminderForm = () => {
    const { user } = useAuth();
    const [datetime, setDatetime] = useState("");
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        const fetchPhoneNumber = async () => {
            if (user?.id) {
                try {
                    const supabase = createSupabaseClient();
                    const { data, error } = await supabase
                        .from('users_profile')
                        .select('phone')
                        .eq('id', user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching phone number:', error);
                        return;
                    }
                    if (data) {
                        setPhoneNumber(data.phone);
                    }
                } catch (err) {
                    console.error('Exception fetching phone number:', err);
                }
            }
        };

        fetchPhoneNumber();
    }, [user]);

    const scheduleReminder = async () => {
        if (!datetime) {
            alert("Please enter a valid time.");
            return;
        }

        if (!phoneNumber) {
            alert("Could not find a phone number for the user.");
            return;
        }

        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
            const response = await axios.post(`${apiUrl}/schedule-call`, {
                phone_number: phoneNumber,
                schedule_time: datetime,
                user_id: user?.id,
            });

            alert(response.data.message || "Reminder scheduled successfully.");
        } catch (error: any) {
            console.error("Error scheduling reminder:", error);
            const errorMessage = error.response?.data?.detail || "Failed to schedule reminder.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded">
            <input 
                type="datetime-local" 
                value={datetime} 
                onChange={(e) => setDatetime(e.target.value)} 
                className="border p-2 w-full mb-2"
            />
            <button 
                onClick={scheduleReminder} 
                className="px-4 py-2 bg-blue-600 text-white rounded w-full"
                disabled={loading || !phoneNumber}
            >
                {loading ? "Scheduling..." : "Set Reminder"}
            </button>
            {!phoneNumber && (
                <p className="text-red-500 text-sm mt-2">
                    Phone number not found. Please update your profile.
                </p>
            )}
        </div>
    );
};

export default ReminderForm;
