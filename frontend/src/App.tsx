import React, { useState, useEffect } from 'react';
import '@mantine/core/styles.css';
import { MantineProvider, Container, Title, Text, Stack, Paper, ThemeIcon, Box } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { ModalsProvider } from '@mantine/modals';
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
    <MantineProvider>
      <ModalsProvider>
        <Box 
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px 0',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
              `,
              pointerEvents: 'none'
            }}
          />
          
          <Container size="xl" py="xl" style={{ position: 'relative', zIndex: 1 }}>
            <Stack gap="xl">
              <Box
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  borderRadius: '30px',
                  padding: '40px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    right: '-50%',
                    bottom: '-50%',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }}
                />
                
                <Stack align="center" gap="lg">
                  <Title 
                    order={1} 
                    ta="center" 
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    Image Background Remover
                  </Title>
                  <Text 
                    c="white" 
                    ta="center" 
                    size="lg"
                    style={{
                      maxWidth: '600px',
                      lineHeight: 1.6,
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                      opacity: 0.9
                    }}
                  >
                    Remove the background from your images and flip them horizontally.
                  </Text>
                </Stack>
              </Box>
              
              <ImageUpload onImageUploaded={handleImageUploaded} />
              <ImageGallery 
                images={images} 
                loading={loading}
                onImageDeleted={handleImageDeleted}
                onRefresh={fetchImages}
              />
            </Stack>
          </Container>
        </Box>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
