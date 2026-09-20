export interface Command {
	name: string;
	description: string;
	category: string;
	shortcut?: string;
	args?: string[];
}

export interface CommandOutput {
	text: string;
	isError: boolean;
}

export interface CommandsState {
	isOpen: boolean;
	input: string;
	history: string[];
	historyIndex: number;
	output: CommandOutput[];
	commands: Command[];
	executing: boolean;
	runBarValue: number;
	runBarOpen: boolean;
}

export const DEFAULT_COMMANDS: Command[] = [
	{ name: "help", description: "List all available commands", category: "system" },
	{ name: "fly", description: "Toggle fly mode (F key)", category: "movement", shortcut: "F" },
	{ name: "walkspeed", description: "Set walk speed (walkspeed <number>)", category: "movement", args: ["number"] },
	{ name: "jump", description: "Set jump power (jump <number>)", category: "movement", args: ["number"] },
	{ name: "godmode", description: "Toggle godmode (G key)", category: "player", shortcut: "G" },
	{ name: "ghost", description: "Toggle ghost mode (H key)", category: "player", shortcut: "H" },
	{ name: "freecam", description: "Toggle freecam (C key)", category: "camera", shortcut: "C" },
	{ name: "kill", description: "Kill yourself", category: "player" },
	{ name: "respawn", description: "Respawn your character", category: "player" },
	{ name: "noclip", description: "Toggle noclip", category: "player" },
	{ name: "speed", description: "Set run speed (speed <number>)", category: "movement", args: ["number"] },
	{ name: "cam", description: "Set camera distance (cam <number>)", category: "camera", args: ["number"] },
	{ name: "clear", description: "Clear terminal output", category: "system" },
	{ name: "reload", description: "Reload the dashboard UI", category: "system" },
];

export const DEFAULT_STATE: CommandsState = {
	isOpen: false,
	input: "",
	history: [],
	historyIndex: -1,
	output: [],
	commands: DEFAULT_COMMANDS,
	executing: false,
	runBarValue: 16,
	runBarOpen: false,
};
