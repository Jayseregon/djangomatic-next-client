export interface MessageProps {
  message: {
    id: string;
    role: "data" | "user" | "system" | "assistant";
    content: string;
  };
}

export interface KeywordEmbedding {
  word: string;
  x: number;
  y: number;
}

export interface KeywordsEmbeddingResponse {
  keywords: KeywordEmbedding[];
}
