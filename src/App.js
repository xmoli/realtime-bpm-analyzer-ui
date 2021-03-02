import './App.css';
import AudioPlayer from './AudioPlayer'

function App() {
  document.title = "BPM Analyzer"
  return (
    <div className="App">
      <header className="App-header">
      <AudioPlayer/>
      </header>
    </div>
  );
}

export default App;
