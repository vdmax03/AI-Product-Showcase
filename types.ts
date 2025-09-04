export enum GenerationMode {
  Lookbook = 'Lookbook',
  Broll = 'B-roll',
}

export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  videoSrc?: string | null;
  isVideoGenerating?: boolean;
  videoError?: string | null;
}
