import { createStore } from '@/shared/store/factory';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'failed' | 'size_error';
type ProcessingStatus = 'extracting' | 'interpreting' | 'finalizing' | 'done';

interface LabResultsState {
  uploadStatus: UploadStatus;
  processingStatus: ProcessingStatus;
  progress: number;
  selectedFile: {
    name: string;
    size: string;
    type: string;
    uri: string;
  } | null;
  setUploadStatus: (status: UploadStatus) => void;
  setProcessingStatus: (status: ProcessingStatus) => void;
  setProgress: (progress: number) => void;
  setSelectedFile: (file: LabResultsState['selectedFile']) => void;
  reset: () => void;
}

export const useLabResultsStore = createStore<LabResultsState>((set) => ({
  uploadStatus: 'idle',
  processingStatus: 'extracting',
  progress: 0,
  selectedFile: null,

  setUploadStatus: (uploadStatus) => set({ uploadStatus }),
  setProcessingStatus: (processingStatus) => set({ processingStatus }),
  setProgress: (progress) => set({ progress }),
  setSelectedFile: (selectedFile) => set({ selectedFile }),
  
  reset: () => set({ 
    uploadStatus: 'idle', 
    processingStatus: 'extracting', 
    progress: 0, 
    selectedFile: null 
  }),
}));
