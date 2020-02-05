const path = require('path');
const fs = require('fs');

module.exports = function NoAnnouncements(mod) {
  const KEYWORDS = [
    '@2405',
    '@464'
  ];

  let messageHook;
  let config
  let settingsPath;

  mod.command.add('announce', (...args) => {
    if (config.enabled)
      disableHooks();
    else
      enableHooks();
  });

  mod.game.on('enter_game', () => {
    settingsPath = path.join(__dirname, `${mod.game.me.name}-${mod.game.serverId}.json`);
    config = loadConfig(settingsPath);

    if (config.enabled)
      enableHooks(true);
  });

  function enableHooks(silent) {
    if (!config.enabled) {
      config.enabled = true;
      saveConfig(settingsPath, config);
    }

    messageHook = mod.hook('S_SYSTEM_MESSAGE', 1, sSystemMessage);
	if (!silent)
	  msg('Blocking enchant and loot announcements.');
  }

  function disableHooks(silent) {
    if (config.enabled) {
      config.enabled = false;
      saveConfig(settingsPath, config);
    }

    mod.unhook(messageHook);
	if (!silent)
	  msg('Allowing enchant and loot announcements.');
  }

  function sSystemMessage(event) {
    if (KEYWORDS.some(x => event.message.startsWith(x)))
      return false;
  }

  function loadConfig(filePath) {
    let cfg;
    try {
      cfg = JSON.parse(fs.readFileSync(filePath));
    } catch (e) {
      cfg = {};
    }
    
    checkConfig(cfg);
    return cfg;
  }

  function saveConfig(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"));
  }

  function checkConfig(config) {
    if (config.enabled === undefined)
      config.enabled = true;
  }

  function msg(text) {
    mod.command.message(text);
  }
};