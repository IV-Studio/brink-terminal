export interface GameCommand {
  command: string;
  username?: string;
  context?: string;
  room?: string;
  station?: string;
  character?: string;
  clearanceLevel?: number;
  keywords?: string[];
  localCoordinates?: [number, number];
  tileSetCoordinates?: [number, number];
}

/** Story dictionaries contain authored content and retain their existing shapes. */
export interface GameResponse {
  command?: string;
  username: string;
  context?: string;
  clearanceLevel: number;
  keywords: string[];
  terminalMessages: string[];
  messages?: Record<string, unknown>;
  characters?: Record<string, unknown>;
  rooms?: Record<string, unknown>;
  files?: Record<string, unknown>;
  characterFiles?: Record<string, unknown>;
  newContext?: string;
  changeRoom?: string;
  conversationResponse?: string;
  eventMoment?: boolean;
}
