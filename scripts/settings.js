export class InspirationDiceSettings {
	static registerSettings() {
		if (!CONFIG.inspirationDiceSettings) {
			let inspirationDiceConfig = {
				currentSettings: {
					numberOfPoints: 0,
				},
				templatesPath: '/modules/inspirationdice/templates',
			};
			CONFIG.inspirationDiceSettings = inspirationDiceConfig;
		}
	}

	static registerLocalizedSettings() {
		CONFIG.inspirationDiceSettings.localized = {
			inspirationDiceTitle: game.i18n.localize('INSPIRATIONDICE.InspirationDiceTitle'),
			gmRollTitle: game.i18n.localize('INSPIRATIONDICE.GMRollTitle'),
			playerConsumeTitle: game.i18n.localize('INSPIRATIONDICE.PlayerConsumeTitle'),
			consumePlaceholder: game.i18n.localize('INSPIRATIONDICE.ConsumenPlaceholder')
		};
	}
}
