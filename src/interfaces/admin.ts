export interface BlobTagsProps {
  clientName: string;
  categoryName: string;
  uuid: string;
}

export interface BlobProps {
  name: string;
  createdOn: Date;
  contentType: string;
  url: string;
  tags: BlobTagsProps;
}
