/**
 * Validate if a string is a valid URL
 */
export const isValidURL = (url: string): boolean => {
  if (!url || url.trim().length === 0) {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate if a URL is a valid YouTube URL
 */
export const isValidYouTubeURL = (url: string): boolean => {
  if (!isValidURL(url)) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check for various YouTube URL formats
    const isYouTube = 
      hostname === 'www.youtube.com' ||
      hostname === 'youtube.com' ||
      hostname === 'youtu.be' ||
      hostname === 'm.youtube.com';
    
    if (!isYouTube) {
      return false;
    }

    // For youtu.be, just check if there's a path
    if (hostname === 'youtu.be') {
      return urlObj.pathname.length > 1;
    }

    // For youtube.com, check for video ID in query params or path
    const hasVideoId = urlObj.searchParams.has('v') || urlObj.pathname.includes('/embed/') || urlObj.pathname.includes('/watch');
    
    return hasVideoId;
  } catch {
    return false;
  }
};

/**
 * Validate file type for video files
 */
export const isValidVideoFile = (file: File): boolean => {
  const validTypes = [
    'video/mp4',
    'video/webm',
    'video/x-matroska',
    'video/x-msvideo',
    'video/quicktime',
  ];

  return validTypes.includes(file.type);
};

/**
 * Validate file type for document files
 */
export const isValidDocumentFile = (file: File): boolean => {
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];

  return validTypes.includes(file.type);
};

/**
 * Validate file size (max 500MB for videos)
 */
export const isValidFileSize = (file: File, maxSizeMB: number = 500): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// Local store: Validate audio file types
export const isValidAudioFile = (file: File): boolean => {
  const validTypes = [
    'audio/mpeg',         // MP3
    'audio/mp3',
    'audio/wav',          // WAV
    'audio/wave',
    'audio/x-wav',
    'audio/flac',         // FLAC
    'audio/x-flac',
    'audio/aac',          // AAC
    'audio/ogg',          // OGG
    'audio/opus',         // Opus
    'audio/webm',         // WebM Audio
    'audio/m4a',          // M4A
    'audio/x-m4a',
  ];

  return validTypes.includes(file.type);
};

// Local store: Validate image file types
export const isValidImageFile = (file: File): boolean => {
  const validTypes = [
    'image/jpeg',         // JPEG/JPG
    'image/jpg',
    'image/png',          // PNG
    'image/gif',          // GIF
    'image/webp',         // WebP
    'image/svg+xml',      // SVG
    'image/bmp',          // BMP
    'image/x-ms-bmp',
    'image/tiff',         // TIFF
    'image/heic',         // HEIC
    'image/heif',         // HEIF
  ];

  return validTypes.includes(file.type);
};

// Local store: Validate any media file (video, audio, image, document)
export const isValidMediaFile = (file: File): boolean => {
  return (
    isValidVideoFile(file) ||
    isValidAudioFile(file) ||
    isValidImageFile(file) ||
    isValidDocumentFile(file)
  );
};

// Local store: Get media type from file
export const getMediaType = (file: File): 'video' | 'audio' | 'image' | 'document' | 'unknown' => {
  if (isValidVideoFile(file)) return 'video';
  if (isValidAudioFile(file)) return 'audio';
  if (isValidImageFile(file)) return 'image';
  if (isValidDocumentFile(file)) return 'document';
  return 'unknown';
};

