import React, { useState } from 'react';
import { ImageData } from '../types/types';
import './ImageGallery.css';

interface ImageGalleryProps {
  images: ImageData[];
  loading: boolean;
  onImageDeleted: (imageId: string) => void;
  onRefresh: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  loading, 
  onImageDeleted, 
  onRefresh 
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (imageId: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setDeletingId(imageId);
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/images/${imageId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          onImageDeleted(imageId);
        } else {
          alert('Failed to delete image');
        }
      } catch (error) {
        alert('Error deleting image');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="image-gallery">
        <h2>Image Gallery</h2>
        <div className="loading">Loading images...</div>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className="gallery-header">
        <h2>Processed Images</h2>
        <button onClick={onRefresh} className="refresh-button">
          Refresh
        </button>
      </div>

      {images.length === 0 ? (
        <div className="empty-gallery">
          <p>No images processed yet. Upload an image to get started!</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.id} className="image-card">
              <div className="image-container">
                <img 
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${image.processedUrl}`} 
                  alt={`Processed ${image.originalName}`}
                  className="processed-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const nextElement = target.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'block';
                    }
                  }}
                />
                <div className="image-error" style={{ display: 'none' }}>
                  <p>Image not available</p>
                </div>
              </div>
              
              <div className="image-info">
                <h3 className="image-name">{image.originalName}</h3>
                <p className="upload-date">
                  Uploaded: {formatDate(image.uploadedAt)}
                </p>
                
                <div className="image-actions">
                  <a 
                    href={`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${image.processedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-button"
                  >
                    View Full Size
                  </a>
                  
                  <button
                    onClick={() => handleDelete(image.id)}
                    disabled={deletingId === image.id}
                    className="delete-button"
                  >
                    {deletingId === image.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
