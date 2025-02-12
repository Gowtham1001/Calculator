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
  history: [],
  
  addComponent: (component) => 
    set((state) => ({ 
      components: [...state.components, {
        ...component,
        id: `component-${Date.now()}`,
        width: 60,
        height: 60,
      }]
    })),

  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((comp) => comp.id !== id)
    })),

  updateComponentPosition: (id, position) =>
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
    }),

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