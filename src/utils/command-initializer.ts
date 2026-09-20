import { setDispatch } from "utils/command-executor";
import { executeCommandFromInput } from "utils/command-executor";
import { setCommandInput } from "store/actions/command.action";
import { useAppDispatch } from "hooks/common/rodux-hooks";

// When Commands page mounts, wire the executor to the store dispatch
export function initCommandExecutor() {
	const dispatch = useAppDispatch();
	setDispatch(dispatch);

	// Re-bind on store changes (safety)
	return function() {
		setDispatch(dispatch);
	};
}
