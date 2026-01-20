import AppRouter from './routes/AppRouter';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <div className="App">
          <AppRouter />
        </div>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;

