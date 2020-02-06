const path = require('path');
const fs = require('fs');
const messages = require('./messages.json');

module.exports = function NoAnnouncements(mod) {
  let messageHook;

  if (mod.settings.enabled) {
    enableHooks();
  }

  mod.command.add('announce', {
    $default() {
      msg(' No Accounements. Usage:');
      msg('   announce  - Turn module on/off');
      msg('   announce loot - Turn lockbox messages on/off');
      msg('   announce enchant - Turn enchanting messages on/off');
      msg('   announce fish - Turn fishing messages on/off');
    },
    loot() {
      mod.settings.lootbox = !mod.settings.lootbox;
      msg(' Lockboxes - ' + (mod.settings.lootbox ? 'allowed.' : 'blocked.'));
      mod.saveSettings();
    },
    enchant() {
      mod.settings.enchant = !mod.settings.enchant;
      msg(' Enchanting - ' + (mod.settings.enchant ? 'allowed.' : 'blocked.'));
      mod.saveSettings();
    },
    fish() {
      mod.settings.fish = !mod.settings.fish;
      msg(' Fishing - ' + (mod.settings.fish ? 'allowed.' : 'blocked.'));
      mod.saveSettings();
    },
    $none() {
      mod.settings.enabled = !mod.settings.enabled;
      mod.saveSettings();

      if (mod.settings.enabled) {      
        msg(' Blocking announcements.'); 
        enableHooks();
      } else {
        msg(' Allowing announcements.');
        disableHooks();
      }
    }
  })

  function enableHooks() {
    messageHook = mod.hook('S_SYSTEM_MESSAGE', 1, sSystemMessage);
  }

  function disableHooks() {
    mod.unhook(messageHook);
  }

  function sSystemMessage(event) {
    if (mod.settings.enabled) {
      if (!mod.settings.lootbox && messages.loot.some(x => event.message.startsWith(x))) {
        return false;
      }
      if (!mod.settings.enchant && messages.enchant.some(x => event.message.startsWith(x))) {
        return false;
      }
      if (!mod.settings.fish && messages.fish.some(x => event.message.startsWith(x))) {
        return false;
      }
    }
  }

  function msg(text) {
    mod.command.message(text);
  }
};