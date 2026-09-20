import Rodux from "@rbxts/rodux";
import { CommandsAction } from "../actions/command.action";
import { CommandsState, DEFAULT_STATE } from "../models/command.model";

export const commandsReducer = Rodux.createReducer<CommandsState, CommandsAction>(
	DEFAULT_STATE,
	{
		["commands/setCommandTerminalOpen"]: (state: CommandsState, action: { isOpen: boolean }) => ({
			...state,
			isOpen: action.isOpen,
		}),
		["commands/setCommandInput"]: (state: CommandsState, action: { input: string }) => ({
			...state,
			input: action.input,
		}),
		["commands/addCommandToHistory"]: (state: CommandsState, action: { command: string }) => ({
			...state,
			history: [action.command, ...state.history],
			historyIndex: 0,
		}),
		["commands/setCommandHistoryIndex"]: (state: CommandsState, action: { index: number }) => ({
			...state,
			historyIndex: action.index,
		}),
		["commands/clearCommandHistory"]: (state: CommandsState) => ({
			...state,
			history: [],
			historyIndex: -1,
		}),
		["commands/setCommandOutput"]: (state: CommandsState, action: { output: { text: string; isError: boolean }[] }) => ({
			...state,
			output: action.output,
		}),
		["commands/clearCommandOutput"]: (state: CommandsState) => ({
			...state,
			output: [],
		}),
		["commands/executeCommand"]: (state: CommandsState) => ({ ...state }),
		["commands/setExecuting"]: (state: CommandsState, action: { executing: boolean }) => ({
			...state,
			executing: action.executing,
		}),
		["commands/setRunBarValue"]: (state: CommandsState, action: { value: number }) => ({
			...state,
			runBarValue: action.value,
		}),
		["commands/setRunBarOpen"]: (state: CommandsState, action: { isOpen: boolean }) => ({
			...state,
			runBarOpen: action.isOpen,
		}),
	},
);
