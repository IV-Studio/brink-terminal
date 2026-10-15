const World = {

    worldCommand: function (response, command) {

        const { clearanceLevel } = response.clearanceLevel;
        const { keywords } = response.keywords;

        for (const key in World.worldActionList) {
            if (World.worldActionList.hasOwnProperty(key)) {
                const worldAction = World.worldActionList[key];
                const commands = worldAction.command;

                // TO DO: Check clearance level
                if (response.clearanceLevel >= worldAction.minimumClearanceLevel) {

                    const hasKeywords = worldAction.requiredKeywords.every((keyword) =>
                        response.keywords.includes(keyword)
                    );

                    const commandsCheck = commands.includes(command.toLowerCase());

                    const locationCheck = (response.localCoordinates[0] == worldAction.localCoordinates[0] &&
                        response.localCoordinates[1] == worldAction.localCoordinates[1] &&
                        response.tileSetCoordinates[0] == worldAction.tileSetCoordinates[0] &&
                        response.tileSetCoordinates[1] == worldAction.tileSetCoordinates[1]
                    );

                    // Check if the input matches any command in the current conversation
                    if (commandsCheck && hasKeywords && locationCheck) {
                        response = worldAction.action(response);
                        return response; // Return the matching conversation
                    }
                }
            }
        }
        
        response = World.noResponse(response);
        return response;

    },

    noResponse: function (response) {
        // THIS IS HACKY...but it stops showing the error message when you've unlocked a keyword.
        if (response.terminalMessages.length == 0) {
            response.terminalMessages.push(roomObject.noRoomPrompt(response));
        }
        
        return response;
    },

    worldActionList: {
        'test': {
            command: ['test'],
            requiredKeywords: [],
            minimumClearanceLevel: 2,
            localCoordinates: [1,1],
            tileSetCoordinates: [0,0],
            action: function (response) {
                response.terminalMessages.push('Testing testing successful');
                return response;
            }
        }
    }

}

module.exports = World;