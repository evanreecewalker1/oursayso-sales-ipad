import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './App.css';

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'dnuni9dgl',
  uploadPreset: 'portfolio_preset', // You'll need to create this in Cloudinary
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY
};

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Load existing projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate loading from the JSON structure
      const response = await fetch('/data/cms-projects.json');
      const data = await response.json();
      setProjects(data.projects || []);
      console.log('📊 CMS: Loaded projects:', data.projects?.length || 0);
    } catch (error) {
      console.error('❌ CMS: Failed to load projects:', error);
      setMessage('Failed to load projects');
    }
  };

  const updateStatus = (msg, type = 'info', duration = 3000) => {
    setStatusMessage({ text: msg, type });
    if (duration > 0) {
      setTimeout(() => setStatusMessage(''), duration);
    }
  };

  const saveProjects = async (updatedProjects) => {
    try {
      setLoading(true);
      updateStatus('💾 Saving project...', 'saving', 0);
      
      // In a real implementation, this would save to a backend API
      // For now, we'll update local state and show success message
      setProjects(updatedProjects);
      updateStatus('✅ Project saved successfully!', 'success');
      console.log('💾 CMS: Saved projects:', updatedProjects.length);
      
      // Auto-scroll to top on save
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('❌ CMS: Failed to save projects:', error);
      updateStatus('❌ Failed to save project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (file, folder = 'portfolio/previews') => {
    try {
      setLoading(true);
      updateStatus('📤 Uploading image...', 'uploading', 0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', folder);
      formData.append('public_id', `preview_${Date.now()}`);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        formData
      );

      console.log('✅ Cloudinary upload success:', response.data);
      updateStatus('✅ Image uploaded successfully!', 'success');
      return {
        url: response.data.secure_url,
        cloudinaryId: response.data.public_id,
        uploadedAt: new Date().toISOString(),
        size: response.data.bytes,
        dimensions: {
          width: response.data.width,
          height: response.data.height
        }
      };
    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error);
      updateStatus('❌ Upload failed', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cms-app">
      <header className="cms-header">
        <div className="cms-header-content">
          <div className="cms-logo-section">
            <img src="/oursayso-logo.svg" alt="OurSayso" className="cms-logo" />
            <div className="cms-title-section">
              <h1>Portfolio CMS</h1>
              <p>Manage projects, media, and preview images</p>
            </div>
          </div>
          <a 
            href="/index.html" 
            target="_blank" 
            className="view-dashboard-btn"
          >
            📊 View Dashboard
          </a>
        </div>
        
        {/* Dynamic Status Bar */}
        {statusMessage && (
          <div className={`status-bar ${statusMessage.type}`}>
            <div className="status-content">
              {statusMessage.text}
            </div>
          </div>
        )}
        
        {/* Legacy message fallback */}
        {message && !statusMessage && (
          <div className={`cms-message ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </header>

      <div className="cms-content">
        <div className="cms-sidebar">
          <h3>📁 Projects ({projects.length})</h3>
          <div className="project-list">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-title">{project.title}</div>
                <div className="project-category">{project.category}</div>
                <div className="project-media-count">
                  {project.mediaItems?.length || 0} media items
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cms-main">
          {selectedProject ? (
            <ProjectEditor
              project={selectedProject}
              projects={projects}
              onSave={saveProjects}
              onUpload={uploadToCloudinary}
              onUpdateStatus={updateStatus}
              loading={loading}
            />
          ) : (
            <div className="cms-placeholder">
              <h2>👈 Select a project to edit</h2>
              <p>Choose a project from the sidebar to manage its media and preview images</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Project Editor Component
function ProjectEditor({ project, projects, onSave, onUpload, onUpdateStatus, loading }) {
  const [editedProject, setEditedProject] = useState(project);

  useEffect(() => {
    setEditedProject(project);
  }, [project]);

  const updateMediaItem = (mediaIndex, updates) => {
    const updatedProject = { ...editedProject };
    updatedProject.mediaItems = [...updatedProject.mediaItems];
    updatedProject.mediaItems[mediaIndex] = {
      ...updatedProject.mediaItems[mediaIndex],
      ...updates
    };
    setEditedProject(updatedProject);
  };

  const saveProject = () => {
    const updatedProjects = projects.map(p => 
      p.id === editedProject.id ? editedProject : p
    );
    onSave(updatedProjects);
  };

  return (
    <div className="project-editor">
      <div className="editor-header">
        <h2>✏️ Editing: {project.title}</h2>
        <button 
          onClick={saveProject}
          className="save-button"
          disabled={loading}
        >
          {loading ? '⏳ Saving...' : '💾 Save Project'}
        </button>
      </div>

      <div className="project-info">
        <h3>📋 Project Information</h3>
        <div className="info-grid">
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={editedProject.title}
              onChange={(e) => setEditedProject({
                ...editedProject,
                title: e.target.value
              })}
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              value={editedProject.category}
              onChange={(e) => setEditedProject({
                ...editedProject,
                category: e.target.value
              })}
            />
          </div>
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={editedProject.description}
            onChange={(e) => setEditedProject({
              ...editedProject,
              description: e.target.value
            })}
            rows="3"
          />
        </div>
      </div>

      <div className="media-section">
        <h3>🎬 Media Items ({editedProject.mediaItems?.length || 0})</h3>
        <div className="media-list">
          {editedProject.mediaItems?.map((mediaItem, index) => (
            <MediaItemEditor
              key={mediaItem.id}
              mediaItem={mediaItem}
              index={index}
              onUpdate={updateMediaItem}
              onUpload={onUpload}
              onUpdateStatus={onUpdateStatus}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Media Item Editor Component
function MediaItemEditor({ mediaItem, index, onUpdate, onUpload, onUpdateStatus, loading }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = async (acceptedFiles, type) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    try {
      setUploading(true);
      const uploadResult = await onUpload(file, `portfolio/previews/${mediaItem.type}`);
      
      const previewField = type === 'preview' ? 'customPreview' : 'customThumbnail';
      onUpdate(index, {
        [previewField]: {
          ...uploadResult,
          originalName: file.name
        }
      });

      // Auto-scroll to the updated media card
      setTimeout(() => {
        const mediaCard = document.querySelector(`[data-media-index="${index}"]`);
        if (mediaCard) {
          mediaCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
    } catch (error) {
      console.error('Upload failed:', error);
      onUpdateStatus('❌ Upload failed: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleButtonUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        onDrop(files, type);
      }
    };
    input.click();
  };

  const previewDropzone = useDropzone({
    onDrop: (files) => onDrop(files, 'preview'),
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: loading || uploading
  });

  return (
    <div className="media-item-editor" data-media-index={index}>
      <div className="media-header">
        <span className="media-type-badge">{mediaItem.type.toUpperCase()}</span>
        <h4>{mediaItem.title}</h4>
      </div>

      <div className="media-content">
        <div className="media-info">
          <label>Title:</label>
          <input
            type="text"
            value={mediaItem.title}
            onChange={(e) => onUpdate(index, { title: e.target.value })}
          />
        </div>

        {/* PDF Preview Upload */}
        {mediaItem.type === 'pdf' && (
          <div className="preview-upload-section">
            <h5>📄 PDF Preview Image</h5>
            {mediaItem.customPreview ? (
              <div className="preview-display">
                <img
                  src={mediaItem.customPreview.url}
                  alt="PDF Preview"
                  className="preview-image"
                />
                <div className="preview-info">
                  <p>✅ Custom preview uploaded</p>
                  <p>{mediaItem.customPreview.dimensions?.width} x {mediaItem.customPreview.dimensions?.height}</p>
                  <button 
                    onClick={() => onUpdate(index, { customPreview: null })}
                    className="remove-preview-btn"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="preview-button-upload">
                {uploading ? (
                  <div className="upload-progress">
                    <p>⏳ Uploading preview image...</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleButtonUpload('preview')}
                    className="upload-button"
                    disabled={loading}
                  >
                    📤 Select PDF Preview Image
                  </button>
                )}
                <small>PNG, JPG, WEBP up to 10MB</small>
              </div>
            )}
          </div>
        )}

        {/* Video Thumbnail Upload */}
        {mediaItem.type === 'video' && (
          <div className="preview-upload-section">
            <h5>🎬 Video Thumbnail</h5>
            {mediaItem.customPreview ? (
              <div className="preview-display">
                <img
                  src={mediaItem.customPreview.url}
                  alt="Video Thumbnail"
                  className="preview-image"
                />
                <div className="preview-info">
                  <p>✅ Custom thumbnail uploaded</p>
                  <p>{mediaItem.customPreview.dimensions?.width} x {mediaItem.customPreview.dimensions?.height}</p>
                  <button 
                    onClick={() => onUpdate(index, { customPreview: null })}
                    className="remove-preview-btn"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                {...previewDropzone.getRootProps()}
                className={`preview-dropzone ${previewDropzone.isDragActive ? 'active' : ''}`}
              >
                <input {...previewDropzone.getInputProps()} />
                {uploading ? (
                  <p>⏳ Uploading thumbnail...</p>
                ) : (
                  <>
                    <p>📤 Drop video thumbnail here</p>
                    <p>or click to select</p>
                    <small>PNG, JPG, WEBP up to 10MB</small>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Current Files Display */}
        {mediaItem.files && mediaItem.files.length > 0 && (
          <div className="current-files">
            <h5>📁 Current Files</h5>
            {mediaItem.files.map((file, fileIndex) => (
              <div key={fileIndex} className="file-item">
                <span>{file.url || file.localPath}</span>
                <small>{file.format} • {Math.round(file.bytes / 1024)}KB</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;