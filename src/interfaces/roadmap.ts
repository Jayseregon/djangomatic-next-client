export interface CardType {
  id: string;
  title: string;
  description: string;
  category?: RoadmapCardCategory;
  color: string;
  position: number; // Position within category
  createdAt: string;
  updatedAt: string;
  projects: ProjectType[];
  projectCards: RoadmapProjectCardType[];
}

export interface RoadmapCardCategory {
  id: string;
  name: string;
}

export interface SortableItemProps {
  id: string;
  data?: any;
  children: React.ReactNode;
}

export interface ProjectType {
  id: string;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  projectCards: RoadmapProjectCardType[]; // This is the main collection we use now
}

export interface RoadmapProjectCardType {
  id: string;
  projectId: string;
  cardId: string;
  position: number;
  card?: CardType;
  project?: ProjectType;
}

export interface AddInputProps {
  placeholder: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  setShowInput: (value: boolean) => void;
  onClick: () => void;
}
