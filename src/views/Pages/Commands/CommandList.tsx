import Roact from "@rbxts/roact";
import { hooked, useState } from "@rbxts/roact-hooked";
import Canvas from "components/Canvas";
import Fill from "components/Fill";
import Border from "components/Border";
import { useAppDispatch, useAppSelector } from "hooks/common/rodux-hooks";
import { useSpring } from "hooks/common/use-spring";
import { setCommandTerminalOpen } from "store/actions/command.action";
import { executeCommandFromInput } from "utils/command-executor";
import { hex, rgb } from "utils/color3";
import { px } from "utils/udim2";
import { Command, DEFAULT_COMMANDS } from "store/models/command.model";

function PresetCommandList() {
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((s: any) => s.commands.isOpen);
	const [search, setSearch] = useState("");
	const [cat, setCat] = useState("all");

	const filtered = DEFAULT_COMMANDS.filter((cmd: Command) => {
		if (cat !== "all" && cmd.category !== cat) return false;
		if (search !== "") {
			const q = search.lower();
			if (!cmd.name.lower().find(q) && !cmd.description.lower().find(q)) return false;
		}
		return true;
	});

	const cats = ["all"].concat(
		Array.from(new Set(DEFAULT_COMMANDS.map((c: Command) => c.category))),
	);

	return (
		<Canvas
			size={new UDim2(0, 520, 0, 440)}
			position={useSpring(
				isOpen
					? new UDim2(0.5, 0, 0.5, 0)
					: new UDim2(0.5, 0, 0.5, -500),
				{ frequency: 3, dampingRatio: 0.7 },
			)}
			anchor={new Vector2(0.5, 0.5)}
			visible={isOpen}
		>
			<Fill color={rgb(18, 18, 20)} radius={12} transparency={0} />
			<Border color={hex("#ffffff")} radius={12} transparency={0.7} />

			<Canvas size={new UDim2(1, 0, 0, 40)} position={px(0, 0)}>
				<Fill color={rgb(26, 26, 28)} radius={12} transparency={0} />
				<Border color={hex("#ffffff")} radius={12} transparency={0.5} />
				<uicorner CornerRadius={new UDim(0, 12)} ApplyTo={Enum.ApplyMode.Neighbors} />
				<textlabel
					Text="⚡ Command Presets"
					TextColor3={hex("#ffffff")}
					Font="GothamBold"
					TextSize={15}
					Position={px(16, 0)}
					BackgroundTransparency={1}
				/>
				<textbutton
					Text="✕"
					TextColor3={hex("#888888")}
					Font="GothamMedium"
					TextSize={12}
					Size={px(24, 24)}
					Position={new UDim2(1, -30, 0.5, -12)}
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

			<Canvas size={new UDim2(1, -12, 0, 36)} position={px(6, 44)}>
				<Fill color={rgb(22, 22, 24)} radius={8} transparency={0} />
				<Border color={hex("#ffffff")} radius={8} transparency={0.5} />
				<textlabel
					Text="🔍"
					TextColor3={hex("#888888")}
					Font="Gotham"
					TextSize={13}
					Position={px(10, 0)}
					BackgroundTransparency={1}
				/>
				<textbox
					Size={new UDim2(1, -56, 1, -8)}
					Position={px(30, 4)}
					Text={search}
					PlaceholderText="Search commands..."
					PlaceholderColor3={hex("#555555")}
					TextColor3={hex("#CCCCCC")}
					TextSize={13}
					Font="Gotham"
					TextXAlignment="Left"
					BackgroundTransparency={1}
					Event={{
						Changed: (rbx: any) => setSearch(rbx.Text),
					}}
				>
					<uicorner CornerRadius={new UDim(0, 5)} />
				</textbox>
			</Canvas>

			<Canvas size={new UDim2(1, -12, 0, 28)} position={px(6, 84)}>
				{cats.map((c: string, i: number) => {
					const isActive = cat === c;
					const label: string = c === "all" ? "All" : c.capitalize();
					return (
						<textbutton
							key={c}
							Text={label}
							TextColor3={isActive ? hex("#ffffff") : hex("#CCCCCC")}
							Font="GothamBold"
							TextSize={11}
							Size={px(72, 26)}
							Position={px(i * 76, 0)}
							BackgroundTransparency={1}
							BackgroundColor3={isActive ? hex("#CC2929") : rgb(35, 35, 35)}
							Event={{
								MouseButton1Click: function() {
									setCat(c);
								},
							}}
						>
							<uicorner CornerRadius={new UDim(0, 5)} />
						</textbutton>
					);
				})}
			</Canvas>

			<Canvas size={new UDim2(1, -12, 1, -130)} position={px(6, 116)}>
				<scrollingframe
					Size={new UDim2(1, 0, 1, 0)}
					CanvasSize={new UDim2(0, 0, 0, math.max(filtered.size() * 52, 20))}
					AutomaticCanvasSize={Enum.AutomaticSize.Y}
					ScrollBarThickness={4}
					ScrollBarImageColor3={hex("#CC2929")}
					BorderSizePixel={0}
					BackgroundTransparency={1}
				>
					<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} Padding={new UDim(0, 6)} />
					{filtered.map((cmd: Command) => (
						<Canvas
							Key={cmd.name}
							size={px(0, 48)}
						>
							<Fill color={rgb(26, 26, 28)} radius={7} transparency={0} />
							<Border color={hex("#ffffff")} radius={7} transparency={0.5} />
							<textlabel
								Text={cmd.name}
								TextColor3={hex("#ffffff")}
								Font="GothamBold"
								TextSize={13}
								Position={px(12, 0)}
								BackgroundTransparency={1}
							/>
							<textlabel
								Text={cmd.description}
								TextColor3={hex("#888888")}
								Font="Gotham"
								TextSize={11}
								Position={px(12, 20)}
								BackgroundTransparency={1}
								TextWrapped={true}
								Size={new UDim2(1, -90, 0, 22)}
							/>
							{cmd.shortcut && (
								<textlabel
									Text={`Shortcut: ${cmd.shortcut}`}
									TextColor3={hex("#555555")}
									Font="Gotham"
									TextSize={9}
									Position={new UDim2(1, -60, 0.5, -10)}
									BackgroundTransparency={1}
								/>
							)}
							<textbutton
								Text="Run"
								TextColor3={hex("#ffffff")}
								Font="GothamBold"
								TextSize={11}
								Size={px(54, 26)}
								Position={new UDim2(1, -60, 0.5, -13)}
								BackgroundTransparency={1}
								BackgroundColor3={hex("#CC2929")}
								Event={{
									MouseButton1Click: function() {
										executeCommandFromInput(cmd.name);
									},
								}}
							>
								<uicorner CornerRadius={new UDim(0, 5)} />
							</textbutton>
						</Canvas>
					))}
					{filtered.size() === 0 && (
						<textlabel
							Text="No commands found"
							TextColor3={hex("#555555")}
							Font="Gotham"
							TextSize={13}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundTransparency={1}
						/>
					)}
				</scrollingframe>
			</Canvas>

			<Canvas size={new UDim2(1, -12, 0, 26)} position={px(6, 1, 126, -26)}>
				<Fill color={rgb(30, 30, 30)} radius={6} transparency={0} />
				<Border color={hex("#ffffff")} radius={6} transparency={0.4} />
				<textlabel
					Text={`${filtered.size()} command${filtered.size() !== 1 ? "s" : ""} · F3 for terminal`}
					TextColor3={hex("#666666")}
					Font="Gotham"
					TextSize={11}
					Position={px(12, 0)}
					BackgroundTransparency={1}
				/>
			</Canvas>
		</Canvas>
	);
}

export default hooked(PresetCommandList);
