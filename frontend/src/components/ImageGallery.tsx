import React, { useState } from 'react';
import { 
  Title, 
  Text, 
  Button, 
  Group, 
  Stack, 
  Grid, 
  Card, 
  Image, 
  Badge,
  ActionIcon,
  Modal,
  LoadingOverlay,
  Alert,
  Center,
  Box
} from '@mantine/core';
import { IconRefresh, IconTrash, IconExternalLink, IconAlertCircle, IconPhoto } from '@tabler/icons-react';
import { ImageData } from '../types/types';

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const openPreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  if (loading) {
    return (
      <Box
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
          borderRadius: '25px',
          padding: '35px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}
        pos="relative"
      >
        <LoadingOverlay visible={true} />
        <Title order={2} ta="center" mb="lg" style={{ color: 'white', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
          Image Gallery
        </Title>
        <Center>
          <Text c="white" style={{ opacity: 0.8, textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
            Loading images...
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <>
      <Box
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
          borderRadius: '25px',
          padding: '35px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(20px)',
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
              radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)
            `,
            pointerEvents: 'none'
          }}
        />
        
        <Stack gap="lg" style={{ position: 'relative', zIndex: 1 }}>
          <Group justify="space-between" align="center">
              <Title order={2} style={{ color: 'white', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
                Processed Images
              </Title>
            <Button
              variant="gradient"
              gradient={{ from: 'rgba(255, 255, 255, 0.25)', to: 'rgba(255, 255, 255, 0.15)' }}
              leftSection={<IconRefresh size={16} />}
              onClick={onRefresh}
              radius="xl"
              style={{
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
              }}
            >
              Refresh
            </Button>
          </Group>

          {images.length === 0 ? (
            <Alert 
              icon={<IconAlertCircle size={20} />} 
              title="No Images" 
              color="white" 
              variant="light"
              style={{ 
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px'
              }}
            >
              <Stack gap="md" align="center">
                <IconPhoto size={60} color="rgba(255, 255, 255, 0.6)" />
                <Text size="sm" ta="center" c="white" style={{ opacity: 0.9 }}>
                  No images processed yet. Upload an image to get started!
                </Text>
              </Stack>
            </Alert>
          ) : (
            <Grid gutter="lg">
              {images.map((image) => (
                <Grid.Col key={image.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card 
                    shadow="lg" 
                    padding="lg" 
                    radius="xl" 
                    withBorder
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)'
                    }}
                    styles={{
                      root: {
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 20px 40px rgba(255, 255, 255, 0.15)',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.12)'
                        }
                      }
                    }}
                  >
                    <Card.Section>
                      <Box
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
                          padding: '10px',
                          borderRadius: '12px 12px 0 0'
                        }}
                      >
                        <Image
                          src={`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${image.processedUrl}`}
                          alt={`Processed ${image.originalName}`}
                          height={200}
                          fit="cover"
                          radius="md"
                          fallbackSrc="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3e%3c/svg%3e"
                          onClick={() => openPreview(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${image.processedUrl}`)}
                          style={{ cursor: 'pointer' }}
                        />
                      </Box>
                    </Card.Section>

                    <Stack gap="xs" mt="md">
                      <Text fw={600} lineClamp={1} title={image.originalName} style={{ color: 'white', textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
                        {image.originalName}
                      </Text>
                      
                      <Badge 
                        variant="light" 
                        color="white" 
                        size="sm"
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        {formatDate(image.uploadedAt)}
                      </Badge>

                      <Group gap="xs" mt="xs" grow>
                        <Button
                          variant="light"
                          size="xs"
                          leftSection={<IconExternalLink size={14} />}
                          onClick={() => openPreview(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${image.processedUrl}`)}
                          fullWidth
                          style={{ 
                            background: 'rgba(255, 255, 255, 0.15)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '8px',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          Preview
                        </Button>
                        
                        <ActionIcon
                          variant="light"
                          color="red"
                          size="lg"
                          onClick={() => handleDelete(image.id)}
                          loading={deletingId === image.id}
                          title="Delete image"
                          style={{ 
                            background: 'rgba(250, 82, 82, 0.2)',
                            color: '#ff6b6b',
                            border: '1px solid rgba(250, 82, 82, 0.3)',
                            borderRadius: '8px',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Stack>
      </Box>

      <Modal
        opened={!!previewImage}
        onClose={() => setPreviewImage(null)}
        size="xl"
        title="Image Preview"
        centered
        radius="xl"
        overlayProps={{
          blur: 3,
        }}
        styles={{
          header: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '20px 20px 0 0',
            padding: '20px 25px'
          },
          title: {
            fontSize: '1.5rem',
            fontWeight: 600
          },
          body: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '25px'
          },
          root: {
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        {previewImage && (
          <Box>
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.03) 0%, transparent 50%)
                `,
                pointerEvents: 'none'
              }}
            />
            
            <Image
              src={previewImage}
              alt="Preview"
              radius="lg"
              fit="contain"
              h={400}
              style={{ 
                border: '1px solid rgba(102, 126, 234, 0.2)',
                position: 'relative',
                zIndex: 1
              }}
            />
          </Box>
        )}
      </Modal>
    </>
  );
};

export default ImageGallery;
