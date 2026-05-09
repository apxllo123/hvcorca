import Roact from "@rbxts/roact";
import { hooked, useEffect, useState } from "@rbxts/roact-hooked";
import Canvas from "components/Canvas";
import * as http from "utils/http";
import { scale, px } from "utils/udim2";

// ─── Replace this with your Gist raw URL ───────────────────────────────────
const GIST_URL = "https://gist.githubusercontent.com/apxllo1/YOUR_GIST_ID/raw/commands.json";
// ────────────────────────────────────────────────────────────────────────────

interface Command {
	name: string;
	description: string;
	url: string;
}

declare function loadstring(chunk: string, chunkname?: string): [(...args: unknown[]) => unknown, string];

async function runCommand(cmd: Command): Promise<void> {
	try {
		const content = await http.get(cmd.url);
		const [fn, err] = loadstring(content, "@" + cmd.name);
		assert(fn, `loadstring failed for '${cmd.name}': ${err}`);
		task.defer(fn);
	} catch (e) {
		warn(`[Havoc] Failed to run '${cmd.name}': ${e}`);
	}
}

function Misc() {
	const [commands, setCommands] = useState<Command[]>([]);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("Loading...");

	useEffect(() => {
		task.spawn(async () => {
			try {
				const raw = await http.get(GIST_URL);
				const parsed = http.parseJson(raw) as Command[];
				setCommands(parsed);
				setStatus("");
			} catch (e) {
				setStatus("Failed to load commands.");
				warn(`[Havoc] Misc tab error: ${e}`);
			}
		});
	}, []);

	const filtered = commands.filter((cmd) =>
		cmd.name.lower().find(search.lower())[0] !== undefined,
	);

	return (
		<Canvas position={scale(0, 1)} anchor={new Vector2(0, 1)}>
			{/* Search bar */}
			<frame
				Key="SearchBar"
				Size={new UDim2(1, -24, 0, 36)}
				Position={new UDim2(0, 12, 0, 12)}
				BackgroundColor3={Color3.fromHex("#0D0D0D")}
				BorderSizePixel={0}
			>
				<uicorner CornerRadius={new UDim(0, 8)} />
				<textbox
					Key="Input"
					Size={new UDim2(1, -12, 1, 0)}
					Position={new UDim2(0, 12, 0, 0)}
					BackgroundTransparency={1}
					TextColor3={Color3.fromHex("#ffffff")}
					PlaceholderText="Search commands..."
					PlaceholderColor3={Color3.fromHex("#666666")}
					TextSize={14}
					Font={Enum.Font.GothamMedium}
					TextXAlignment={Enum.TextXAlignment.Left}
					ClearTextOnFocus={false}
					Text={search}
					Event={{
						Changed: (rbx) => setSearch(rbx.Text),
					}}
				/>
			</frame>

			{/* Status text (loading / error) */}
			{status !== "" && (
				<textlabel
					Key="Status"
					Size={new UDim2(1, -24, 0, 24)}
					Position={new UDim2(0, 12, 0, 56)}
					BackgroundTransparency={1}
					TextColor3={Color3.fromHex("#666666")}
					TextSize={13}
					Font={Enum.Font.Gotham}
					Text={status}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
			)}

			{/* Command list */}
			<scrollingframe
				Key="List"
				Size={new UDim2(1, -24, 1, -68)}
				Position={new UDim2(0, 12, 0, 56)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				ScrollBarThickness={4}
				ScrollBarImageColor3={Color3.fromHex("#CC2929")}
				CanvasSize={new UDim2(0, 0, 0, filtered.size() * 56)}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
			>
				<uilistlayout
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, 8)}
				/>

				{filtered.map((cmd, i) => (
					<frame
						Key={cmd.name}
						LayoutOrder={i}
						Size={new UDim2(1, 0, 0, 48)}
						BackgroundColor3={Color3.fromHex("#111111")}
						BorderSizePixel={0}
					>
						<uicorner CornerRadius={new UDim(0, 8)} />

						{/* Name */}
						<textlabel
							Key="Name"
							Size={new UDim2(1, -80, 0, 24)}
							Position={new UDim2(0, 12, 0, 6)}
							BackgroundTransparency={1}
							TextColor3={Color3.fromHex("#ffffff")}
							TextSize={14}
							Font={Enum.Font.GothamBold}
							Text={cmd.name}
							TextXAlignment={Enum.TextXAlignment.Left}
						/>

						{/* Description */}
						<textlabel
							Key="Description"
							Size={new UDim2(1, -80, 0, 18)}
							Position={new UDim2(0, 12, 0, 26)}
							BackgroundTransparency={1}
							TextColor3={Color3.fromHex("#888888")}
							TextSize={12}
							Font={Enum.Font.Gotham}
							Text={cmd.description}
							TextXAlignment={Enum.TextXAlignment.Left}
						/>

						{/* Run button */}
						<textbutton
							Key="RunButton"
							Size={new UDim2(0, 60, 0, 28)}
							Position={new UDim2(1, -70, 0.5, -14)}
							BackgroundColor3={Color3.fromHex("#CC2929")}
							BorderSizePixel={0}
							TextColor3={Color3.fromHex("#ffffff")}
							TextSize={13}
							Font={Enum.Font.GothamBold}
							Text="Run"
							Event={{
								MouseButton1Click: () => task.spawn(() => runCommand(cmd)),
							}}
						>
							<uicorner CornerRadius={new UDim(0, 6)} />
						</textbutton>
					</frame>
				))}
			</scrollingframe>
		</Canvas>
	);
}

export default hooked(Misc);
