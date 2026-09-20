import Roact from "@rbxts/roact";
import { hooked } from "@rbxts/roact-hooked";
import Canvas from "components/Canvas";
import Fill from "components/Fill";
import Border from "components/Border";
import BrightSlider from "components/BrightSlider";
import BrightButton from "components/BrightButton";
import { useAppDispatch, useAppSelector } from "hooks/common/rodux-hooks";
import { useSpring } from "hooks/common/use-spring";
import { setRunBarValue, setRunBarOpen } from "store/actions/command.action";
import { setJobValue } from "store/actions/jobs.action";
import { hex, rgb } from "utils/color3";
import { px, scale } from "utils/udim2";

const RUN_BAR_W = px(0, 360);
const RUN_BAR_H = px(0, 220);

function RunBarComponent() {
	const dispatch = useAppDispatch();
	const runBarValue = useAppSelector((s: any) => s.commands.runBarValue);
	const runBarOpen = useAppSelector((s: any) => s.commands.runBarOpen);
	const speedVal: number = runBarValue;

	return (
		<Canvas
			size={new UDim2(RUN_BAR_W.X.Scale, RUN_BAR_W.X.Offset, RUN_BAR_H.Y.Scale, RUN_BAR_H.Y.Offset)}
			anchor={new Vector2(0.5, 1)}
			position={new UDim2(0.5, 0, 1, -12)}
			visible={runBarOpen}
		>
			<Fill color={rgb(16, 16, 18)} radius={10} transparency={0} />
			<Border color={hex("#3a3a3a")} radius={10} transparency={0.7} />

			<Canvas size={new UDim2(1, 0, 0, 28)} position={px(0, 0)}>
				<Fill color={rgb(24, 24, 27)} radius={10} transparency={0} />
				<Border color={hex("#ffffff")} radius={10} transparency={0.5} />
				<uicorner CornerRadius={new UDim(0, 10)} ApplyTo={Enum.ApplyMode.Neighbors} />
				<textlabel
					Text="RUN SPEED"
					TextColor3={hex("#ffffff")}
					Font="GothamBold"
					TextSize={13}
					Position={px(12, 0)}
					BackgroundTransparency={1}
				/>
				<textlabel
					Text={`${math.floor(speedVal)} studs/s`}
					TextColor3={hex("#cc2929")}
					Font="GothamBold"
					TextSize={12}
					Position={new UDim2(1, -12, 0.5, -9)}
					BackgroundTransparency={1}
					TextXAlignment="Right"
				/>
				<textbutton
					Text="✕"
					TextColor3={hex("#888888")}
					Font="GothamBold"
					TextSize={11}
					Size={px(22, 22)}
					Position={new UDim2(1, -28, 0.5, -11)}
					BackgroundTransparency={1}
					Event={{
						MouseButton1Click: () => dispatch(setRunBarOpen(false)),
					}}
				>
					<uicorner CornerRadius={new UDim(0, 4)} />
				</textbutton>
			</Canvas>

			<Canvas size={new UDim2(1, 0, 0, 2)} position={px(1, 1)}>
				<Fill color={hex("#cc2929")} radius={1} transparency={0} />
			</Canvas>

			<Canvas size={new UDim2(1, -16, 0, 44)} position={px(8, 34)}>
				<Fill color={rgb(20, 20, 22)} radius={6} transparency={0} />
				<Border color={hex("#ffffff")} radius={6} transparency={0.4} />
				<textlabel
					Text="Speed"
					TextColor3={hex("#888888")}
					Font="Gotham"
					TextSize={11}
					Position={px(10, 0)}
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={1}
				/>
				<textlabel
					Text={`${math.floor(speedVal)}`}
					TextColor3={hex("#ffffff")}
					Font="GothamBold"
					TextSize={15}
					Position={new UDim2(1, -36, 0.5, -14)}
					BackgroundTransparency={1}
					TextXAlignment="Right"
				/>
				<BrightSlider
					size={new UDim2(new UDim(1, -50, 0, 0), new UDim(1, 0, 0, 0))}
					min={0}
					max={200}
					initialValue={speedVal}
					onValueChanged={(v: number) => dispatch(setRunBarValue(v))}
					accentColor={hex("#cc2929")}
					position={px(42, 4)}
				/>
			</Canvas>

			<Canvas size={new UDim2(1, -16, 0, 28)} position={px(8, 1, 82, -1)}>
				<Fill color={rgb(20, 20, 22)} radius={6} transparency={0} />
				<textlabel
					Text="Quick presets"
					TextColor3={hex("#888888")}
					Font="Gotham"
					TextSize={10}
					Position={px(10, 0)}
					BackgroundTransparency={1}
				/>
				<BrightButton
					size={px(56, 24)}
					position={new UDim2(0, 90, 0.5, -12)}
					radius={5}
					color={hex("#cc2929")}
					borderEnabled={false}
					transparency={0}
					onActivate={() => dispatch(setRunBarValue(16))}
				>
					<textlabel
						Text="Walk"
						TextColor3={hex("#ffffff")}
						Font="GothamBold"
						TextSize={10}
						TextXAlignment="Center"
						TextYAlignment="Center"
						Size={scale(1, 1)}
						BackgroundTransparency={1}
					/>
				</BrightButton>
				<BrightButton
					size={px(56, 24)}
					position={new UDim2(0, 150, 0.5, -12)}
					radius={5}
					color={rgb(40, 40, 45)}
					borderEnabled={true}
					borderColor={hex("#ffffff")}
					borderTransparency={0.50}
					transparency={0}
					onActivate={() => dispatch(setRunBarValue(24))}
				>
					<textlabel
						Text="Sprint"
						TextColor3={hex("#cccccc")}
						Font="GothamBold"
						TextSize={10}
						TextXAlignment="Center"
						TextYAlignment="Center"
						Size={scale(1, 1)}
						BackgroundTransparency={1}
					/>
				</BrightButton>
				<BrightButton
					size={px(56, 24)}
					position={new UDim2(0, 210, 0.5, -12)}
					radius={5}
					color={rgb(40, 40, 45)}
					borderEnabled={true}
					borderColor={hex("#ffffff")}
					borderTransparency={0.50}
					transparency={0}
					onActivate={() => dispatch(setRunBarValue(0))}
				>
					<textlabel
						Text="Stop"
						TextColor3={hex("#cccccc")}
						Font="GothamBold"
						TextSize={10}
						TextXAlignment="Center"
						TextYAlignment="Center"
						Size={scale(1, 1)}
						BackgroundTransparency={1}
					/>
				</BrightButton>
			</Canvas>

			<BrightButton
				size={new UDim2(1, -16, 0, 32)}
				position={px(8, 1, 3, 114)}
				radius={6}
				color={hex("#cc2929")}
				borderEnabled={false}
				transparency={0}
				onActivate={() => {
					dispatch(setJobValue("walkSpeed", math.floor(speedVal)));
					dispatch(setRunBarOpen(false));
				}}
			>
				<textlabel
					Text="Apply Speed"
					TextColor3={hex("#ffffff")}
					Font="GothamBold"
					TextSize={13}
					TextXAlignment="Center"
					TextYAlignment="Center"
					Size={scale(1, 1)}
					BackgroundTransparency={1}
				/>
			</BrightButton>

			<textlabel
				Text="F3 · type 'walkspeed <n>'"
				TextColor3={hex("#555555")}
				Font="Gotham"
				TextSize={10}
				Position={new UDim2(1, -100, 1, -10)}
				BackgroundTransparency={1}
			/>
		</Canvas>
	);
}

export default hooked(RunBarComponent);
