import { setDispatch } from "utils/command-executor";
import { useAppDispatch } from "hooks/common/rodux-hooks";
import { useEffect } from "@rbxts/roact-hooked";

export function useCommandExecutor() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		setDispatch(dispatch);
		return () => {
			// dispatch stays wired; no cleanup needed
		};
	}, [dispatch]);
}
