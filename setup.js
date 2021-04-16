import { InspirationDiceSettings } from './scripts/settings.js';
import { InspirationDice } from './scripts/inspirationdice.js';

Hooks.once('init', async function () {
	InspirationDiceSettings.registerSettings();
});

Hooks.once('ready', async () => {
	InspirationDiceSettings.registerLocalizedSettings();
});

Hooks.on('renderActorSheet', function (dndSheet, html) {
	InspirationDice.onRenderActorSheet(dndSheet, html);
});
