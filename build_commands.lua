-- build_commands.lua — embed the 5 LUA SCRIPTS Luau files into latest.lua as newModule blocks
-- Usage: remodel run build_commands.lua

local remodel = require("remodel")

local BASE = "/Users/apxllo/Desktop/hvcorca"
local LUA_SCRIPTS = "/Users/apxllo/Desktop/LUA SCRIPTS"
local OUT = BASE .. "/public/latest.lua"

-- Helper: read a file
local function read(path)
	local f, err = io.open(path, "r")
	if not f then error("Cannot open " .. path .. ": " .. tostring(err)) end
	local content = f:read("*a")
	f:close()
	return content
end

-- Helper: write a file
local function write(path, content)
	local f, err = io.open(path, "w")
	if not f then error("Cannot write " .. path .. ": " .. tostring(err)) end
	f:write(content)
	f:close()
end

-- Helper: strip -- line comments (conservative: only strips text after -- not inside quotes)
local function stripLineComments(src)
	local result = {}
	for line in src:gmatch("[^\r\n]+") do
		local in_single = false
		local in_double = false
		local escape = false
		local comment_pos = -1
		for i = 1, #line do
			local ch = line:sub(i, i)
			if escape then
				escape = false
			elseif ch == "\\" then
				escape = true
			elseif ch == "'" and not in_double then
				in_single = not in_single
			elseif ch == '"' and not in_single then
				in_double = not in_double
			elseif not in_single and not in_double and ch == "-" and i < #line and line:sub(i+1, i+1) == "-" then
				comment_pos = i - 1
				break
			end
		end
		if comment_pos >= 0 then
			table.insert(result, line:sub(1, comment_pos))
		else
			table.insert(result, line)
		end
	end
	return table.concat(result, "\n")
end

-- Helper: escape a string for use inside a Lua function body
-- We don't need to escape for string literals since the source IS the function body.
-- But we DO need to handle any `==` or other patterns that could cause issues.
-- Actually, since the source is embedded directly as function body text, no escaping needed.
local function embedSource(src)
	return src
end

-- Fix require paths for bundle layout
local function fixRequires(src, filename)
	-- ThemeConfig is at Orca.ThemeConfig in the bundle
	-- From CommandSystem children: script.Parent.Parent.ThemeConfig
	-- From RunBar children: script.Parent.Parent.ThemeConfig
	
	-- Fix: script.Parent.Parent.Theme.ThemeConfig -> script.Parent.Parent.ThemeConfig
	src = src:gsub("require%(script%.Parent%.Parent%.Theme%.ThemeConfig%)",
					"require(script.Parent.Parent.ThemeConfig)")
	
	-- Fix: script.Parent.Theme.ThemeConfig -> script.Parent.Parent.ThemeConfig  
	-- (for RunBarLocalScript which is at Orca.RunBar.RunBarLocalScript)
	src = src:gsub("require%(script%.Parent%.Theme%.ThemeConfig%)",
					"require(script.Parent.Parent.ThemeConfig)")
	
	return src
end

-- Build a newModule block
local function newModuleBlock(src, moduleName, className, path, parent)
	local body = embedSource(src)
	-- The bundle.lua non-debug format:
	-- newModule(name, className, "path", "parent", function ()
	--     return setfenv(function()
	--         <source>
	--     end, newEnv("path"))()
	-- end)
	local lines = {
		"newModule(\"" .. moduleName .. "\", \"" .. className .. "\", \"" .. path .. "\", \"" .. parent .. "\", function ()",
		"return setfenv(function()",
		body,
		"end, newEnv(\"" .. path .. "\"))()",
		"end)",
	}
	return table.concat(lines, "\n")
end

-- Main
local function main()
	print("[BuildCommands] Reading source files...")
	
	-- Define modules: filename, moduleName, className, path, parent
	local modules = {
		{ "ThemeConfig.lua",      "ThemeConfig",       "ModuleScript", "Orca.ThemeConfig",                "Orca" },
		{ "CommandsModule.lua",  "CommandsModule",    "ModuleScript", "Orca.CommandSystem.CommandsModule", "Orca.CommandSystem" },
		{ "TerminalController.lua", "TerminalController", "LocalScript", "Orca.CommandSystem.TerminalController", "Orca.CommandSystem" },
		{ "PresetPanel.lua",     "PresetPanel",       "LocalScript",  "Orca.CommandSystem.PresetPanel",    "Orca.CommandSystem" },
		{ "RunBarLocalScript.lua","RunBarLocalScript",  "LocalScript",  "Orca.RunBar.RunBarLocalScript",     "Orca.RunBar" },
	}
	
	local blocks = {}
	for _, mod in ipairs(modules) do
		local filename, moduleName, className, path, parent = unpack(mod)
		local raw = read(LUA_SCRIPTS .. "/" .. filename)
		local stripped = stripLineComments(raw)
		local fixed = fixRequires(stripped, filename)
		local block = newModuleBlock(fixed, moduleName, className, path, parent)
		table.insert(blocks, block)
		print("[BuildCommands] Built: " .. moduleName .. " (" .. #block .. " chars)")
	end
	
	-- Read existing latest.lua
	print("[BuildCommands] Reading existing latest.lua...")
	local existing = read(OUT)
	print("[BuildCommands] Existing file: " .. #existing .. " chars, " .. select(2, existing:gsub("\n", "\n")) .. " lines")
	
	-- Find the last init() call
	local lastInitPos = existing:find("\ninit()%s*$")
	if not lastInitPos then
		lastInitPos = existing:find("init()%s*$")
	end
	if not lastInitPos then
		error("Could not find init() in latest.lua")
	end
	
	print("[BuildCommands] Found init() at position " .. lastInitPos)
	
	-- Create folder instances
	local folderBlocks = {
		'newInstance("CommandSystem", "Folder", "Orca.CommandSystem", "Orca")',
		'newInstance("RunBar", "Folder", "Orca.RunBar", "Orca")',
	}
	
	-- Build the insertion: folders + modules + blank line
	local insertion = "\n" .. table.concat(folderBlocks, "\n") .. "\n\n" .. table.concat(blocks, "\n\n") .. "\n"
	
	-- Insert before init()
	local newContent = existing:sub(1, lastInitPos - 1) .. insertion .. existing:sub(lastInitPos)
	
	-- Write back
	print("[BuildCommands] Writing " .. OUT .. "...")
	write(OUT, newContent)
	
	local size = #newContent
	local lines = select(2, newContent:gsub("\n", "\n"))
	print("[BuildCommands] Done! File: " .. size .. " chars, " .. lines .. " lines")
	
	-- Also copy to LUA SCRIPTS
	local dest = "/Users/apxllo/Desktop/LUA SCRIPTS/latest_commands_only.lua"
	print("[BuildCommands] Copying to " .. dest ...)
	write(dest, newContent)
	print("[BuildCommands] Done!")
end

main()
