export class InspirationDice {
	static async onRenderActorSheet(dndSheet, html){
		let inspirationDiceSettings = CONFIG.inspirationDiceSettings;
		let actorPoints = dndSheet.object.getFlag('inspirationdice', 'currentInspirationDice');
		inspirationDiceSettings.currentSettings.numberOfPoints = actorPoints === undefined ? 0 : actorPoints;

		let sheet = dndSheet.constructor.name;
		inspirationDiceSettings.currentSettings.isGM = game.user.isGM;
		inspirationDiceSettings.currentSettings.actorAppId = dndSheet.appId;
		const template = await renderTemplate(`${inspirationDiceSettings.templatesPath}/inspirationdice.html`, inspirationDiceSettings);
		let sheetIndex = 0;
		let centerPane = null;

		switch (sheet) {
			case "ActorSheet5eCharacter":
				sheetIndex = 1;
				centerPane = html.find("ul[class='attributes flexrow']");
				break;
			case "Tidy5eSheet":
				sheetIndex = 0;
				centerPane = html.find("div[class='favorites-target']");
				break;
			case "CompactBeyond5eSheet":
				centerPane = html.find("ul[class='attributes']");
				break;
		}

		if(centerPane) centerPane[sheetIndex].insertAdjacentHTML('afterend', template);

		$('.lpOpenConsume-' + dndSheet.appId).on('click', async () => {
			this.openConsumeInput(dndSheet.appId);
		});
		$('.idPlayerDieIncrease-' + dndSheet.appId).on('click', async () => {
			this.playerDieIncrease(dndSheet);
		});
		$('.idPlayerDieDecrease-' + dndSheet.appId).on('click', async () => {
			this.playerDieDecrease(dndSheet);
		});
		$('.idPlayerDieClear-' + dndSheet.appId).on('click', async () => {
			this.PlayerDieClear(dndSheet);
		});
		$('.idPlayerRoll-' + dndSheet.appId).on('click', async () => {
			this.playerRoll(dndSheet);
		});
	}

  static async playerRoll(dndSheet) {
		var dieSize = dndSheet.object.getFlag('inspirationdice', 'currentInspirationDice');
	 	if (dieSize == 0) {
			alert('You do not have an inspiration die to consume.');
		}
		else {
			let str = '1d';
			str +=dieSize;
			let roll = new Roll(str);
			console.log(roll.parts);
			roll.roll();
			ChatMessage.create({content: `${dndSheet.entity.name} just rolled ${roll.total} on their D`+ dieSize + ` Inspiration Die!`}, {chatBubble : true});
		}
	}

	static async playerDieIncrease(dndSheet) {
		var dieSize = dndSheet.object.getFlag('inspirationdice', 'currentInspirationDice');
		switch (dieSize) {
			case 0:
				dieSize = 4;
				break;
			case 4:
				dieSize = 6;
				break;
			case 6:
				dieSize = 8;
				break;
			case 8:
				dieSize = 10;
				break;
			case 10:
				dieSize = 12;
				break;
			case 12:
				dieSize = 20;
				break;
			case 20:
				break;
		}
		 	await dndSheet.object.setFlag('inspirationdice', 'currentInspirationDice', dieSize);
	}

	static async playerDieDecrease(dndSheet) {
		var dieSize = dndSheet.object.getFlag('inspirationdice', 'currentInspirationDice');
		switch (dieSize) {
			case 0:
				break;
			case 4:
				dieSize = 0;
				break;
			case 6:
				dieSize = 4;
				break;
			case 8:
				dieSize = 6;
				break;
			case 10:
				dieSize = 8;
				break;
			case 12:
				dieSize = 10;
				break;
			case 20:
				dieSize = 12;
				break;
		}
			await dndSheet.object.setFlag('inspirationdice', 'currentInspirationDice', dieSize);
	}

	static async PlayerDieClear(dndSheet) {
		 	await dndSheet.object.setFlag('inspirationdice', 'currentInspirationDice', 0);
	}

}
