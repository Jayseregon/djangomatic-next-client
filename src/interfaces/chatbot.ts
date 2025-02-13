export interface MessageProps {
  message: {
    id: string;
    role: "data" | "user" | "system" | "assistant";
    content: string;
  };
}
