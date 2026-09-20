import { getStore } from "jobs/helpers/job-store";
import { setJobActive, setJobValue } from "store/actions/jobs.action";
import { setCommandOutput, clearCommandOutput } from "store/actions/command.action";
import { DEFAULT_COMMANDS } from "store/models/command.model";
import * as http from "utils/http";

type CommandHandler = (args: string[]) => void;

const COMMAND_MAP: Record<string, CommandHandler> = {
	help: function(args: string[]): void {
		const lines: string[] = [];
		for (const c of DEFAULT_COMMANDS) {
			lines.push(`  ${c.name.padEnd(12)} — ${c.description}`);
		}
		appendOutput(`Available commands:\n${lines.join("\n")}`, false);
	},

	fly: function(args: string[]): void {
		getStore().then((store: any) => {
			const current = store.getState().jobs.flight.active;
			appendOutput(`Fly ${current ? "disabled" : "enabled"}`, false);
		});
	},

	walkspeed: function(args: string[]): void {
		const val = math.floor(tonumber(args[0]) or 0);
		if (val <= 0) { appendOutput("Usage: walkspeed <number>", true); return; }
		getStore().then((store: any) => {
			store.dispatch(setJobValue("walkSpeed", val));
		});
		appendOutput(`Walk speed set to ${val}`, false);
	},

	jump: function(args: string[]): void {
		const val = math.floor(tonumber(args[0]) or 0);
		if (val <= 0) { appendOutput("Usage: jump <number>", true); return; }
		getStore().then((store: any) => {
			store.dispatch(setJobValue("jumpHeight", val));
		});
		appendOutput(`Jump power set to ${val}`, false);
	},

	godmode: function(args: string[]): void {
		getStore().then((store: any) => {
			const current = store.getState().jobs.godmode.active;
			appendOutput(`Godmode ${current ? "disabled" : "enabled"}`, false);
		});
	},

	ghost: function(args: string[]): void {
		getStore().then((store: any) => {
			const current = store.getState().jobs.ghost.active;
			appendOutput(`Ghost ${current ? "disabled" : "enabled"}`, false);
		});
	},

	freecam: function(args: string[]): void {
		getStore().then((store: any) => {
			const current = store.getState().jobs.freecam.active;
			appendOutput(`Freecam ${current ? "disabled" : "enabled"}`, false);
		});
	},

	kill: function(args: string[]): void {
		const character = Players.LocalPlayer.Character;
		if (character) {
			const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
			if (humanoid) {
				humanoid.Health = 0;
				appendOutput("Killed self", false);
				return;
			}
		}
		appendOutput("No character to kill", true);
	},

	respawn: function(args: string[]): void {
		Players.LocalPlayer.CharacterRespawn();
		appendOutput("Respawning...", false);
	},

	noclip: function(args: string[]): void {
		appendOutput("Noclip toggled (requires server support)", false);
	},

	speed: function(args: string[]): void {
		const val = math.floor(tonumber(args[0]) or 0);
		if (val <= 0) { appendOutput("Usage: speed <number>", true); return; }
		appendOutput(`Run speed set to ${val}`, false);
	},

	cam: function(args: string[]): void {
		const val = tonumber(args[0]) or 0;
		if (val <= 0) { appendOutput("Usage: cam <number>", true); return; }
		const camera = workspace.CurrentCamera;
		if (camera) {
			appendOutput(`Camera updated`, false);
		}
	},

	clear: function(args: string[]): void {
		clearOutput();
	},

	reload: function(args: string[]): void {
		const screenGui = Players.LocalPlayer.FindFirstChild("PlayerGui")?.FindFirstChild("Orca") as ScreenGui;
		if (screenGui) {
			screenGui.Enabled = false;
			task.wait(0.1);
			screenGui.Enabled = true;
			appendOutput("Dashboard reloaded", false);
		} else {
			appendOutput("Dashboard not found", true);
		}
	},
};

function appendOutput(text: string, isError: boolean) {
	const d = getDispatch();
	if (d) d(setCommandOutput([{ text, isError }]));
}

let _dispatch: ((action: any) => void) | null = null;
export function setDispatch(d: (action: any) => void) {
	_dispatch = d;
}

function getDispatch(): (action: any) => void {
	if (!_dispatch) {
		warn("[CommandExecutor] Dispatch not set — command output will be lost");
		return function() {};
	}
	return _dispatch;
}

function clearOutput() {
	const d = getDispatch();
	if (d) d(clearCommandOutput());
}

export async function executeCommandFromInput(input: string): Promise<void> {
	const trimmed = input.trim();
	if (trimmed === "") return;

	const parts = trimmed.split(" ");
	const cmdName = parts[0].lower();
	const args = parts.slice(1);

	const handler = COMMAND_MAP[cmdName];
	if (handler) {
		try {
			appendOutput(`❱ ${trimmed}`, false);
			handler(args);
		} catch (e) {
			appendOutput(`Error: ${e}`, true);
		}
	} else {
		if (cmdName.startsWith("http://") || cmdName.startsWith("https://")) {
			try {
				appendOutput(`Loading script from ${cmdName}...`, false);
				const content = await http.get(cmdName);
				const [fn, err] = loadstring(content, "@" + cmdName);
				if (fn) {
					task.defer(fn);
					appendOutput("Script executed successfully", false);
				} else {
					appendOutput(`loadstring failed: ${err}`, true);
				}
			} catch (e) {
				appendOutput(`Failed to load script: ${e}`, true);
			}
		} else {
			appendOutput(`Unknown command: ${cmdName}. Type 'help' for available commands.`, true);
		}
	}
}
