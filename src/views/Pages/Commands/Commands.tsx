import Roact from "@rbxts/roact";
import { hooked } from "@rbxts/roact-hooked";
import Canvas from "components/Canvas";
import Fill from "components/Fill";
import Border from "components/Border";
import { useAppDispatch, useAppSelector } from "hooks/common/rodux-hooks";
import { useSpring } from "hooks/common/use-spring";
import { setCommandTerminalOpen } from "store/actions/command.action";
import { useCommandExecutor } from "hooks/use-command-executor";
import CommandTerminal from "./CommandTerminal";
import PresetCommandList from "./CommandList";
import { hex, rgb } from "utils/color3";
import { px } from "utils/udim2";
import { UserInputService } from "@rbxts/services";

const CMD_W = px(0, 400);

function Commands() {
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((s: any) => s.commands.isOpen);
	useCommandExecutor();

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

	return (
		<Canvas
			size={new UDim2(CMD_W.X.Scale, CMD_W.X.Offset, 1, 0)}
			anchor={new Vector2(0.4, 0)}
			position={useSpring(
				isOpen
					? new UDim2(0.4, 0, 0, 40)
					: new UDim2(0.4, 0, -1, -1),
				{ frequency: 3, dampingRatio: 0.7 },
			)}
			visible={isOpen}
		>
			<Fill color={rgb(20, 20, 22)} radius={12} transparency={0} />
			<Border color={hex("#ffffff")} radius={12} transparency={0.5} />
			<uicorner CornerRadius={new UDim(0, 12)} ApplyTo={Enum.ApplyMode.Neighbors} />

			<Canvas size={new UDim2(1, 0, 0, 32)} position={px(0, 0)}>
				<Fill color={rgb(26, 26, 28)} radius={12} transparency={0} />
				<Border color={hex("#ffffff")} radius={12} transparency={0.6} />
				<uicorner CornerRadius={new UDim(0, 12)} ApplyTo={Enum.ApplyMode.Neighbors} />
				<textlabel
					Text="⚡ Commands"
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

			<Canvas size={new UDim2(1, 0, 3, 3)} position={px(0, 1)}>
				<Fill color={hex("#CC2929")} radius={1} transparency={0} />
			</Canvas>

			<PresetCommandList />
			<CommandTerminal />
		</Canvas>
	);
}

export default hooked(Commands);
