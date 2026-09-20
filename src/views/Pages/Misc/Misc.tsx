import Roact from "@rbxts/roact";
import { hooked } from "@rbxts/roact-hooked";
import Canvas from "components/Canvas";
import Card from "components/Card";
import { useTheme } from "hooks/use-theme";
import { DashboardPage } from "store/models/dashboard.model";
import { px, scale } from "utils/udim2";
import GistLoader from "./GistLoader";

/**
 * The command bar. Styled as a `Card` like every other page so it matches the
 * rest of the dashboard instead of floating as a full-width overlay.
 */
function Misc() {
	const theme = useTheme("clock");

	return (
		<Card index={4} page={DashboardPage.Misc} theme={theme} size={px(326, 500)} position={new UDim2(0, 0, 0, 0)}>
			<textlabel
				Text="Commands"
				Font="GothamBlack"
				TextSize={20}
				TextColor3={theme.foreground}
				TextXAlignment="Left"
				TextYAlignment="Top"
				Position={px(24, 24)}
				BackgroundTransparency={1}
			/>
			<Canvas size={px(326, 412)} position={px(0, 68)} padding={{ left: 24, right: 24, top: 8 }} clipsDescendants>
				<scrollingframe
					Size={scale(1, 1)}
					CanvasSize={px(0, 400)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					ScrollBarImageTransparency={1}
					ScrollBarThickness={0}
					ClipsDescendants={false}
				>
					<GistLoader />
				</scrollingframe>
			</Canvas>
		</Card>
	);
}

export default hooked(Misc);
