export interface GeneratedImage {
  imageUrl: string;
  timestamp: number;
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64Data: string;
  mimeType: string;
}

export enum AppState {
  IDLE = 'IDLE',
  PREVIEW = 'PREVIEW',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}