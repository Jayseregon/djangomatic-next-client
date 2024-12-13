export interface CardType {
  id: string;
  title: string;
  description: string;
  category?: RoadmapCardCategory;
  color: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  projects: ProjectType[];
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
  position: number; // Add this line
  createdAt: string;
  updatedAt: string;
  cards: CardType[];
}
