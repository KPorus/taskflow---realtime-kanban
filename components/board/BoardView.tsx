import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { updateTask, createTask, fetchTasks, setActiveTeam, deleteTask, deleteTeam } from '../../store/slices/dataSlice';
import { TaskStatus, TaskPriority, Task, User } from '../../types';
import { BoardColumn } from './BoardColumn';
import { Modal } from '../ui/Modal';
import { Menu, Trash2, AlertTriangle, Settings } from 'lucide-react';

interface DashboardContext {
  setSidebarOpen: (isOpen: boolean) => void;
}

export const BoardView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const { setSidebarOpen } = useOutletContext<DashboardContext>();
  
  const { tasks, users, teams } = useSelector((state: RootState) => state.data);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const currentTeam = teams.find(t => t.id === teamId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isTeamSettingsOpen, setIsTeamSettingsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>(TaskStatus.TODO);

  useEffect(() => {
    if (teamId) {
      dispatch(setActiveTeam(teamId));
      dispatch(fetchTasks(teamId));
    }
  }, [teamId, dispatch]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    dispatch(updateTask({ taskId, updates: { status: newStatus } }));
  };

  const openNewTaskModal = (status: TaskStatus) => {
    setEditingTask(null);
    setNewTaskStatus(status);
    setTitle('');
    setDescription('');
    setPriority(TaskPriority.MEDIUM);
    setAssigneeId('');
    setDueDate('');
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setAssigneeId(task.assigneeId || '');
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !currentUser) return;

    const taskData = {
      title,
      description,
      priority,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };

    if (editingTask) {
      await dispatch(updateTask({
        taskId: editingTask.id,
        updates: taskData
      }));
    } else {
      await dispatch(createTask({
        ...taskData,
        status: newTaskStatus,
        teamId: teamId,
        creatorId: currentUser.id
      }));
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = async () => {
    if (editingTask && editingTask.teamId) {
      await dispatch(deleteTask({ taskId: editingTask.id, teamId: editingTask.teamId }));
      setIsDeleteConfirmOpen(false);
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  const handleDeleteTeam = async () => {
    if (teamId) {
      await dispatch(deleteTeam(teamId));
      setIsTeamSettingsOpen(false);
      navigate('/dashboard');
    }
  };

  const canDelete = editingTask && currentUser && (editingTask.creatorId === currentUser.id || currentTeam?.ownerId === currentUser.id);
  const isOwner = currentUser && currentTeam?.ownerId === currentUser.id;

  return (
    <div className="flex flex-col h-full w-full">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-10">
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
           <button 
             onClick={() => setSidebarOpen(true)}
             className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
           >
             <Menu size={24} />
           </button>

           <div className="min-w-0">
             <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
               {currentTeam ? currentTeam.name : 'Loading...'}
             </h2>
             <p className="text-xs text-gray-500 hidden sm:block">Board View</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center -space-x-2 flex-shrink-0">
              {currentTeam?.members.slice(0, 5).map(m => {
                  const user = typeof m.user === 'object' ? m.user as User : null;
                  return user ? (
                      <div key={user.id} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center" title={user.name}>
                          <span className="text-xs font-bold text-indigo-700">
                            {user.name.charAt(0)}
                          </span>
                      </div>
                  ) : null;
              })}
              {currentTeam?.members && currentTeam.members.length > 5 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                  +{currentTeam.members.length - 5}
                </div>
              )}
          </div>
          
          {isOwner && (
            <button 
              onClick={() => setIsTeamSettingsOpen(true)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            >
              <Settings size={20} />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6 bg-gray-50">
        <div className="h-full flex gap-4 sm:gap-6 min-w-full lg:min-w-max pb-2">
          {Object.values(TaskStatus).map(status => (
            <BoardColumn
              key={status}
              title={status.replace('_', ' ')}
              status={status}
              tasks={tasks.filter(t => t.status === status)}
              users={currentTeam?.members
                .filter(m => typeof m.user === 'object')
                .map(m => m.user as User) || []}
              onDropTask={handleDropTask}
              onAddTask={openNewTaskModal}
              onEditTask={openEditTaskModal}
            />
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {Object.values(TaskPriority).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assignee</label>
            <select
              value={assigneeId}
              onChange={e => setAssigneeId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Unassigned</option>
              {currentTeam?.members
                .filter(m => typeof m.user === 'object')
                .map(m => {
                  const u = m.user as User;
                  return <option key={u.id} value={u.id}>{u.name}</option>;
                })}
            </select>
          </div>
          <div className="flex justify-between items-center mt-6 pt-2">
            {canDelete ? (
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            ) : (
              <div></div> 
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Task"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-100">
            <AlertTriangle size={24} className="flex-shrink-0" />
            <p className="text-sm">This action cannot be undone.</p>
          </div>
          <p className="text-gray-600">
            Are you sure you want to permanently delete the task 
            <span className="font-semibold text-gray-900 mx-1">"{editingTask?.title}"</span>?
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTask}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete Task
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isTeamSettingsOpen}
        onClose={() => setIsTeamSettingsOpen(false)}
        title="Team Settings"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Danger Zone</h4>
            <div className="border border-red-100 rounded-lg p-4 bg-red-50">
              <p className="text-sm text-red-800 mb-4 font-medium">
                Deleting this team will remove all associated members and access. 
              </p>
              <button
                onClick={handleDeleteTeam}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors text-sm"
              >
                <Trash2 size={16} />
                Delete Team Forever
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};