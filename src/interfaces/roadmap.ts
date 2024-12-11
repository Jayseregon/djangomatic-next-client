export interface CardType {
  id: string;
  title: string;
  description: string;
  color: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  projects: ProjectType[];
}

export interface SortableItemProps {
  id: string;
  data?: any;
  children: React.ReactNode;
}

export interface ProjectType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  cards: CardType[];
}
