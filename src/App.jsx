import { useState } from "react";
import { analyzeUI } from "./services/gemma";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setFileName(file.name);
      setAnalysis(null);
      setGeneratedCode("");
      setError("");
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setError("");
    setAnalysis(null);
    setGeneratedCode("");

    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          const base64 = reader.result.split(",")[1];

          // Step 1: Analyze screenshot with Gemma
          const result = await analyzeUI(base64, blob.type);

          setAnalysis(result);

          // Step 2: Generate React code from analysis
          const codeResponse = await fetch(
            "http://localhost:3001/api/generate-code",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                analysis: result,
              }),
            }
          );

          const codeData = await codeResponse.json();

          if (!codeResponse.ok) {
            throw new Error(
              codeData.error || "React code generation failed"
            );
          }

          setGeneratedCode(codeData.code || "");
        } catch (err) {
          console.error(err);
          setError(err.message || "Analysis failed. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
      setError("Could not process the image.");
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">✦ AI-POWERED UI ANALYSIS</div>

        <h1>🔎 UI Detective</h1>

        <p>
          Turn website screenshots into intelligent, reusable React UI
        </p>
      </header>

      <main className="main">
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

          {image && (
            <>
              <div className="preview">
                <img src={image} alt="Uploaded interface" />
              </div>

              <p className="file-name">📎 {fileName}</p>
            </>
          )}

          <button
            className="analyze-button"
            disabled={!image || loading}
            onClick={handleAnalyze}
          >
            {loading ? "🔄 Analyzing & Generating..." : "🔍 Analyze UI"}
          </button>

          {error && (
            <p style={{ color: "#ff6b6b", marginTop: "15px" }}>
              {error}
            </p>
          )}
        </section>

        <section className="results">
          {/* UI Analysis */}
          <div className="panel">
            <h2>UI Analysis</h2>

            {!analysis ? (
              <div className="placeholder">
                <span>🔍</span>

                <p>
                  Upload a screenshot and
                  <br />
                  AI analysis will appear here.
                </p>
              </div>
            ) : (
              <div>
                <h3>UI Elements</h3>
                <ul>
                  {analysis.uiElements?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>Layout</h3>
                <p>{analysis.layout?.description}</p>

                {analysis.layout?.sections?.length > 0 && (
                  <ul>
                    {analysis.layout.sections.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}

                <h3>Colors</h3>
                <ul>
                  {analysis.colors?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>Typography</h3>
                <p>
                  <strong>Heading:</strong>{" "}
                  {analysis.typography?.heading}
                  <br />
                  <strong>Body:</strong>{" "}
                  {analysis.typography?.body}
                  <br />
                  <strong>Notes:</strong>{" "}
                  {analysis.typography?.notes}
                </p>

                <h3>Buttons</h3>
                <ul>
                  {analysis.buttons?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>Navigation</h3>
                <ul>
                  {analysis.navigation?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>Cards / Sections</h3>
                <ul>
                  {analysis.cardsOrSections?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>Accessibility Issues</h3>
                <ul>
                  {analysis.accessibilityIssues?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>Suggestions</h3>
                <ul>
                  {analysis.suggestions?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* React Code */}
          <div className="panel">
            <h2>React Code</h2>

            {!generatedCode ? (
              <div className="placeholder">
                <span>⚛️</span>

                <p>
                  Generated React components
                  <br />
                  will appear here.
                </p>
              </div>
            ) : (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  overflowX: "auto",
                  maxHeight: "600px",
                  overflowY: "auto",
                  padding: "15px",
                  fontSize: "12px",
                  lineHeight: "1.5",
                }}
              >
                {generatedCode}
              </pre>
            )}
          </div>
        </section>

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

      <footer>Built for Hack Day · UI Detective</footer>
    </div>
  );
}

export default App;