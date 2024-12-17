export interface CardType {
  id: string;
  title: string;
  description: string;
  category?: RoadmapCardCategory | null; // Allow null
  color: string;
  position: number; // Position within category
  createdAt: Date;
  updatedAt: Date;
  roadmapCardCategoryId?: string | null;
  projectCards?: RoadmapProjectCardType[]; // Make this optional
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
  comment?: string | null;
  members?: string | null;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  projectCards: RoadmapProjectCardType[]; // This is the main collection we use now
}

export interface RoadmapProjectCardType {
  id: string;
  projectId: string;
  cardId: string;
  position: number;
  card?: CardType | null; // Allow null
  project?: Omit<ProjectType, "projectCards"> | null; // Remove projectCards from nested project
}

export interface AddInputProps {
  placeholder: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  setShowInput: (value: boolean) => void;
  onClick: () => void;
}

export interface RoadmapCardProps {
  card: CardType;
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
  providedCategories?: RoadmapCardCategory[];
}
