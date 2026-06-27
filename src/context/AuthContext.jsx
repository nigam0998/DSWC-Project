import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'acad_twin_auth';
const USERS_KEY = 'acad_twin_users';

function getStoredAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function getStoredUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredAuth);
  const [users, setUsers] = useState(getStoredUsers);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const register = useCallback((name, email, password, branch, semester) => {
    const exists = users.find(u => u.email === email);
    if (exists) return { success: false, message: 'An account with this email already exists.' };

    const newUser = {
      id: 'STU' + Date.now().toString().slice(-6),
      name,
      email,
      password,
      branch: branch || 'Computer Science & Engineering',
      semester: parseInt(semester) || 5,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return { success: true };
  }, [users]);

  const login = useCallback((email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, message: 'Invalid email or password.' };

    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
