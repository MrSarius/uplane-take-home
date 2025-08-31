export interface ImageData {
  id: string;
  originalName: string;
  processedUrl: string;
  uploadedAt: string;
}

export interface UploadResponse {
  message: string;
  image: ImageData;
}
