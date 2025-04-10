interface Collaborator {
  id: string;
  name: string;
}

export interface DocumentState {
  content: string;
  title: string;
  saved: boolean;
  id: string;
  last_update: string;
  collaborators: Collaborator[];
  version: number; // Add version tracking
}
