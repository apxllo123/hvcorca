import Roact from "@rbxts/roact";
import { hooked } from "@rbxts/roact-hooked";
import Canvas from "components/Canvas";
import Fill from "components/Fill";
import Border from "components/Border";
import BrightSlider from "components/BrightSlider";
import { useAppDispatch, useAppSelector } from "hooks/common/rodux-hooks";
import { useSpring } from "hooks/common/use-spring";
import { setRunBarValue, setRunBarOpen } from "store/actions/command.action";
import { setJobValue } from "store/actions/jobs.action";
import { hex, rgb } from "utils/color3";
import { px, scale } from "utils/udim2";

const W = px(0, 380);
const H = px(0, 240);

function RunBar() {
	const dispatch = useAppDispatch();
	const value = useAppSelector((s: any) => s.commands.runBarValue);
	const isOpen = useAppSelector((s: any) => s.commands.runBarOpen);
	const speedVal: number = value.getValue();

	return (
		<Canvas
			size={new UDim2(W.X.Scale, W.X.Offset, H.Y.Scale, H.Y.Offset)}
			position={useSpring(
				isOpen
					? new UDim2(0.5, -W.X.Offset / 2, 1, -10)
					: new UDim2(0.5, -W.X.Offset / 2, 1, 40),
				{ frequency: 3, dampingRatio: 0.7 },
			)}
			anchor={new Vector2(0.5, 1)}
			visible={isOpen}
		>
			<Fill color={rgb(18, 18, 20)} radius={10} transparency={0} />
			<Border color={hex("#000000")} radius={10} transparency={0.9} />
			<Border color={hex("#ffffff")} radius={10} transparency={0.2} />
			<Canvas size={new UDim2(1, 0, 0, 1)} position={px(1, 0)}>
				<Fill color={hex("#CC2929")} radius={1} transparency={0.8} />
			</Canvas>

			<Canvas size={new UDim2(1, 0, 0, 26)} position={px(0, 8)}>
				<Fill color={rgb(26, 26, 28)} radius={6} transparency={0} />
				<textlabel
					Text="🚀 Run Speed"
					TextColor3={hex("#ffffff")}
					Font="GothamBold"
					TextSize={13}
					Position={px(14, 0)}
					BackgroundTransparency={1}
				/>
				<textlabel
					Text={`${math.floor(speedVal)} studs/s`}
					TextColor3={hex("#CC2929")}
					Font="GothamBold"
					TextSize={13}
					Position={new UDim2(1, -14, 0.5, -10)}
					BackgroundTransparency={1}
					TextXAlignment="Right"
				/>
			</Canvas>

			<Canvas size={new UDim2(1, -16, 0, 40)} position={px(8, 40)}>
				<Fill color={rgb(22, 22, 24)} radius={6} transparency={0} />
				<Border color={hex("#ffffff")} radius={6} transparency={0.3} />
				<textlabel
					Text="Speed"
					TextColor3={hex("#888888")}
					Font="Gotham"
					TextSize={11}
					Position={new UDim2(0, 8, 0.5, 0)}
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={1}
				/>
				<textlabel
					Text={`${math.floor(speedVal)}`}
					TextColor3={hex("#ffffff")}
					Font="GothamBold"
					TextSize={14}
					Position={new UDim2(1, -36, 0.5, -14)}
					BackgroundTransparency={1}
					TextXAlignment="Right"
				/>
				<BrightSlider
					size={new UDim2(new UDim(1, -56, 0, 0), new UDim(1, 0, 0, 0))}
					min={0}
					max={100}
					defaultValue={50}
					onValueChange={(v: any) => dispatch(setRunBarValue(v))}
					value={useSpring(speedVal)}
					accentColor={hex("#CC2929")}
					thumbColor={hex("#ffffff")}
					trackColor={rgb(35, 35, 35)}
					disabledTransparency={0.6}
					position={px(44, 8)}
				/>
			</Canvas>

			<Canvas size={new UDim2(1, 0, 0, 36)} position={px(0, 1, 84, -1)}>
				<Fill color={rgb(26, 26, 28)} radius={6} transparency={0} />
				<Border color={hex("#ffffff")} radius={6} transparency={0.3} />
				<textlabel
					Text="Quick presets"
					TextColor3={hex("#888888")}
					Font="Gotham"
					TextSize={10}
					Position={px(14, 0)}
					BackgroundTransparency={1}
				/>
				<textbutton
					Text="Walk 16"
					TextColor3={hex("#ffffff")}
					Font="GothamBold"
					TextSize={10}
					Size={px(72, 26)}
					Position={new UDim2(0, 14, 1, -28)}
					BackgroundTransparency={1}
					BackgroundColor3={hex("#CC2929")}
					Event={{
						MouseButton1Click: function() {
							dispatch(setRunBarValue(16));
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0, 5)} />
				</textbutton>
				<textbutton
					Text="Sprint 24"
					TextColor3={hex("#CCCCCC")}
					Font="GothamMedium"
					TextSize={10}
					Size={px(72, 26)}
					Position={new UDim2(0, 90, 1, -28)}
					BackgroundTransparency={1}
					BackgroundColor3={rgb(50, 50, 50)}
					Event={{
						MouseButton1Click: function() {
							dispatch(setRunBarValue(24));
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0, 5)} />
					<uistroke Color={hex("#ffffff")} Thickness={1} Transparency={0.4} />
				</textbutton>
				<textbutton
					Text="Stop"
					TextColor3={hex("#CCCCCC")}
					Font="GothamMedium"
					TextSize={10}
					Size={px(72, 26)}
					Position={new UDim2(0, 166, 1, -28)}
					BackgroundTransparency={1}
					BackgroundColor3={rgb(50, 50, 50)}
					Event={{
						MouseButton1Click: function() {
							dispatch(setRunBarValue(0));
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0, 5)} />
					<uistroke Color={hex("#ffffff")} Thickness={1} Transparency={0.4} />
				</textbutton>
			</Canvas>

			<textbutton
				Text="Apply Speed"
				TextColor3={hex("#ffffff")}
				Font="GothamBold"
				TextSize={13}
				Size={new UDim2(1, -16, 0, 32)}
				Position={px(8, 124)}
				BackgroundTransparency={1}
				BackgroundColor3={hex("#CC2929")}
				Event={{
					MouseButton1Click: function() {
						getStore().then((store: any) => {
							store.dispatch(setJobValue("walkSpeed", math.floor(speedVal)));
						});
						dispatch(setRunBarOpen(false));
					},
				}}
			>
				<uicorner CornerRadius={new UDim(0, 6)} />
			</textbutton>

			<textlabel
				Text="F3 console · drag to change speed"
				TextColor3={hex("#444444")}
				Font="Gotham"
				TextSize={10}
				Position={new UDim2(1, -100, 1, -10)}
				BackgroundTransparency={1}
			/>
		</Canvas>
	);
}

export default hooked(RunBar);
