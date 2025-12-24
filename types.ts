
export interface GeneratedLogo {
  id: string;
  url: string;
  prompt: string;
}

export interface AppState {
  companyName: string;
  philosophy: string;
  logos: GeneratedLogo[];
  isGenerating: boolean;
  error: string | null;
}
