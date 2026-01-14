import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { RootState, AppDispatch } from './store/store';
import { loadUser } from './store/slices/authSlice';
import { fetchTeams, socketTaskCreated, socketTaskUpdated, socketTaskDeleted, socketTeamUpdated } from './store/slices/dataSlice';
import { AuthScreen } from './components/auth/AuthScreen';
import { Sidebar } from './components/layout/Sidebar';
import { BoardView } from './components/board/BoardView';
import { socket, SOCKET_EVENTS } from './services/socket';
import { mapTask, mapTeam } from './services/apiService';

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeTeamId } = useSelector((state: RootState) => state.data);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchTeams());
    }
  }, [user, dispatch]);

  useEffect(() => {
    // Join the team room whenever the active team changes
    if (activeTeamId) {
      socket.emit(SOCKET_EVENTS.JOIN_TEAM, activeTeamId);
    }

    // Set up listeners for Backend events
    const handleTaskCreated = (rawTask: any) => {
      if (rawTask) dispatch(socketTaskCreated(mapTask(rawTask)));
    };

    const handleTaskUpdated = (rawTask: any) => {
      if (rawTask) dispatch(socketTaskUpdated(mapTask(rawTask)));
    };

    const handleTaskDeleted = (rawTaskOrId: any) => {
      // Backend might send the full object or just { _id }
      const id = rawTaskOrId._id || rawTaskOrId.id || rawTaskOrId; 
      if (id) dispatch(socketTaskDeleted(id));
    };

    const handleTeamUpdated = (rawTeam: any) => {
      if (rawTeam) dispatch(socketTeamUpdated(mapTeam(rawTeam)));
    };

    socket.on(SOCKET_EVENTS.TASK_CREATED, handleTaskCreated);
    socket.on(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
    socket.on(SOCKET_EVENTS.TASK_ASSIGNED, handleTaskUpdated); // Re-use update logic
    socket.on(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);
    socket.on(SOCKET_EVENTS.TEAM_MEMBER_ADDED, handleTeamUpdated);
    socket.on(SOCKET_EVENTS.TEAM_MEMBER_REMOVED, handleTeamUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.TASK_CREATED, handleTaskCreated);
      socket.off(SOCKET_EVENTS.TASK_UPDATED, handleTaskUpdated);
      socket.off(SOCKET_EVENTS.TASK_ASSIGNED, handleTaskUpdated);
      socket.off(SOCKET_EVENTS.TASK_DELETED, handleTaskDeleted);
      socket.off(SOCKET_EVENTS.TEAM_MEMBER_ADDED, handleTeamUpdated);
      socket.off(SOCKET_EVENTS.TEAM_MEMBER_REMOVED, handleTeamUpdated);
    };
  }, [activeTeamId, dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <Outlet context={{ setSidebarOpen }} />
      </main>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  const { teams } = useSelector((state: RootState) => state.data);
  
  if (teams.length > 0) {
    return <Navigate to={`/dashboard/${teams[0].id}`} replace />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
      <p>Select a team from the sidebar or create a new one to get started.</p>
    </div>
  );
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <AuthScreen /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<DashboardHome />} />
          <Route path=":teamId" element={<BoardView />} />
        </Route>

        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </HashRouter>
  );
};

export default App;