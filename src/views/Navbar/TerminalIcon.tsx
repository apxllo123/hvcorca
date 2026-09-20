import Roact from "@rbxts/roact";
import { hooked } from "@rbxts/roact-hooked";
import { BindingOrValue } from "utils/binding-util";
import { px, scale } from "utils/udim2";

interface Props {
	color: BindingOrValue<Color3>;
	transparency: BindingOrValue<number>;
}

/**
 * Terminal icon for the command tab, drawn from UI elements.
 *
 * The other tabs use uploaded images, but the asset the command tab used
 * (`rbxassetid://84061544875190`) no longer resolves -- Roblox's thumbnail API
 * returns an image URL that 404s -- so the tab drew a blank icon. Drawing the
 * glyph here needs no upload and cannot rot the same way.
 *
 * Geometry is a solid `>_` prompt in the same 36x36 box as the image icons,
 * sized to match their weight so the tabs stay visually consistent.
 */
function TerminalIcon({ color, transparency }: Props) {
	return (
		<frame
			Size={px(36, 36)}
			Position={scale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
		>
			<frame
				Key="PromptUpper"
				Size={px(15, 3)}
				Position={px(14.9, 13.9)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Rotation={28.3}
				BackgroundColor3={color}
				BackgroundTransparency={transparency}
				BorderSizePixel={0}
			/>
			<frame
				Key="PromptLower"
				Size={px(15, 3)}
				Position={px(14.9, 20.9)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Rotation={-28.3}
				BackgroundColor3={color}
				BackgroundTransparency={transparency}
				BorderSizePixel={0}
			/>
			<frame
				Key="Cursor"
				Size={px(9, 3)}
				Position={px(23.9, 25.4)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={color}
				BackgroundTransparency={transparency}
				BorderSizePixel={0}
			/>
		</frame>
	);
}

export default hooked(TerminalIcon);
