import { useEffect, useState } from "react";
import axios from "axios";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");


  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    due_time: "",
    priority: "Low",
    category: "Work",
    recurring: "None",
    progress: 0,
  });

  const token = localStorage.getItem("access");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/tasks/", { headers });
      setTasks(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        await refreshToken();
        fetchTasks();
      }
    }
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh });
      localStorage.setItem("access", response.data.access);
    } catch (error) {
      console.log("Refresh failed.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter(task => {
      const matchStatus = filter === "Completed" ? task.completed : !task.completed;
      const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
    setFilteredTasks(filtered);
  }, [tasks, filter, searchTerm]);
  

  const openModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setShowModal(false);
  };

  const toggleCompleted = async (task) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/tasks/${task.id}/`,
        { ...task, completed: !task.completed },
        { headers }
      );
      fetchTasks();
    } catch (error) {
      if (error.response?.status === 401) {
        await refreshToken();
        toggleCompleted(task);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`, { headers });
      fetchTasks();
      closeModal();
    } catch (error) {
      console.log("Delete failed:", error);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === "High") return "text-red-500";
    if (priority === "Medium") return "text-yellow-500";
    return "text-green-500";
  };

  const getCategoryColor = (category) => {
    const colors = {
      Work: "bg-blue-200 text-blue-800",
      Personal: "bg-purple-200 text-purple-800",
      Urgent: "bg-red-200 text-red-800",
      Others: "bg-gray-200 text-gray-800",
    };
    return colors[category] || "bg-gray-200 text-gray-800";
  };

  const openFormModal = (task = null) => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title || "",
        description: task.description || "",
        due_date: task.due_date || "",
        due_time: task.due_time || "",
        priority: task.priority || "Low",
        category: task.category || "Work",
        recurring: task.recurring || "None",
        progress: task.progress || 0,
      });
      setIsEditing(true);
    } else {
      setFormData({
        title: "",
        description: "",
        due_date: "",
        due_time: "",
        priority: "Low",
        category: "Work",
        recurring: "None",
        progress: 0,
      });
      setIsEditing(false);
    }
    setShowFormModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://127.0.0.1:8000/api/tasks/${formData.id}/`, formData, { headers });
      } else {
        await axios.post("http://127.0.0.1:8000/api/tasks/", formData, { headers });
      }
      fetchTasks();
      setShowFormModal(false);
    } catch (error) {
      console.log("Save failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-6">
        
        <div className="space-x-2">
          <button
            className={`px-4 py-2 rounded-full ${filter === "Pending" ? "bg-indigo-600 text-white" : "bg-white border"}`}
            onClick={() => setFilter("Pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-full ${filter === "Completed" ? "bg-indigo-600 text-white" : "bg-white border"}`}
            onClick={() => setFilter("Completed")}
          >
            Completed
          </button>
        </div>

        <input
    type="text"
    placeholder="Search tasks..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border px-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />

        <button
          onClick={() => openFormModal()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition"
        >
          + Create Task
        </button>
      </div>

      {/* Task Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => openModal(task)}
            className={`cursor-pointer p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1
              ${task.priority === "High" ? "bg-red-100" : task.priority === "Medium" ? "bg-yellow-100" : "bg-green-100"}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">{task.title}</h3>
              <span className="text-2xl">{task.completed ? "✅" : "❌"}</span>
            </div>
            <p className="text-gray-600 mb-1">{task.description}</p>
            <p className="text-sm text-gray-400">Due: {task.due_date || "No due date"}</p>
            <p className={`mt-2 font-semibold ${getPriorityColor(task.priority)}`}>
              Priority: {task.priority}
            </p>
            <div className={`inline-block mt-2 px-2 py-1 text-sm rounded-full ${getCategoryColor(task.category)}`}>
              {task.category}
            </div>
            <p className="text-sm mt-2 text-gray-500">Recurring: {task.recurring}</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${task.progress || 0}%` }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Progress: {task.progress || 0}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedTask.title}</h2>
            <p className="text-gray-700 mb-2">{selectedTask.description}</p>
            <p className="text-sm text-gray-400 mb-1">Due: {selectedTask.due_date || "No due date"}</p>
            <p className={`mb-1 font-semibold ${getPriorityColor(selectedTask.priority)}`}>
              Priority: {selectedTask.priority}
            </p>
            <p className="text-sm mb-1">Category: {selectedTask.category}</p>
            <p className="text-sm mb-4">Recurring: {selectedTask.recurring}</p>
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${selectedTask.progress || 0}%` }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Progress: {selectedTask.progress || 0}%</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleCompleted(selectedTask)}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Mark {selectedTask.completed ? "Incomplete" : "Complete"}
              </button>
              <button
                onClick={() => {
                  openFormModal(selectedTask);
                  closeModal();
                }}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(selectedTask.id)}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Task Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
              onClick={() => setShowFormModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Task" : "Create Task"}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-lg" required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-lg" required />
              <input type="date" name="due_date" value={formData.due_date || ""} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-lg" />
              <input type="time" name="due_time" value={formData.due_time} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-lg" />
              <select name="priority" value={formData.priority} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-lg">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select name="category" value={formData.category} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-lg">
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
                <option value="Others">Others</option>
              </select>
              <select name="recurring" value={formData.recurring} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-lg">
                <option value="None">None</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
              <input type="number" name="progress" value={formData.progress} onChange={handleFormChange} className="w-full border px-4 py-2 rounded-lg" min="0" max="100" placeholder="Progress %" />
              <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                {isEditing ? "Update Task" : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskPage;
