import React, { useState } from 'react';

function App() {
  const emptyContainer = {
    name: '',
    image: '',
    command: '',
    args: '',
    ports: '',
    env: ''
  };
  const [mainContainer, setMainContainer] = useState(emptyContainer);
  const [sidecars, setSidecars] = useState([{ ...emptyContainer }]);
  const [yamlOutput, setYamlOutput] = useState('');
  const [error, setError] = useState('');

  const handleAddSidecar = () => {
    setSidecars([...sidecars, { ...emptyContainer }]);
  };

  const handleSidecarChange = (index, field, value) => {
    const newSidecars = [...sidecars];
    newSidecars[index][field] = value;
    setSidecars(newSidecars);
  };

  const handleSubmit = async () => {
    setError('');
    setYamlOutput('');
    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Sending request to:', `${API_BASE}/api/deploy/generate-yaml`);
      const requestData = {
          mainContainer: mainContainer,
          sidecarContainers: sidecars,
      };
      console.log('Request data:', JSON.stringify(requestData, null, 2));
      
      const response = await fetch(`${API_BASE}/api/deploy/generate-yaml`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        let errMsg = 'Error generating YAML';
        try {
          const err = await response.json();
          errMsg = err.error || err.message || errMsg;
        } catch (_) {}
        setError(errMsg);
        return;
      }
      const data = await response.json();
      setYamlOutput(data.yaml);
    } catch (e) {
      console.error('Error details:', e);
      setError(`Network error: ${e.message}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Sidecar Deployment Yaml Creation</h1>
      <h3>Main Container</h3>
      <div style={{ marginBottom: 15 }}>
        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Name"
            value={mainContainer.name}
            onChange={e => setMainContainer({ ...mainContainer, name: e.target.value })}
            style={{ marginRight: 10, width: 200 }}
          />
          <input
            type="text"
            placeholder="Image"
            value={mainContainer.image}
            onChange={e => setMainContainer({ ...mainContainer, image: e.target.value })}
            style={{ width: 300 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Command (comma-separated)"
            value={mainContainer.command}
            onChange={e => setMainContainer({ ...mainContainer, command: e.target.value })}
            style={{ marginRight: 10, width: 250 }}
          />
          <input
            type="text"
            placeholder="Arguments (comma-separated)"
            value={mainContainer.args}
            onChange={e => setMainContainer({ ...mainContainer, args: e.target.value })}
            style={{ width: 250 }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Ports (comma-separated)"
            value={mainContainer.ports}
            onChange={e => setMainContainer({ ...mainContainer, ports: e.target.value })}
            style={{ marginRight: 10, width: 200 }}
          />
          <input
            type="text"
            placeholder="Env vars (KEY=VALUE,KEY2=VALUE2)"
            value={mainContainer.env}
            onChange={e => setMainContainer({ ...mainContainer, env: e.target.value })}
            style={{ width: 300 }}
          />
        </div>
      </div>

      <h3>Sidecars</h3>
      {sidecars.map((sc, i) => (
        <div key={i} style={{ marginBottom: 20, padding: 10, border: '1px solid #ccc', borderRadius: 5 }}>
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Name"
              value={sc.name}
              onChange={e => handleSidecarChange(i, 'name', e.target.value)}
              style={{ marginRight: 10, width: 200 }}
            />
            <input
              type="text"
              placeholder="Image"
              value={sc.image}
              onChange={e => handleSidecarChange(i, 'image', e.target.value)}
              style={{ width: 300 }}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Command (comma-separated)"
              value={sc.command}
              onChange={e => handleSidecarChange(i, 'command', e.target.value)}
              style={{ marginRight: 10, width: 250 }}
            />
            <input
              type="text"
              placeholder="Arguments (comma-separated)"
              value={sc.args}
              onChange={e => handleSidecarChange(i, 'args', e.target.value)}
              style={{ width: 250 }}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Ports (comma-separated)"
              value={sc.ports}
              onChange={e => handleSidecarChange(i, 'ports', e.target.value)}
              style={{ marginRight: 10, width: 200 }}
            />
            <input
              type="text"
              placeholder="Env vars (KEY=VALUE,KEY2=VALUE2)"
              value={sc.env}
              onChange={e => handleSidecarChange(i, 'env', e.target.value)}
              style={{ width: 300 }}
            />
          </div>
          <button
            onClick={() => {
              const newSidecars = sidecars.filter((_, index) => index !== i);
              setSidecars(newSidecars);
            }}
            style={{ marginTop: 10, backgroundColor: '#ffecec', color: '#d63939', border: '1px solid #d63939', borderRadius: 3, padding: '4px 8px' }}
          >
            Remove Sidecar
          </button>
        </div>
      ))}
      <button onClick={handleAddSidecar} style={{ marginTop: 10 }}>
        Add Sidecar
      </button>
      <br />
      <button
        onClick={handleSubmit}
        style={{
          marginTop: 20,
          padding: '8px 16px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Generate YAML
      </button>

      {error && (
        <div style={{
          color: '#d63939',
          backgroundColor: '#ffecec',
          padding: '10px 15px',
          marginTop: 20,
          borderRadius: 4,
          border: '1px solid #d63939'
        }}>
          Error: {error}
        </div>
      )}
      
      {yamlOutput && (
        <div style={{ marginTop: 20 }}>
          <h3>Generated YAML</h3>
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: 20,
              borderRadius: 5,
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
              fontFamily: 'monospace'
            }}
          >
            {yamlOutput}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
