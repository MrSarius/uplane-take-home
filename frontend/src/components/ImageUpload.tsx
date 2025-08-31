import React, { useState, useRef } from 'react';
import { ImageData, UploadResponse } from '../types/types';
import './ImageUpload.css';

interface ImageUploadProps {
  onImageUploaded: (image: ImageData) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setError(null);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setError('Please select an image file');
        setFile(null);
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/images/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data: UploadResponse = await response.json();
        onImageUploaded(data.image);
        
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Upload failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
    } else {
      setError('Please drop an image file');
    }
  };

  return (
    <div className="image-upload">
      <h2>Upload Image</h2>
      
      <div 
        className="upload-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
        />
        
        {!preview ? (
          <div className="upload-prompt">
            <p>Drag and drop an image here, or click to select</p>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="select-button"
            >
              Select Image
            </button>
          </div>
        ) : (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <div className="preview-actions">
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="change-button"
              >
                Change Image
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {file && (
        <div className="upload-actions">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="upload-button"
          >
            {uploading ? 'Processing...' : 'Process Image'}
          </button>
        </div>
      )}

      {uploading && (
        <div className="upload-progress">
          <p>Processing your image...</p>
          <p>This may take a few moments</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
