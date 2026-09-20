import Roact from "@rbxts/roact";
import { hooked } from "@rbxts/roact-hooked";
import { useDelayedUpdate } from "hooks/common/use-delayed-update";
import { useCurrentPage } from "hooks/use-current-page";
import { DashboardPage } from "store/models/dashboard.model";
import Apps from "./Apps";
import Home from "./Home";
import Misc from "./Misc";
import Options from "./Options";
import Scripts from "./Scripts";

function Pages() {
	const currentPage = useCurrentPage();
	const isScriptsVisible = useDelayedUpdate(currentPage === DashboardPage.Scripts, 2000, (isVisible) => isVisible);
	const isMiscVisible = useDelayedUpdate(currentPage === DashboardPage.Misc, 2000, (isVisible) => isVisible);

	return (
		<>
			<Home Key="home" />
			<Apps Key="apps" />
			{isScriptsVisible && <Scripts Key="scripts" />}
			{isMiscVisible && <Misc Key="misc" />}
			<Options Key="options" />
		</>
	);
}

export default hooked(Pages);
