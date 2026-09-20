import { useEffect } from "@rbxts/roact-hooked";
import { UserInputService } from "@rbxts/services";
import { useAppDispatch, useAppSelector } from "hooks/common/rodux-hooks";
import { setDashboardPage, toggleDashboard } from "store/actions/dashboard.action";
import { DashboardPage } from "store/models/dashboard.model";

/**
 * Key that, held with Shift, opens the command bar (the `Misc` page).
 *
 * Shift+6 is a chord, which the single-keycode shortcuts store cannot hold, so
 * it is bound here instead of in Options > Shortcuts.
 */
const COMMAND_BAR_KEY = Enum.KeyCode.Six;

function isShiftDown() {
	return (
		UserInputService.IsKeyDown(Enum.KeyCode.LeftShift) ||
		UserInputService.IsKeyDown(Enum.KeyCode.RightShift)
	);
}

/**
 * Opens the command bar when Shift+6 is pressed, and closes it when pressed
 * again while the command bar is already showing. Mounted once by `Pages`, which
 * lives for the whole session.
 */
export function useCommandBarShortcut() {
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((state) => state.dashboard.isOpen);
	const page = useAppSelector((state) => state.dashboard.page);

	useEffect(() => {
		const handle = UserInputService.InputBegan.Connect((input, gameProcessed) => {
			if (gameProcessed) return;
			if (input.UserInputType !== Enum.UserInputType.Keyboard) return;
			if (input.KeyCode !== COMMAND_BAR_KEY) return;
			if (!isShiftDown()) return;

			if (isOpen && page === DashboardPage.Misc) {
				dispatch(toggleDashboard());
				return;
			}

			if (page !== DashboardPage.Misc) {
				dispatch(setDashboardPage(DashboardPage.Misc));
			}
			if (!isOpen) {
				dispatch(toggleDashboard());
			}
		});

		return () => handle.Disconnect();
	}, [isOpen, page]);
}
