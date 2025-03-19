export interface PromptInput {
  query: string;
  [key: string]: any;
}

export interface ToolInput {
  name: string;
  arguments: Record<string, any>;
} 