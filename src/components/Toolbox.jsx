
import CalculatorButton from './CalculatorButton';
import useThemeStore from '../stores/themeStore';

const Toolbox = () => {
  const { isDarkMode } = useThemeStore();
  
  const buttons = [
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => ({ value: String(num) })),
    { value: '+' },
    { value: '-' },
    { value: '*' },
    { value: '/' },
    { value: '=' },
    { value: 'C' },
  ];

  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Components
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((button, index) => (
          <CalculatorButton
            key={index}
            value={button.value}
            isToolbox={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Toolbox;