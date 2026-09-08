-- How to use
-- Add this plugin in OBS under Tools > Scripts > Plus Button
-- Create a Text Element named "Deathcounter"
-- Go into OBS Settings > Hotkeys
-- And set the two hotkeys named "[Deathcounter] Count one Up" and "[Deathcounter] Reset Counter" to any key you barely use, like HOME or END
-- In the Text Element, you can do something like "DeathCounter: 0" and it will only count up the number, you can also just put a number in there like "5532" and it will count that up too.
-- As the Element is a OBS Text Element, you can style it however you want.
-- ~ salza

obs = obslua
s = "Deathcounter"

function getTextSourceContent()
    local source = obs.obs_get_source_by_name(s)
    if source ~= nil then
        local settings = obs.obs_source_get_settings(source)
        local text = obs.obs_data_get_string(settings, "text")
        obs.obs_data_release(settings)
        obs.obs_source_release(source)
        return text
    end
    return "0"
end

function changeTextSource(reset)
    local source = obs.obs_get_source_by_name(s)

    if source ~= nil then
        -- 1. Get the current settings to read the existing text
        local current_settings = obs.obs_source_get_settings(source)
        local old_text = obs.obs_data_get_string(current_settings, "text")
        obs.obs_data_release(current_settings)

        print("prev count: " .. old_text)

        local settings = obs.obs_data_create()

        local tabule = {}
        for part in string.gmatch(old_text, "[^:]+") do
            table.insert(tabule, part)
        end

        if not reset then
            if #tabule > 1 then
                local current_count = tonumber(tabule[2]) or 0
                obs.obs_data_set_string(settings, "text", tabule[1] .. ": " .. tostring(current_count + 1))
            else 
                local current_count = tonumber(tabule[1]) or 0
                obs.obs_data_set_string(settings, "text", tostring(current_count + 1))
            end

        else
            if #tabule > 1 then
                obs.obs_data_set_string(settings, "text", tabule[1] .. ": " .. "0")
            else 
                obs.obs_data_set_string(settings, "text", "0")
            end
        end

        -- 3. Apply the new settings
        obs.obs_source_update(source, settings)
        obs.obs_data_release(settings)
        obs.obs_source_release(source)
    else
        print("Source '" .. string.lower(s) .. "' not found.")
    end
end

function script_description()
    return "Deathcounter for those Twitch streamers that want to see how bad they are. :)"
end

-- A function named script_load will be called on startup
function script_load(settings)
    count = obs.obs_hotkey_register_frontend("change_text_source", "[Deathcounter] Count one Up", function(pressed)
        if not pressed then
            return
        end
        changeTextSource(false)
    end)

    reset = obs.obs_hotkey_register_frontend("change_text_source_reset", "[Deathcounter] Reset Counter", function(pressed)
        if not pressed then
            return
        end
        changeTextSource(true)
    end)

    local hotkey_save_array = obs.obs_data_get_array(settings, "change_text_source")
    local hotkey_save_array1 = obs.obs_data_get_array(settings, "change_text_source_reset")
    obs.obs_hotkey_load(count, hotkey_save_array)
    obs.obs_hotkey_load(reset, hotkey_save_array1)
    obs.obs_data_array_release(hotkey_save_array)
    obs.obs_data_array_release(hotkey_save_array1)
end

function script_save(settings)
    local hotkey_save_array = obs.obs_hotkey_save(count)
    local hotkey_save_array1 = obs.obs_hotkey_save(reset)

    obs.obs_data_set_array(settings, "change_text_source", hotkey_save_array)
    obs.obs_data_set_array(settings, "change_text_source_reset", hotkey_save_array1)

    obs.obs_data_array_release(hotkey_save_array)
    obs.obs_data_array_release(hotkey_save_array1)
end
