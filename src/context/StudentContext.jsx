import { createContext, useContext, useReducer, useCallback } from 'react';
import studentData from '../data/studentData';

// ============================================
// Context
// ============================================
const StudentContext = createContext(null);

// ============================================
// Initial State
// ============================================
const initialState = {
  ...studentData,
  // Simulation state
  activeScenario: null,
  simulationResults: null,
  savedScenarios: [],
  // UI state
  sidebarOpen: true,
};

// ============================================
// Reducer
// ============================================
function studentReducer(state, action) {
  switch (action.type) {
    case 'SET_SCENARIO':
      return { ...state, activeScenario: action.payload };

    case 'SET_SIMULATION_RESULTS':
      return { ...state, simulationResults: action.payload };

    case 'SAVE_SCENARIO':
      return {
        ...state,
        savedScenarios: [
          ...state.savedScenarios,
          { id: Date.now(), name: action.payload.name, scenario: state.activeScenario, results: state.simulationResults },
        ],
      };

    case 'DELETE_SCENARIO':
      return {
        ...state,
        savedScenarios: state.savedScenarios.filter(s => s.id !== action.payload),
      };

    case 'CLEAR_SIMULATION':
      return { ...state, activeScenario: null, simulationResults: null };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };

    default:
      return state;
  }
}

// ============================================
// Provider
// ============================================
export function StudentProvider({ children }) {
  const [state, dispatch] = useReducer(studentReducer, initialState);

  const setScenario = useCallback((scenario) => {
    dispatch({ type: 'SET_SCENARIO', payload: scenario });
  }, []);

  const setSimulationResults = useCallback((results) => {
    dispatch({ type: 'SET_SIMULATION_RESULTS', payload: results });
  }, []);

  const saveScenario = useCallback((name) => {
    dispatch({ type: 'SAVE_SCENARIO', payload: { name } });
  }, []);

  const deleteScenario = useCallback((id) => {
    dispatch({ type: 'DELETE_SCENARIO', payload: id });
  }, []);

  const clearSimulation = useCallback(() => {
    dispatch({ type: 'CLEAR_SIMULATION' });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const setSidebar = useCallback((open) => {
    dispatch({ type: 'SET_SIDEBAR', payload: open });
  }, []);

  const value = {
    ...state,
    setScenario,
    setSimulationResults,
    saveScenario,
    deleteScenario,
    clearSimulation,
    toggleSidebar,
    setSidebar,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

// ============================================
// Hook
// ============================================
export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}

export default StudentContext;
