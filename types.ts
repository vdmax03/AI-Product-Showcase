export enum GenerationMode {
  Lookbook = 'Lookbook',
  Broll = 'B-roll',
  ProfilePicture = 'Profile Picture',
}

export interface StylePreset {
  id: string;
  name: string;
  prompt: string;
  description?: string;
}

export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  videoSrc?: string | null;
  isVideoGenerating?: boolean;
  videoError?: string | null;
  isFavorite?: boolean;
}

export enum Gender {
  Female = 'Female',
  Male = 'Male',
}

export enum ShotType {
  Face = 'Face',
  UpperBody = 'Upper Body',
  FullBody = 'Full Body',
  Random = 'Random',
}

export enum ProfileStyle {
  MixedStyles = 'Mixed Styles',
  Professional = 'Professional',
  Casual = 'Casual',
  HighFashion = 'High-Fashion',
}

