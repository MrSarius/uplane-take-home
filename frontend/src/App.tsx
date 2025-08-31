import React, { useState, useEffect } from 'react';
import './App.css';
import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';
import { ImageData } from './types/types';

function App() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/images`);
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageUploaded = (newImage: ImageData) => {
    setImages(prev => [newImage, ...prev]);
  };

  const handleImageDeleted = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Processor</h1>
        <p>Upload images to remove backgrounds and flip them horizontally</p>
      </header>
      
      <main className="App-main">
        <ImageUpload onImageUploaded={handleImageUploaded} />
        <ImageGallery 
          images={images} 
          loading={loading}
          onImageDeleted={handleImageDeleted}
          onRefresh={fetchImages}
        />
      </main>
    </div>
  );
}

export default App;
