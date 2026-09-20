import { Rodux } from "@rbxts/rodux";

export type CommandsAction =
	| Rodux.InferActionFromCreator<typeof setCommandTerminalOpen>
	| Rodux.InferActionFromCreator<typeof setCommandInput>
	| Rodux.InferActionFromCreator<typeof addCommandToHistory>
	| Rodux.InferActionFromCreator<typeof setCommandHistoryIndex>
	| Rodux.InferActionFromCreator<typeof clearCommandHistory>
	| Rodux.InferActionFromCreator<typeof setCommandOutput>
	| Rodux.InferActionFromCreator<typeof clearCommandOutput>
	| Rodux.InferActionFromCreator<typeof executeCommand>
	| Rodux.InferActionFromCreator<typeof setExecuting>
	| Rodux.InferActionFromCreator<typeof setRunBarValue>
	| Rodux.InferActionFromCreator<typeof setRunBarOpen>;

export const setCommandTerminalOpen = Rodux.makeActionCreator(
	"commands/setCommandTerminalOpen",
	(isOpen: boolean) => ({ isOpen }),
);
export const setCommandInput = Rodux.makeActionCreator(
	"commands/setCommandInput",
	(input: string) => ({ input }),
);
export const addCommandToHistory = Rodux.makeActionCreator(
	"commands/addCommandToHistory",
	(command: string) => ({ command }),
);
export const setCommandHistoryIndex = Rodux.makeActionCreator(
	"commands/setCommandHistoryIndex",
	(index: number) => ({ index }),
);
export const clearCommandHistory = Rodux.makeActionCreator(
	"commands/clearCommandHistory",
	() => ({}),
);
export const setCommandOutput = Rodux.makeActionCreator(
	"commands/setCommandOutput",
	(output: { text: string; isError: boolean }[]) => ({ output }),
);
export const clearCommandOutput = Rodux.makeActionCreator(
	"commands/clearCommandOutput",
	() => ({}),
);
export const executeCommand = Rodux.makeActionCreator(
	"commands/executeCommand",
	() => ({}),
);
export const setExecuting = Rodux.makeActionCreator(
	"commands/setExecuting",
	(executing: boolean) => ({ executing }),
);
export const setRunBarValue = Rodux.makeActionCreator(
	"commands/setRunBarValue",
	(value: number) => ({ value }),
);
export const setRunBarOpen = Rodux.makeActionCreator(
	"commands/setRunBarOpen",
	(isOpen: boolean) => ({ isOpen }),
);
