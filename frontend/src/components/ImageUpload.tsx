import React, { useState } from 'react';
import { 
  Title, 
  Text, 
  Button, 
  Group, 
  Stack, 
  Alert, 
  Progress,
  Image,
  Box,
  Badge
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX, IconReplace, IconCloudUpload } from '@tabler/icons-react';
import { ImageData, UploadResponse } from '../types/types';

interface ImageUploadProps {
  onImageUploaded: (image: ImageData) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (files: File[]) => {
    const selectedFile = files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
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

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  const handleReplaceFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

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
        <Stack align="center" gap="xs">
          <Title order={2} ta="center" style={{ color: 'white', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
            Upload Image
          </Title>
          <Text c="white" ta="center" size="sm" style={{ opacity: 0.8, textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
            Drag & drop or click to select your image
          </Text>
        </Stack>
        
        {!preview ? (
          <Dropzone
            p = {"md"}
            onDrop={handleFileSelect}
            accept={IMAGE_MIME_TYPE}
            maxSize={10 * 1024 ** 2} // 10MB
            radius="xl"
            h={220}
            style={{ 
              border: '2px dashed rgba(255, 255, 255, 0.4)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
              transition: 'all 0.3s ease'
            }}
            styles={{
              root: {
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 35px rgba(255, 255, 255, 0.1)'
                }
              }
            }}
          >
            <Stack align="center" justify="center" gap="md" style={{ pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload size={60} stroke={1.5} color="#40c057" />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={60} stroke={1.5} color="#fa5252" />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload size={60} stroke={1.5} color="rgba(255, 255, 255, 0.8)" />
              </Dropzone.Idle>

              <Stack gap={0} align="center" justify="center">
                <Text size="xl" inline style={{ color: 'white', fontWeight: 600, textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
                  Drag and drop an image here
                </Text>
                <Text size="lg" c="white" inline mt={7} display="block" style={{ opacity: 0.8, textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
                  or click to select
                </Text>
                <Badge 
                  variant="light" 
                  color="white" 
                  size="lg" 
                  mt="xs"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  Max 10MB
                </Badge>
              </Stack>
            </Stack>
          </Dropzone>
        ) : (
          <Box pos="relative">
            <Box 
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Image
                src={preview}
                alt="Preview"
                radius="lg"
                h={300}
                fit="contain"
                style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
              />
            </Box>
            <Group justify="center" mt="md">
              <Button
                variant="gradient"
                gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(255, 255, 255, 0.1)' }}
                leftSection={<IconReplace size={16} />}
                onClick={handleReplaceFile}
                radius="xl"
                size="md"
                style={{ 
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Replace Image
              </Button>
              <Button
                variant="light"
                color="red"
                leftSection={<IconX size={16} />}
                onClick={handleRemoveFile}
                radius="xl"
                size="md"
                style={{ 
                  background: 'rgba(250, 82, 82, 0.2)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(250, 82, 82, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Remove
              </Button>
            </Group>
          </Box>
        )}

        {error && ( 
          <Alert 
            color="red" 
            radius="lg"
            variant="light"
            icon={<IconX size={20} />}
            style={{
              background: 'rgba(250, 82, 82, 0.1)',
              border: '1px solid rgba(250, 82, 82, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Text size="sm" c="red" style={{ opacity: 0.9 }}>
              {error}
            </Text>
          </Alert>
        )}

        {file && (
          <Stack gap="md">
            <Box 
              p="md" 
              style={{ 
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px'
              }}
            >
              <Text size="sm" c="white" ta="center" style={{ opacity: 0.9 }}>
                Selected file: <strong>{file.name}</strong>
              </Text>
            </Box>
            
            <Button
              onClick={handleUpload}
              disabled={uploading}
              loading={uploading}
              size="lg"
              fullWidth
              variant="gradient"
              gradient={{ from: 'rgba(255, 255, 255, 0.25)', to: 'rgba(255, 255, 255, 0.15)' }}
              radius="xl"
              leftSection={!uploading && <IconUpload size={20} />}
              style={{
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
              }}
            >
              {uploading ? 'Processing...' : 'Process Image'}
            </Button>
          </Stack>
        )}

        {uploading && (
          <Alert 
            title="Processing" 
            color="blue" 
            variant="light"
            radius="lg"
            icon={<IconPhoto size={20} />}
            style={{ 
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Text size="sm" mb="md" c="white" style={{ opacity: 0.9 }}>
              Processing your image... This may take a few moments
            </Text>
            <Progress 
              value={100} 
              animated 
              color="white"
              radius="xl"
              size="lg"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            />
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default ImageUpload;