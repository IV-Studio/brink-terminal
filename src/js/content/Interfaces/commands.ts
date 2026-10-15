export interface CommandConfig {
    command: (command: string) => boolean;
    displayName: string | (() => string);
    section: string;
    hidden?: () => boolean;
    available: () => boolean;
    action: (command: string) => void;
    response?: () => string;
}