import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import CalculatorButton from './CalculatorButton';
import CalculatorDisplay from './CalculatorDisplay';
import useCalculatorStore from '../stores/calculatorStore';
import useThemeStore from '../stores/themeStore';

const Workspace = () => {
  const { components, addComponent, updateComponentPosition } = useCalculatorStore();
  const { isDarkMode } = useThemeStore();
  const workspaceRef = useRef(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'calculator-component',
    drop: (item, monitor) => {
      const workspaceRect = workspaceRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset) return;

      // Calculate position relative to the workspace
      const position = {
        x: clientOffset.x - workspaceRect.left,
        y: clientOffset.y - workspaceRect.top
      };

      // Get workspace dimensions
      const maxWidth = workspaceRect.width;
      const maxHeight = workspaceRect.height;

      // Ensure the component stays within bounds
      position.x = Math.max(0, Math.min(position.x, maxWidth - (item.width || 60)));
      position.y = Math.max(0, Math.min(position.y, maxHeight - (item.height || 60)));

      if (item.id) {
        // Update existing component position
        updateComponentPosition(item.id, position);
      } else {
        // Add new component from toolbox
        addComponent({
          value: item.value,
          position,
          width: item.width || 60,
          height: item.height || 60,
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [addComponent, updateComponentPosition]);

  // Combine refs
  const combinedRef = (el) => {
    workspaceRef.current = el;
    drop(el);
  };

  return (
    <div
      ref={combinedRef}
      className={`
        relative w-full h-[600px] rounded-lg p-4
        ${isDarkMode ? 'bg-gray-900' : 'bg-gray-200'}
        ${isOver ? 'border-2 border-blue-500' : 'border-2 border-transparent'}
        transition-colors duration-200
      `}
    >
      <CalculatorDisplay />
      {components.map((component) => (
        <CalculatorButton
          key={component.id}
          id={component.id}
          value={component.value}
          position={component.position}
          width={component.width}
          height={component.height}
        />
      ))}
    </div>
  );
};

export default Workspace;