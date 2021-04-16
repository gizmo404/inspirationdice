export class InspirationDice {
	static async onRenderActorSheet(dndSheet, html) {
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
		if (game.user.isGM) {
			$('.lpGmRoll-' + dndSheet.appId).on('click', async () => {
				this.gmRoll(dndSheet);
			});
		}
		$('.lpHowManyPoints-' + dndSheet.appId).keypress(async (e) => {
			if (e.which == 13) {
				this.consumeInspirationDice(e.target, dndSheet);
			}
		});
	}

	static async gmRoll(dndSheet) {
		let roll = new Roll("1d6");
		console.log(roll.parts);
		roll.roll();
		ChatMessage.create({content: `${dndSheet.entity.name} just received ${roll.total} Inspiration Dice!`}, {chatBubble : true});
		let result = roll.total;
		var currentPoints = dndSheet.object.getFlag('inspirationdice', 'currentInspirationDice');

		let newResult = result + (currentPoints === undefined ? 0 : currentPoints);
		await dndSheet.object.setFlag('inspirationdice', 'currentInspirationDice', newResult);
	}

	static openConsumeInput(appId) {
		let inspirationDiceSettings = CONFIG.inspirationDiceSettings;
		if (inspirationDiceSettings.currentSettings.numberOfPoints > 0) {
			$('.lpHowManyPoints-' + appId).toggle();
		} else {
			alert('You do not have any inspiration dice to consume.');
		}
	}

	static async consumeInspirationDice(target, dndSheet) {
		let actorPoints = dndSheet.object.getFlag('inspirationdice', 'currentInspirationDice');
		let parsedValue = parseInt(target.value, 10);
		let value = (isNaN(parsedValue) || parsedValue === "")? 0 : parsedValue;
		if(value === 0){
			alert('Please enter the number of points you would like to use.')
		}
		else if (value > actorPoints) {
			alert('You do not have enough inspiration dice to consume.');
		} else {
			let newPoints = actorPoints - value;
			await dndSheet.object.setFlag('inspirationdice', 'currentInspirationDice', newPoints);
			ChatMessage.create({content: `${dndSheet.entity.name} just consumed ${value} Inspiration Dice! ${dndSheet.entity.name} has ${newPoints} left.`}, {chatBubble : true});
		}
	}
}
