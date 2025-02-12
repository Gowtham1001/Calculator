import { create } from 'zustand';

const useCalculatorStore = create((set, get) => ({
  components: [],
  displayConfig: {
    id: 'display',
    position: { x: 20, y: 20 },
    width: 280,
    height: 80,
    fontSize: 24,
    backgroundColor: '#ffffff',
    textColor: '#000000',
  },
  expression: '',
  result: '0',
  
  // History tracking for undo/redo
  history: [],
  currentHistoryIndex: -1,
  
  // Saved layouts
  savedLayouts: [],

  // Action to save current state to history
  saveToHistory: () => {
    const currentState = get();
    const newHistory = [
      ...currentState.history.slice(0, currentState.currentHistoryIndex + 1),
      {
        components: [...currentState.components],
        displayConfig: { ...currentState.displayConfig }
      }
    ];

    set({
      history: newHistory,
      currentHistoryIndex: newHistory.length - 1
    });
  },

  // Undo action
  undo: () => {
    const { currentHistoryIndex, history } = get();
    if (currentHistoryIndex > 0) {
      const previousState = history[currentHistoryIndex - 1];
      set({
        components: [...previousState.components],
        displayConfig: { ...previousState.displayConfig },
        currentHistoryIndex: currentHistoryIndex - 1
      });
    }
  },

  // Redo action
  redo: () => {
    const { currentHistoryIndex, history } = get();
    if (currentHistoryIndex < history.length - 1) {
      const nextState = history[currentHistoryIndex + 1];
      set({
        components: [...nextState.components],
        displayConfig: { ...nextState.displayConfig },
        currentHistoryIndex: currentHistoryIndex + 1
      });
    }
  },

  // Save current layout
  saveLayout: (name) => {
    const { components, displayConfig } = get();
    const layout = {
      id: Date.now(),
      name,
      components: [...components],
      displayConfig: { ...displayConfig },
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      savedLayouts: [...state.savedLayouts, layout]
    }));

    // Save to localStorage
    const savedLayouts = JSON.parse(localStorage.getItem('calculatorLayouts') || '[]');
    localStorage.setItem('calculatorLayouts', JSON.stringify([...savedLayouts, layout]));
  },

  // Load saved layout
  loadLayout: (layoutId) => {
    const { savedLayouts } = get();
    const layout = savedLayouts.find(l => l.id === layoutId);
    if (layout) {
      set({
        components: [...layout.components],
        displayConfig: { ...layout.displayConfig }
      });
      get().saveToHistory();
    }
  },

  // Load saved layouts from localStorage
  loadSavedLayouts: () => {
    const savedLayouts = JSON.parse(localStorage.getItem('calculatorLayouts') || '[]');
    set({ savedLayouts });
  },

  // Existing actions modified to include history
  addComponent: (component) => {
    const newComponent = {
      ...component,
      id: `component-${Date.now()}`,
      width: 60,
      height: 60,
    };
    
    set((state) => ({ 
      components: [...state.components, newComponent]
    }));
    get().saveToHistory();
  },

  removeComponent: (id) => {
    set((state) => ({
      components: state.components.filter((comp) => comp.id !== id)
    }));
    get().saveToHistory();
  },

  updateComponentPosition: (id, position) => {
    set((state) => {
      if (id === 'display') {
        return {
          displayConfig: {
            ...state.displayConfig,
            position
          }
        };
      }
      return {
        components: state.components.map((comp) =>
          comp.id === id ? { ...comp, position } : comp
        )
      };
    });
    get().saveToHistory();
  },

  updateDisplayConfig: (config) =>
    set((state) => ({
      displayConfig: {
        ...state.displayConfig,
        ...config
      }
    })),

  setExpression: (expression) => set({ expression }),
  
  calculateResult: () =>
    set((state) => {
      try {
        const result = new Function('return ' + state.expression)();
        const newHistory = [...state.history, {
          expression: state.expression,
          result: String(result)
        }];
        return { 
          result: String(result), 
          expression: '',
          history: newHistory.slice(-10) // Keep last 10 calculations
        };
      } catch (error) {
        return { result: 'Error', expression: '' };
      }
    }),

  clearCalculator: () => set({ expression: '', result: '0' }),
}));

export default useCalculatorStore;