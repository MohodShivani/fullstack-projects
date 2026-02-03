import { useEffect, useState } from "react";
import API from "../services/api";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Todos() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const res = await API.get("/todo");
    setTodos(res.data.todos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900
                    flex justify-center p-6 transition-colors">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800
                      rounded-xl shadow-md p-6">

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            My Todos
          </h1>
         
        </div>

        <TodoForm onAdd={fetchTodos} />

        <div className="mt-4 space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              refresh={fetchTodos}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
