interface Collaborator {
  id: string;
  name: string;
}

export interface Image {
  id: string;
  url: string;
  alt?: string;
}

export interface DocumentState {
  content: string;
  title: string;
  saved: boolean;
  id: string;
  last_update: string;
  collaborators: Collaborator[];
  version: number; // Add version tracking
  images: Image[]; // Add images array to store document images
}
