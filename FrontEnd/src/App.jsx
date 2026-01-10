import AppRouter from './routes/AppRouter';
import { SettingsProvider } from './context/SettingsContext';
import './App.css';

function App() {
  return (
    <SettingsProvider>
      <div className="App">
        <AppRouter />
      </div>
    </SettingsProvider>
  );
}

export default App;

