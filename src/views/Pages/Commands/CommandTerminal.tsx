import Roact from "@rbxts/roact";
import { hooked, useState, useEffect } from "@rbxts/roact-hooked";
import Canvas from "components/Canvas";
import Fill from "components/Fill";
import Border from "components/Border";
import { useAppDispatch, useAppSelector } from "hooks/common/rodux-hooks";
import { useSpring } from "hooks/common/use-spring";
import {
	setCommandTerminalOpen,
	setCommandInput,
	addCommandToHistory,
	setCommandHistoryIndex,
	setCommandOutput,
	clearCommandOutput,
} from "store/actions/command.action";
import { executeCommandFromInput } from "utils/command-executor";
import { hex, rgb } from "utils/color3";
import { px } from "utils/udim2";
import { UserInputService } from "@rbxts/services";

const W = px(0, 400);
const H = px(0, 300);

function CommandTerminal() {
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((s: any) => s.commands.isOpen);
	const hist = useAppSelector((s: any) => s.commands.history);
	const histIdx = useAppSelector((s: any) => s.commands.historyIndex);
	const output = useAppSelector((s: any) => s.commands.output);
	const [input, setInput] = useState("");

	useEffect(() => {
		const uss = game.GetService("UserInputService") as UserInputService;
		const conn = uss.InputBegan.Connect(function(inp: any, gp: boolean) {
			if (gp) return;
			if (inp.KeyCode === Enum.KeyCode.F3) {
				dispatch(setCommandTerminalOpen(true));
			}
		});
		return () => conn.Disconnect();
	}, [dispatch]);

	useEffect(() => {
		if (histIdx >= 0 && histIdx < hist.size()) {
			const val: string = hist[histIdx] ?? "";
			if (input !== val) setInput(val);
		}
	}, [histIdx]);

	const submit = () => {
		const cmd: string = input.trim();
		if (cmd === "") return;
		dispatch(addCommandToHistory(cmd));
		dispatch(setCommandInput(""));
		setInput("");
		executeCommandFromInput(`${cmd}`);
	};

	const onUp = () => {
		if (hist.size() === 0) return;
		const next: number = histIdx - 1;
		if (next < 0) return;
		dispatch(setCommandHistoryIndex(next));
		setInput(`${hist[next] ?? ""}`);
	};

	const onDown = () => {
		if (histIdx >= hist.size() - 1) return;
		const next: number = histIdx + 1;
		dispatch(setCommandHistoryIndex(next));
		setInput(`${hist[next] ?? ""}`);
	};

	const height: number = math.max(120, output.size() * 22);

	return (
		<Canvas
			size={new UDim2(W.X.Scale, W.X.Offset, H.Y.Scale, H.Y.Offset)}
			position={useSpring(
				isOpen
					? new UDim2(0.5, -W.X.Offset / 2, 0, 40)
					: new UDim2(0.5, -W.X.Offset / 2, -1, 0),
				{ frequency: 4, dampingRatio: 0.7 },
			)}
			anchor={new Vector2(0.5, 0)}
			visible={isOpen}
		>
			<Fill color={rgb(18, 18, 20)} radius={10} transparency={0} />
			<Border color={hex("#ffffff")} radius={10} transparency={0.7} />

			<Canvas size={new UDim2(1, 0, 0, 30)} position={px(0, 0)}>
				<Fill color={rgb(28, 28, 30)} radius={10} transparency={0} />
				<Border color={hex("#ffffff")} radius={10} transparency={0.5} />
				<uicorner CornerRadius={new UDim(0, 10)} ApplyTo={Enum.ApplyMode.Neighbors} />
				<textlabel
					Text="Console Terminal"
					TextColor3={hex("#ffffff")}
					Font="GothamBold"
					TextSize={14}
					Position={px(14, 0)}
					BackgroundTransparency={1}
				/>
				<textbutton
					Text="✕"
					TextColor3={hex("#888888")}
					Font="GothamMedium"
					TextSize={12}
					Size={px(22, 22)}
					Position={new UDim2(1, -28, 0.5, -11)}
					BackgroundTransparency={1}
					Event={{
						MouseButton1Click: function() {
							dispatch(setCommandTerminalOpen(false));
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0, 4)} />
				</textbutton>
			</Canvas>

			<Canvas size={new UDim2(1, 0, 0, 3)} position={px(1, 1)}>
				<Fill color={hex("#CC2929")} radius={2} transparency={0} />
			</Canvas>

			<Canvas size={new UDim2(1, 0, 1, -8)} position={px(0, 37)}>
				<scrollingframe
					Size={new UDim2(1, -2, 1, 0)}
					CanvasSize={new UDim2(0, 0, height, 0)}
					AutomaticCanvasSize={Enum.AutomaticSize.Y}
					ScrollBarThickness={0}
					BorderSizePixel={0}
					BackgroundTransparency={1}
				>
					<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} Padding={new UDim(0, 1)} />
					{output.map((line: any, i: number) => (
						<textlabel
							Key={i}
							LayoutOrder={i}
							Text={line.text}
							TextColor3={line.isError ? hex("#FF4444") : hex("#CCCCCC")}
							Font="Gotham"
							TextSize={13}
							BackgroundTransparency={1}
							TextXAlignment="Left"
							TextYAlignment="Top"
							Size={new UDim2(1, -10, 0, 0)}
							TextWrapped={true}
						/>
					))}
				</scrollingframe>
			</Canvas>

			<Canvas size={new UDim2(1, 0, 0, 36)} position={px(0, 1, height + 41, -1)}>
				<Fill color={rgb(24, 24, 26)} radius={6} transparency={0} />
				<Border color={hex("#ffffff")} radius={6} transparency={0.6} />
				<textlabel
					Text="❱"
					TextColor3={hex("#CC2929")}
					Font="GothamBold"
					TextSize={15}
					Position={px(10, 0)}
					BackgroundTransparency={1}
				/>
				<textbox
					Size={new UDim2(1, -70, 1, -4)}
					Position={px(32, 2)}
					Text={input}
					PlaceholderText="Type command... (F3 to open)"
					PlaceholderColor3={hex("#555555")}
					TextColor3={hex("#ffffff")}
					TextSize={14}
					Font="Gotham"
					TextXAlignment="Left"
					BackgroundTransparency={1}
					Event={{
						Changed: (rbx: any) => setInput(rbx.Text),
						ReturnPressed: submit,
						InputBegan: (rbx: any, e: any) => {
							if (e.KeyCode === Enum.KeyCode.Up) onUp();
							if (e.KeyCode === Enum.KeyCode.Down) onDown();
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0, 6)} />
				</textbox>
				<textbutton
					Text="Run"
					TextColor3={hex("#ffffff")}
					Font="GothamBold"
					TextSize={12}
					Size={px(52, 28)}
					Position={new UDim2(1, -58, 0.5, -12)}
					BackgroundTransparency={1}
					BackgroundColor3={hex("#CC2929")}
					Event={{
						MouseButton1Click: submit,
					}}
				>
					<uicorner CornerRadius={new UDim(0, 6)} />
				</textbutton>
				<textbutton
					Text="Clear"
					TextColor3={hex("#CCCCCC")}
					Font="GothamMedium"
					TextSize={11}
					Size={px(44, 28)}
					Position={new UDim2(1, -108, 0.5, -12)}
					BackgroundTransparency={1}
					Event={{
						MouseButton1Click: function() {
							dispatch(clearCommandOutput());
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0, 4)} />
					<uistroke Color={hex("#CC2929")} Thickness={1} Transparency={0.4} />
				</textbutton>
			</Canvas>

			<textlabel
				Text="F3 to toggle · ↑↓ history · Enter to run"
				TextColor3={hex("#555555")}
				Font="Gotham"
				TextSize={10}
				Position={new UDim2(1, -120, 1, -12)}
				BackgroundTransparency={1}
			/>
		</Canvas>
	);
}

export default hooked(CommandTerminal);
