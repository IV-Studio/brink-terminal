const Keywords = require("./keywords");
const { keywordList } = require("./keywords");

const Clearance = {
    checkClearance: function (response, command, username) {

        let returnClearance = -2;

        // Iterate over the keys and values to find a match
        for (const key in Clearance.clearanceCodes) {
            if (Clearance.clearanceCodes[key] === command.toLowerCase()) {
                returnClearance = parseInt(key); // Return the matching key as an integer
            }
        }

        if (returnClearance > -2) {

            const now = new Date();

            const releaseDate = Clearance.clearanceLevelTimes[returnClearance];

            if (now < releaseDate) {
                response.terminalMessages.push("<hr>Success! Your Clearance Level: " + returnClearance + " credentials will be activated on " + getFormattedDateTime(releaseDate) + ".<br><br>" +
                    'Return at this time and your Clearance will be fully approved.');

                if (returnClearance == 4) {
                    response.terminalMessages.push("<hr>OMEGA CLEARANCE CODE:<h>PLAYDEAD-318X<h>");
                }

            } else {
                response.clearanceLevel = returnClearance;
                Keywords.addCoreKeywords(response);
                response.terminalMessages.push("<hr>Success! Clearance Level: " + returnClearance + " granted.");

                if (returnClearance == 5) {
                    response.terminalMessages.push("<hr>OMEGA CLEARANCE CODE:<h>EMERALD-V5BA2<h>");
                    response.terminalMessages.push("You have successfully completed The Brink Terminal.<br><br>" +
                        "<hr>CREDITS:<br><br>" +
                        "Directed by Zac Dixon<br><br>" +
                        "Story by Zac Dixon & Devon Norris<br><br>" +
                        "Written by Devon Norris<br><br>" +
                        "Developed and Designed by Zac Dixon<br><br>" +
                        "Additional Game Design: Max Anderson<br><br>" +
                        "Original Moonrakers Illustrations: Alex Griendling<br><br>" +
                        "Character Illustrators: Michael Cribbs, Kelly Nakamura, Alex Griendling, Hazal Hidir, Glenn Thomas, Christina Young<br><br>" +
                        "Voice Actors:<br><br> Ed Robinson as Bill Bendo<br><br>Dom Mackenize as Meg Gallak<br><br>Tricia Brioux as Moro Mada<br><br>" +
                        "IV Studio is Zac Dixon, Samuel Cowden, Austin Harrison, Max Anderson, Katie Lentile, Lilly Quach, and Dane Baudoin<br><br>" +
                        "<hr>Note from Zac:<br><br>" +
                        "My sincerest thank you. You are the reason we exist, and I'm deeply greatful that you're here. Thank you for giving us your time and attention, a commodity of highest value. I hope you've enjoyed the Brink Terminal! I'm going to go take a nap now, but I'm so excited to get back to work with our team on making something new for you very soon. Please come say hello on our Discord!" +
                        '<hr>Bill Bendo and Meg Gallak(?) will return.<hr><br><br>' +
                        'THE END'

                    );

                }
            }

        } else {
            response.terminalMessages.push("Error: Clearance Code not recognized.<br>Enter clearance code:");
        }

        return response;

    },
    clearanceCodes: {
        0: 'devondevon',
        1: 'manifold',
        2: 'sentry',
        3: 'escalate',
        4: 'noose',
        5: 'brink',
    },
    clearanceLevelTimes: {
        0: new Date(Date.UTC(2024, 4, 7, 19, 0, 0)),
        1: new Date(Date.UTC(2024, 4, 21, 19, 0, 0)),
        2: new Date(Date.UTC(2024, 5, 11, 19, 0, 0)),
        3: new Date(Date.UTC(2024, 6, 2, 15, 0, 0)),
        4: new Date(Date.UTC(2024, 6, 16, 19, 0, 0)),
        5: new Date(Date.UTC(2024, 6, 16, 19, 0, 0)),
    }
}

function getFormattedDateTime(now) {
    const year = now.getFullYear() + 3000;
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    const formattedDateTime = `${month}:${day} - ${hours}:${minutes}.${milliseconds}`;
    return formattedDateTime;
}

module.exports = Clearance;
