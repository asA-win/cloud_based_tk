import { useEffect, useRef, useState } from "react";
import axios from "axios";

function AlarmWatcher() {
  const alarmSound = useRef(null);
  const [triggeredTaskIds, setTriggeredTaskIds] = useState(new Set());
  const [activeAlarm, setActiveAlarm] = useState(null);

  useEffect(() => {
    alarmSound.current = new Audio("/audio.mp3");
    alarmSound.current.loop = true;

    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get("http://127.0.0.1:8000/api/tasks/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tasks = response.data;
        const now = new Date();

        tasks.forEach((task) => {
          const taskDateTime = new Date(`${task.due_date}T${task.due_time}`);
          const diffInMs = taskDateTime - now;
          const taskId = task.id;

          if (
            diffInMs > 0 &&
            diffInMs < 60000 &&
            !triggeredTaskIds.has(taskId)
          ) {
            alarmSound.current.play().catch((e) => console.error("Audio error:", e));
            setActiveAlarm(task);
            setTriggeredTaskIds((prev) => new Set(prev).add(taskId));
          }
        });
      } catch (error) {
        console.error("Error checking tasks:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [triggeredTaskIds]);

  const handleSnooze = () => {
    if (alarmSound.current) {
      alarmSound.current.pause();             // Stop the audio
      alarmSound.current.currentTime = 0;     // Reset to the beginning
      // No need to reassign or disable looping here unless you face bugs
    }
    setActiveAlarm(null);
  };
  
  

  return (
    <>
      {activeAlarm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center animate-bounce max-w-md w-11/12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">⏰ Task Reminder</h2>
            <p className="text-lg font-medium text-gray-700 mb-6">
              <strong>{activeAlarm.title}</strong> is due now!
            </p>
            <button
              onClick={handleSnooze}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl text-lg transition duration-200"
            >
              Snooze
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AlarmWatcher;
