"use client";
import axios from "axios";
import Todo from "@/Components/Todo";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [todoData, setTodoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch todos from the API
  const fetchTodos = async () => {
    try {
      setError(null); // Clear any previous errors
      const response = await axios.get("/api");
      setTodoData(response.data.todos);
    } catch (err) {
      setError("Failed to load todos. Please try again.");
    }
  };

  const deleteTodo = async (id) => {
    const response = await axios.delete(`/api`, {
      params: { mongoId: id },
    });
    toast.success(response.data.msg);
    fetchTodos();
  };

  const completeTodo = async (id) => {
    const response = await axios.put(
      `/api`,
      {},
      {
        params: { mongoId: id },
      }
    );
    toast.success(response.data.msg);
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((form) => ({ ...form, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api", formData);
      toast.success(response.data.msg);
      setFormData({ title: "", description: "" }); // Clear form data
      fetchTodos(); // Refresh todos list
    } catch (err) {
      setError("Failed to add todo. Please try again.");
      toast.error("Error adding todo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <form
        onSubmit={onSubmitHandler}
        className="flex items-start flex-col gap-2 w-[80%] max-w-[600px] mt-24 px-2 mx-auto"
      >
        <input
          onChange={onChangeHandler}
          value={formData.title}
          type="text"
          name="title"
          placeholder="Enter title"
          className="px-3 py-2 border-2 w-full"
        />
        <textarea
          onChange={onChangeHandler}
          value={formData.description}
          name="description"
          placeholder="Enter description"
          className="px-3 py-2 border-2 w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-11 py-3 text-white ${
            loading ? "bg-gray-400" : "bg-orange-600"
          }`}
          aria-busy={loading}
        >
          {loading ? "Adding..." : "Add to-do"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      <div className="relative overflow-x-auto mt-24 w-[60%] max-w-[800px] mx-auto">
        <table className="w-full text-sm text-left text-gray-500 bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {todoData.map((item, index) => (
              <Todo
                key={item._id}
                id={index + 1}
                title={item.title}
                description={item.description}
                complete={item.isCompleted}
                mongoId={item._id}
                deleteTodo={deleteTodo}
                completeTodo={completeTodo}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
