export interface CardType {
  id: string;
  title: string;
  description: string;
  color: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}
