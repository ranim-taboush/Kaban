import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Check, GripVertical } from 'lucide-react';

// Mock data for demonstration
const initialTasks = [
  {
    id: 1,
    title: "Design login page",
    description: "Create a mockup for the new login page",
    column: "backlog"
  },
  {
    id: 2,
    title: "Draft user survey",
    description: "Prepare questions for the user feedback survey",
    column: "backlog"
  },
  {
    id: 3,
    title: "Implement authentication",
    description: "Add OAuth2 support for user logins",
    column: "in-progress"
  },
  {
    id: 4,
    title: "Update dependencies",
    description: "Upgrade project to use latest libraries",
    column: "in-progress"
  },
  {
    id: 5,
    title: "Code cleanup",
    description: "Refactor code to improve readability",
    column: "review"
  },
  {
    id: 6,
    title: "Write documentation",
    description: "Document the API endpoints and usage",
    column: "review"
  },
  {
    id: 7,
    title: "Fix login bug",
    description: "Resolve the issue with login errors",
    column: "done"
  },
  {
    id: 8,
    title: "Deploy to production",
    description: "Push the latest changes to the live server",
    column: "done"
  }
];

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' }
];

const ITEMS_PER_PAGE = 3;

export default function KanbanDashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState({
    backlog: 1,
    'in-progress': 1,
    review: 1,
    done: 1
  });

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get paginated tasks for a column
  const getPaginatedTasks = (columnId) => {
    const columnTasks = filteredTasks.filter(task => task.column === columnId);
    const startIndex = (currentPage[columnId] - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      tasks: columnTasks.slice(startIndex, endIndex),
      totalPages: Math.ceil(columnTasks.length / ITEMS_PER_PAGE),
      currentPage: currentPage[columnId],
      totalTasks: columnTasks.length
    };
  };

  // Handle pagination
  const handlePageChange = (columnId, page) => {
    setCurrentPage(prev => ({ ...prev, [columnId]: page }));
  };

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    if (draggedTask && draggedTask.column !== targetColumn) {
      setTasks(prev => prev.map(task =>
        task.id === draggedTask.id
          ? { ...task, column: targetColumn }
          : task
      ));
    }
    setDraggedTask(null);
  };

  // CRUD operations
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      column: 'backlog'
    };
    setTasks(prev => [...prev, newTask]);
    setShowAddModal(false);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Dashboard</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Add Task Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map(column => {
            const { tasks: columnTasks, totalPages, currentPage: page, totalTasks } = getPaginatedTasks(column.id);
            
            return (
              <div
                key={column.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className={`${column.color} p-4 rounded-t-lg`}>
                  <h3 className="font-semibold text-gray-800 flex items-center justify-between">
                    {column.title}
                    <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                      {totalTasks}
                    </span>
                  </h3>
                </div>

                {/* Tasks */}
                <div className="p-4 space-y-3 min-h-[400px]">
                  {columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDragStart={handleDragStart}
                      onEdit={() => setEditingTask(task)}
                      onDelete={() => deleteTask(task.id)}
                      isEditing={editingTask?.id === task.id}
                      onSave={(updates) => updateTask(task.id, updates)}
                      onCancel={() => setEditingTask(null)}
                    />
                  ))}
                  
                  {columnTasks.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      {searchTerm ? 'No matching tasks' : 'No tasks'}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handlePageChange(column.id, page - 1)}
                        disabled={page === 1}
                        className="px-2 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
                      >
                        ←
                      </button>
                      <span className="text-sm text-gray-600">
                        {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(column.id, page + 1)}
                        disabled={page === totalPages}
                        className="px-2 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Task Modal */}
        {showAddModal && (
          <AddTaskModal
            onSave={addTask}
            onCancel={() => setShowAddModal(false)}
          />
        )}
      </div>
    </div>
  );
}

// Task Card Component
function TaskCard({ task, onDragStart, onEdit, onDelete, isEditing, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title: title.trim(), description: description.trim() });
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
          placeholder="Task title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
          rows="2"
          placeholder="Task description"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-600 text-white px-2 py-1 rounded text-sm hover:bg-gray-700"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm flex-1">{task.title}</h4>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <GripVertical className="w-3 h-3 text-gray-400" />
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-blue-600 p-1"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 p-1"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-xs">{task.description}</p>
    </div>
  );
}

// Add Task Modal Component
function AddTaskModal({ onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
              placeholder="Enter task description"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          >
            Add Task
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}