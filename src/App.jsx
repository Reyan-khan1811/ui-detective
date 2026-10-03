import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  return (
    <div className="app">
      {/* Hero */}
      <header className="header">
        <div className="logo">✦ AI-POWERED UI ANALYSIS</div>

        <h1>🔎 UI Detective</h1>

        <p>
          Turn website screenshots into intelligent, reusable React UI
        </p>
      </header>

      <main className="main">
        {/* Upload Section */}
        <section className="upload-card">
          <h2>Analyze your interface</h2>

          <p>
            Upload a website screenshot and let AI understand its visual
            structure.
          </p>

          <label className="upload-button">
            📤 Choose Screenshot

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageUpload}
              hidden
            />
          </label>

          {/* Image Preview */}
          {image && (
            <>
              <div className="preview">
                <img src={image} alt="Uploaded interface" />
              </div>

              <p className="file-name">📎 {fileName}</p>
            </>
          )}

          <button className="analyze-button" disabled={!image}>
            🔍 Analyze UI
          </button>
        </section>

        {/* Results */}
        <section className="results">
          {/* UI Analysis */}
          <div className="panel">
            <h2>UI Analysis</h2>

            <div className="placeholder">
              <span>🔍</span>

              <p>
                Upload a screenshot and
                <br />
                AI analysis will appear here.
              </p>
            </div>
          </div>

          {/* React Code */}
          <div className="panel">
            <h2>React Code</h2>

            <div className="placeholder">
              <span>⚛️</span>

              <p>
                Generated React components
                <br />
                will appear here.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="workflow">
          <div className="workflow-title">
            <span>HOW IT WORKS</span>
            <h2>From screenshot to React</h2>
          </div>

          <div className="workflow-grid">
            <div className="workflow-step">
              <div className="step-number">01</div>
              <div>
                <h3>Upload</h3>
                <p>Provide a screenshot of any web interface.</p>
              </div>
            </div>

            <div className="workflow-step">
              <div className="step-number">02</div>
              <div>
                <h3>Analyze</h3>
                <p>Gemma understands the visual UI and its structure.</p>
              </div>
            </div>

            <div className="workflow-step">
              <div className="step-number">03</div>
              <div>
                <h3>Generate</h3>
                <p>Get structured UI information and React components.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        Built for Hack Day · UI Detective
      </footer>
    </div>
  );
}

export default App;