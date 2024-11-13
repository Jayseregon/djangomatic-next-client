export interface CardType {
  id: string;
  title: string;
  description: string;
  color: string;
}

export interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}
