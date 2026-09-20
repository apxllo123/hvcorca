declare const VERSION: string;

declare const queue_on_teleport: ((script: string) => void) | undefined;

declare const gethui: (() => BasePlayerGui) | undefined;

declare const protect_gui: ((object: ScreenGui) => void) | undefined;

declare namespace syn {
	function queue_on_teleport(script: string): void;
	function protect_gui(object: ScreenGui): void;
}

declare function getgenv(): { _ORCA_IS_LOADED?: boolean };
declare function makefolder(path: string): void;
declare function isfolder(path: string): boolean;
declare function readfile(path: string): string;
declare function isfile(path: string): boolean;
declare function writefile(path: string, content: string): void;
declare function request(options: RequestAsyncRequest): RequestAsyncResponse;

declare namespace syn {
	function request(options: RequestAsyncRequest): RequestAsyncResponse;
}

interface DataModel {
	GetService(name: "CoreGui"): BasePlayerGui;
	HttpGetAsync(url: string, requestType?: Enum.HttpRequestType): string;
	HttpPostAsync(url: string, data: string, contentType?: string, requestType?: Enum.HttpRequestType): string;
}
