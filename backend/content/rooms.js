const Rooms = {
    getAvailableRooms: function (response) {
        const rooms = Rooms.RoomList;

        const availableRooms = {};

        // Loop through each message in the message list
        for (const key in rooms) {
            if (rooms.hasOwnProperty(key)) {
                const room = rooms[key];

                if (room.clearanceLevel <= response.clearanceLevel) {
                    // If both conditions are met, add the message to the available list
                    const roomObject = createRoomObject(key, room, response);
                    availableRooms[key] = roomObject;
                }
            }
        }

        response.rooms = availableRooms;

        return response;
    },
    roomPrompt: function (response, command) {
        const { clearanceLevel } = response.clearanceLevel;
        const { keywords } = response.keywords;

        const rooms = Rooms.RoomList;
        // get the room
        if (response.context == 'room') {
            for (const key in rooms) {
                if (key == response.room) {
                    const roomObject = rooms[key];

                    for (const key in roomObject.roomPromptList) {

                        if (roomObject.roomPromptList.hasOwnProperty(key)) {
                            const roomPrompt = roomObject.roomPromptList[key];
                            const commands = roomPrompt.command;

                            if (response.clearanceLevel >= roomPrompt.minimumClearanceLevel) {
                                // Check if the input matches any command in the current conversation
                                if (commands.includes(command.toLowerCase())) {
                                    response.terminalMessages.push(roomPrompt.responseMessage(response));

                                    if (roomPrompt.changeRoom) {
                                        response.changeRoom = roomPrompt.changeRoom;
                                    }
                                    return response; // Return the matching conversation
                                }
                            }
                        }
                    }
                    // THIS IS HACKY...but it stops showing the error message when you've unlocked a keyword.
                    if (response.terminalMessages.length == 0) {
                        response.terminalMessages.push(roomObject.noRoomPrompt(response));
                    }
                    return response;
                }
            }
        }
        return response;

    },
    RoomList: {
        'tavern': {
            title: 'Tavern',
            command: ['tavern', 't', 'Tavern', 'T'],
            displayName: '[T]avern',
            section: 'station',
            clearanceLevel: -1,
            exitActionState: 'station',
            contexts: ['station'],
            stations: ['reiner-station'],
            myTerminalAccess: false,
            available: function (response) {
                return true;
            },
            entryDisplayMessage: function (response) {
                if (response.clearanceLevel == 4 && response.keywords.includes('bill-final')) {
                    return "Bill lets out a deep breath with a smirk on his face.<br><br>He grabs a fresh glass and a bottle from behind the bar and pours himself a healthy portion.<br><br>He takes a long drink as you walk out the door.";
                }
                if (response.clearanceLevel == 4 && !response.keywords.includes('dae-arum') && !response.keywords.includes('more')) {
                    return "You walk into the tavern on Reiner Station, and you notice first that no one else is here save for Bill. The bartender isn't cleaning out glasses and sharing his latest concoctions on the rotating menu." +
                        "Kinta Lar isn't knocking back drinks in each hand while offering moody glares at anyone trying to talk to her. Ryle al Wren isn't discussing the latest in supply logistics. <br><br>" +
                        "The room is quiet, and the mood is somber. Bill sits alone with an empty glass before him, his finger tracing the rim in slow circles and producing a soft, low ringing sound.<br><br>" +
                        "As you approach him, his finger-and the ringing-stops.<br><br>"
                } else if (response.clearanceLevel == 4 && !response.keywords.includes('more')) {
                    return "You walk into the tavern on Reiner Station, and you notice first that no one else is here save for Bill. The bartender isn't cleaning out glasses and sharing his latest concoctions on the rotating menu." +
                        "Kinta Lar isn't knocking back drinks in each hand while offering moody glares at anyone trying to talk to her. Ryle al Wren isn't discussing the latest in supply logistics. <br><br>" +
                        "The room is quiet, and the mood is somber. Bill sits alone with an empty glass before him, his finger tracing the rim in slow circles and producing a soft, low ringing sound.<br><br>" +
                        "As you approach him, his finger-and the ringing-stops.<br><br>"
                } else if (response.clearanceLevel == 4 && response.keywords.includes('more')) {
                    return 'You walk in and your nightmare (or fate?) unfolds in slow motion.<br><br>' +
                    'Bill sits alone You approach.<br><br>' +
                    'He talks but you don\'t hear him as ready your firearm. You don\'t hear anything other than the whine of the laser as it slams into your investigative partner.<br><br>' +
                    '<h>Bill dies</h>...<br><br>';
                } else {
                    return 'No conversations active';
                }

            },
            entryCommandMessage: function (response) {
                return 'You enter the tavern and take a seat at the bar. A light flickers overhead.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Tavern',
            displayTitle: () => 'Conversation',
            allowKeywordEntry: false,
            roomPromptList: {
                'corpse': {
                    command: ['corpse'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return '“I\'ve been doing some research after we left the brig. It was… illuminating,” he drawls in a rueful tone. “Meg discovered the UA sleeper cell before we did. I presume that\'s why they had her killed. What they\'ve accomplished-how deeply they\'ve penetrated the inner circle of our faction headquarters-is staggering. No doubt they thought killing anyone who knew was worth the risk to keep the scale of the operation secret.”<br><br>' +
                        'He shifts in his seat. A quick grimace as he stretches his back.<br><br>' +
                        '“I don\'t know how Meg knew, but the messages I\'ve been able to decrypt from Lynna\'s datastick verify that she knew and that the UA knew she knew. If you follow me.”<br><br>' +
                        'You sit next to him and listen while he continues his debrief.<br><br>' +
                        '“I found out other things, too…”<br><br>' +
                        'He turns to you then, but you\'ve already raised your weapon to <h>fire</h>.<br><br>';
                    }
                },
                'fire': {
                    command: ['fire'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return '“It\'s a real statement having one of those out in space,” Bill states dryly. “I guess you needed something more final after poisoning my drink didn\'t work.”<br><br>' +
                        'You shake your head numbly.<br><br>' +
                        'Bill raises an eyebrow. “Oh no? Must have been Lynna then, before she—”<br><br>' +
                        'Whatever he was going to say is cut short as you pull the <h>trigger</h>, and he slumps over the bar like a broken puppet.<br><br>';
                    }
                },
                'trigger': {
                    command: ['trigger'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'trigger command';
                    },
                    changeRoom: 'personal-quarters',
                },
                'bill-dies': {
                    command: ['bill dies'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'GAME OVER. Refresh the page and try again.';
                    },
                },
            }
        },
        'megs-quarters': {
            title: 'Meg\'s Quarters',
            command: ['meg', 'megs', 'meg\'s', 'q', 'megs quarters', 'meg\'s quarters'],
            displayName: 'Meg\'s [Q]uarters',
            section: 'station',
            contexts: ['station'],
            stations: ['reiner-station'],
            clearanceLevel: 1,
            exitActionState: 'station',
            myTerminalAccess: false,
            available: function (response) {
                if (response.clearanceLevel >= 1 && response.keywords.includes('under threat')) {
                    return true;
                } else if (response.clearanceLevel >= 2) {
                    return true;
                } else {
                    return false;
                }
            },
            entryDisplayMessage: function (response) {

                if (response.clearanceLevel < 2) {
                    return 'A chic chaise lounge against the wall hides a half-buried <h>note</h> in the seam between two cushions.<br><br>' +
                        '<hr>' +
                        'Datapads are strewn across Meg\'s desk, but one stands out from the rest, with intricate <h>schematics</h> obscured by questions and personal notes.<br><br>' +
                        '<hr>' +
                        'A bottle of <h>Sartoc</h> brandy looms over not one but two used glasses.<br><br>' +
                        '<hr>' +
                        'The digital wall display, which had been asleep, brightens the dim interior of the room with UA internal propaganda and Komek <h>economic</h> reports.<br><br>' +
                        'You are sure there are more clues <u>here</u> to find, though.';
                } else if (response.clearanceLevel <= 3) {
                    return 'Meg’s room remains much the same, but documents have been organized, furniture has been shifted slightly, and everything has the look of light tampering. The MIU has questions, and Meg Gallak isn\'t around anymore to provide answers. Her personal effects will have to do.<br><br>' +
                        'Bill Bendo stands in the center of the space, slowly turning in circles as his eyes take in every <h>detail</h>.'
                } else if (response.clearanceLevel >= 4) {
                    return 'The entrance to Meg\'s room is close and locked. A combat servitor hovers to one side and observes you as you stand in the hall.';
                }

            },
            entryCommandMessage: function (response) {
                return 'Walking in, you first notice how sparsely the room is furnished. With an eye for detail, you catalogue what you see.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Meg\'s Quarters',
            displayTitle: () => 'Meg\'s Quarters',
            allowKeywordEntry: true,
            roomPromptList: {
                'propaganda': {
                    command: ['propaganda'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'You swipe through the propaganda images on the display.<br><br>' +
                            'On one poster featuring a UA General, the words “>>"follow the money"<<” are scribbled in bright blue ink.';
                    }
                },
                'datapads': {
                    command: ['datapads'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'You pour through the datapads. Dozens of files are open on the history of Henko shield tech.<br><br>' +
                            'You stumbled across a partially corrupted file, where only a dozen words are visible.<br><br>' +
                            'The word >>backbone<< is highlighted.';
                    },
                },
                'sit-down': {
                    command: ['sit down', 'chaise', 'lounge', 'chaise lounge', 'sit', 'lie down', 'lay down'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'You sit down to catch your breathe, resting your head back on the chaise lounge.<br><br>' +
                            'Then you see it, a ceiling tile ever-so-slightly dislodged.<br><br>' +
                            'You remove the tile and pop your head into ceiling, but are disappointed. Only a single >>datastick<< is left behind.';
                    }
                },
                'brandy': {
                    command: ['brandy', 'drink', 'have a drink', 'glasses'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Just a sip. No will know, right?<br><br>' +
                            'Oaky, some fruity undertones, and the harshest >>bite<< you\'ve ever experienced.';
                    }
                },
            }
        },
        'administrative-offices': {
            title: 'Administrative Offices',
            command: ['admin', 'admin office', 'admin offices', 'o'],
            displayName: 'Admin [O]ffices',
            section: 'station',
            contexts: ['station'],
            stations: ['reiner-station'],
            clearanceLevel: 1,
            exitActionState: 'station',
            myTerminalAccess: false,
            available: function (response) {
                if (response.clearanceLevel >= 1) {
                    return true;
                } else {
                    return false;
                }
            },
            entryDisplayMessage: function (response) {
                if (response.clearanceLevel == 3 && response.keywords.includes('chapter-4-finished')) {
                    return 'Back in Armitage\'s office, the director waits for you to sit down. Bill is nowhere in sight.<br><br>' +
                        'The lone combat servitor continues to hover ominously.<br><br>' +
                        'Director Armitage crosses his arms and settles in for your debrief.'
                } else if (response.clearanceLevel == 3 && !response.keywords.includes('chapter-4-finished') && !response.keywords.includes('rest')) {
                    return 'When you step into Armitage\'s office, a tense silence permeates the space. Bill Bendo is sitting rigidly in a chair in front of the director, whose countenance has never been more stormy and dark.<br><br>' +
                        'In the corner of the room, a combat servitor (that you\'ve never seen on the station before) hovers ominously. One of its ocular scanners tracks your movement as you cautiously step forward.<br><br>' +
                        'Director Armitage gestures toward the second seat, next to Bill. Nervously, you lower into the chair..'
                } else if (response.clearanceLevel >= 4) {
                    return 'The administrative offices are not available right now. They\'ve been closed while Armitage continues his assessment of the station\'s security and operations.';
                } else {
                    return 'No conversation active.';
                }
            },
            entryCommandMessage: function (response) {
                if (response.clearanceLevel <= 1) {
                    return 'You enter the administrative offices, a poorly lit large room littered with makeshift desks sprawled across it\'s depressing landscape.';
                } else if (response.clearanceLevel <= 3) {
                    return 'You enter the administrative offices, a poorly lit large room littered with makeshift desks sprawled across it\'s depressing landscape. An sense of <h>darkness</h> looms over the room.';
                } else if (response.clearanceLevel >= 4) {
                    return 'The door to the administrative offices is locked.';
                }

            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Admin\'s Office',
            displayTitle: () => 'Conversations',
            allowKeywordEntry: false,
            roomPromptList: {}
        },
        'hangar': {
            title: 'Hangar',
            command: ['hangar', 'h',],
            displayName: '[H]angar',
            section: 'flight deck',
            clearanceLevel: 2,
            exitActionState: 'station',
            contexts: ['station'],
            stations: ['reiner-station', 'leppik-station', 'kaos-station', 'queens-port'],
            myTerminalAccess: false,
            available: function (response) {
                if (response.clearanceLevel >= 2) {
                    return true;
                } else {
                    return false;
                }
            },
            entryDisplayMessage: function (response) {
                if (response.station == 'reiner-station') {
                    if (response.clearanceLevel == 3) {
                        return 'The hangar is now polished to a bright sheen, everything is well-maintained and the space is clean in a functional way. The cavernous room is used a lot.<br><br>' +
                        'Nella saunters around the room with confidence. This is her domain.<br><br>' +
                        'You do not mourn the absence of Farno\'s hideous yacht.<br><br>' +
                        'The control room keeps an eye on the ships in the hangar and observes everything that arrives at or leaves the station.'

                    } else if (response.clearanceLevel >= 4) {
                        return 'The hangar is now polished to a bright sheen, everything is well-maintained and the space is clean in a functional way. The cavernous room is used a lot.<br><br>' +
                        'Nella stands awkwardly in conversation with Ryle al Wren.<br><br>' +
                        'Off to the side, the bartender catalogues some boxes full of spirits.<br><br>' +
                        'Combat servitors are stationed both in the hangar and up in the control room. Everyone seems on edge.'
                    } else {
                        return 'The hangar is now polished to a bright sheen, but the more you look around the more you realize that all of the essential <h>mechanisms</h> are well-maintained and the space is clean in a functional way. The cavernous room is used and used well.<br><br>' +
                            'Nearby, a mechanic checks the landing gear on an Intercepter-class <h>vessel</h>. You recognize it from the flight credentials that Bill shared with you. This will be your home away from home once you leave Reiner Station. As you hover near her, the mechanic turns toward you. Her badge reads "Nella van Daval".<br><br>' +
                            'In another ship bay, Linus Farno snaps at an attendant who stammers an apology before continuing to wipe down the exterior of an opulent pleasure <h>yacht</h>.<br><br>' +
                            'Built into the upper reaches of main wall facing the shield barrier and blast doors, you notice the central <h>control room</h>. Through the floor-to-ceiling glass, you make out flight controllers and other personnel who keep an eye on the ships in the hangar and observe everything that arrives at or leaves the station.';
                    }
                } else if (response.station == 'leppik-station') {
                    if (!response.keywords.includes('go-back')) {
                        return 'The hangar is cavernous, and a multitude of ships are being processed, maintenanced, unloaded, and reloaded.<br><br>' +
                            'Nearby, a heavy freighter preps for departure as Komek energy cells are ferried onboard. One of the crew notices you staring and <h>glowers</h> back.<br><br>' +
                            'A ship engineer idles near the front of your vessel.<br><br>' +
                            'You notice an <h>assault carrier</h> tucked away at the far end of the hangar, with scaffolding and other clutter blocking the view. It\'s almost as if it\'s hiding.<br><br>' +
                            'And then Finneal Lee striding over to you with a mixture of fury and horror spilling out of his eyes and over his twitching mustache.';
                    } else {
                        return 'The hangar is cavernous, and a multitude of ships are being processed, maintenanced, unloaded, and reloaded.<br><br>' +
                            'UA ships that you saw previously are no longer present.<br><br>' +
                            'The ship engineer is busy with another vessel.<br><br>'+
                            'And Finneal Lee is nowhere to be seen.'
                    }
                } else if (response.station == 'kaos-station') {
                    return 'The hangar is less inviting than the station exterior.<br><br>' +
                        'You step off your ship, and there is no one to address. Magnomi security personnel watch anything and everything from their posts.<br><br>' +
                        'You continue to feel unwelcome.';
                } else if (response.station == 'queens-port') {
                    return 'In the control room set above the hangar floor, you see a figure watching you.<br><br>' +
                        'You wave tentatively, but the figure doesn\'t respond in kind.<br><br>' +
                        'Everyone else is focused on their own tasks, and you\'re lost in the sea of people. Might as well refuel and be on your way.';
                }
            },
            entryCommandMessage: function (response) {
                return 'You scan your clearance credentials and enter the hangar.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Hangar Actions',
            displayTitle: () => 'Hangar',
            allowKeywordEntry: true,
            roomPromptList: {
            }
        },
        'armory': {
            title: 'Armory',
            command: ['armory', 'a',],
            displayName: '[A]rmory',
            section: 'flight deck',
            clearanceLevel: 3,
            exitActionState: 'station',
            contexts: ['station'],
            stations: ['reiner-station', 'leppik-station', 'kaos-station', 'queens-port'],
            myTerminalAccess: false,
            available: function (response) {
                if (response.clearanceLevel >= 3) {
                    return true;
                } else {
                    return false;
                }
            },
            entryDisplayMessage: function (response) {
                return 'This is the Armory. Ship parts are everywhere. Gonna change this text soon.';
            },
            entryCommandMessage: function (response) {
                return 'You scan your clearance credentials and enter the armory';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Armory Actions',
            displayTitle: () => 'Armory',
            allowKeywordEntry: true,
            roomPromptList: {
            }
        },
        'derelict-ship': {
            title: 'Derelict Ship',
            command: [],
            displayName: 'Derelict Ship',
            section: '',
            clearanceLevel: 2,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: true,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                return 'As you board the ship, small proximity lights <h>flicker</h> dully, powered by dying cells.<br><br>' +
                    'In the cargo hold, heavy munitions are stacked on pallets--undelivered <h>payloads</h>. Or unrealized potential in the eyes of the Magnomi.<br><br>' +
                    'The small medical bay feels more like an ossuary as you reverently step over skeletons to examine a dusty physician\'s <h>terminal</h>.<br><br>' +
                    'A cramped dormitory contains <h>bunks</h> littered with the personal effects of long-dead crewmembers.<br><br>' +
                    'Entering the cockpit, you look out the viewport between half-lowered shutters. One <h>pilot\'s chair</h> remains empty, but in the other rests a dismembered <h>attack AI</h>, its legs shorn off and unaccounted for.';
            },
            entryCommandMessage: function (response) {
                return 'Docking successful.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Derelict Ship Actions',
            displayTitle: () => 'Derelict Ship',
            allowKeywordEntry: true,
            roomPromptList: {

            }
        },
        'unknown-probe': {
            title: 'Unknown Probe',
            command: [],
            displayName: 'Unknown Probe',
            section: '',
            clearanceLevel: 2,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: true,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                return 'As you process the data, two things become abundantly clear:<br>' +
                    '1) this probe was used exclusively by Linus Farno to transmit personal and professional secrets outside of Reiner Station, and 2) while the sender is visible beyond a <h>shadow</h> of a doubt, the recipient remains uncertain.<br><br>' +
                    "Transmission coordinates reveal that the data is being relayed to UA space, but there is nothing concrete beyond that. With all of the economic convoys, the <h>intelligence</h> agencies, and the outright smuggling, there is only enough here to oust Linus Farno. Not the other involved parties.<br><br>" +
                    "Of the data that you can parse firsthand, there are several personal notes and <h>grievances</h> logged by Linus.<br><br>" +
                    "Some complaints and poorly-<h>veiled</h> threats about Meg Gallak and Bill Bendo.<br><br>" +
                    'And then some <h>encrypted messages</h> that you\'ll need to deliver to the MIU.';
            },
            entryCommandMessage: function (response) {
                return 'Connection Successful: You are now tethered to the probe.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Unknown Probe Actions',
            displayTitle: () => 'Unknown Probe',
            allowKeywordEntry: true,
            roomPromptList: {

            }
        },
        'VEP-H5': {
            title: 'VEP-H5',
            command: [],
            displayName: 'VEP-H5',
            section: '',
            clearanceLevel: 2,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: true,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                return 'Suited up, you <h>walk</h> toward what you can now make out as a smaller scouting ship and the mostly-intact remains of an old Ventus Exploratory Probe. The large pod is propped up against the face of the asteroid, and a wiry, suited individual tinkers away in an exposed circuitry panel.<br><br>' +
                    'The nearby scouting ship is <h>unassuming</h>, yet the sleek exterior likely hides advanced engine tech. It\'s the type of vessel most would look over and forget. You reckon that\'s the point.<br><br>' +
                    'The Ventus Exploratory Probe (VEP-H5 to be exact, per the faded lettering on the worn and dented hull) looks <h>archaic</h> compared to the devices that Ventus sends out now.<br><br>' +
                    'The man in front of you calmly turns from his work on the probe innards. From the briefing you\'ve read, you know this to be Oleg Ali. Before you have the good sense to be <u>frightened</u>, he smiles <h>disarmingly</h>.<br><br>';
            },
            entryCommandMessage: function (response) {
                return 'Connection Successful: You are now tethered to the probe.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'VEP-H5 Actions',
            displayTitle: () => 'VEP-H5',
            allowKeywordEntry: true,
            roomPromptList: {

            }
        },
        'komek-wreckage': {
            title: 'Komek Wreckage',
            command: [],
            displayName: 'Komek Wreckage',
            section: '',
            clearanceLevel: 2,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: true,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                return 'Fragments of recorded messages and audio transcripts spool into your database.<br><br>' +
                    '--This is Engineering. One more strafing run and both our reactor and hulls are out of commission. We\'ll be facing <h>depressurization</h>, structural collapse, and several other problems that would prove to be fatal.<br><br>' +
                    '--There\'s no way I can safely navigate away from the Henko ship without arousing their <h>suspicion</h>.<br><br>' +
                    '--I can\'t believe we\'re going to <h>die</h> for the sake of appearances...<br><br>' +
                    '--Prepare a <h>final transmission</h>--';
            },
            entryCommandMessage: function (response) {
                return 'Connection Successful: You are now tethered to the probe.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Komek Wreckage Actions',
            displayTitle: () => 'Komek Wreckage',
            allowKeywordEntry: true,
            roomPromptList: {
                'depressurization': {
                    command: ['depressurization'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'It looks like the Henko ship was physically shielding the Komek cruiser, using its superior defensive tech to try and give the Komek ship a fighting chance';
                    }
                },
                'die': {
                    command: ['die'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'You detect practically no debris from a third ship, which suggests that the Komek inflicted no damage throughout the skirmish.<br><br>' +
                            'There are no escape pods in the wreckage, so maybe some crew from the Komek and Henko vessels got away.<br><br>' +
                            'But the Henko suffered a sustained, punishing assault based on the sheer size of the debris field and the scale of the individual ship fragments.<br><br>' +
                            'This encounter must have been just as confusing for the participants as it is for you.';
                    }
                },
            }
        },

        // CHAPTER 3
        'event-room': {
            title: '--ERROR--',
            command: [],
            displayName: 'Error',
            section: '',
            clearanceLevel: 3,
            exitActionState: 'station',
            contexts: ['station'],
            myTerminalAccess: false,
            available: function (response) {
                return false;
            },
            entryDisplayMessage: function (response) {
                return 'As Armitage waits expectantly, a high-pitched whine starts ringing in your ear.<br><br>' +
                    'The lights hurt. A splitting migraine starts to drill into the back of your eyes.<br><br>' +
                    'Armitage says something, but you don\'t hear him. Bill looks on concerned, and you wonder for a moment why he\'s falling away from you.<br><br>' +
                    'Right before everything goes black you realize you\'re the one <h>falling.</h>';
            },
            entryCommandMessage: function (response) {
                return 'Error: The Terminal is malfunctioning.';
            },
            noRoomPrompt: function (response) {
                return 'Error: The Terminal is malfunctioning.';
            },
            actionTitle: () => 'ERROR',
            displayTitle: () => 'ERROR',
            allowKeywordEntry: true,
            roomPromptList: {
                'awake': {
                    command: ['awake'],
                    requiredKeywords: ['falling'],
                    minimumClearanceLevel: 3,
                    changeRoom: 'med-bay',
                    responseMessage: function (response) {
                        return 'Falling command.';
                    }
                },
            }
        },
        'med-bay': {
            title: 'Med Bay',
            command: ['med', 'med bay'],
            displayName: '[Med] Bay',
            section: 'station',
            contexts: ['station'],
            stations: ['reiner-station'],
            clearanceLevel: 3,
            exitActionState: 'station',
            myTerminalAccess: false,
            available: function (response) {
                if (response.clearanceLevel >= 3 && response.keywords.includes('falling')) {
                    return true;
                } else {
                    return false;
                }
            },
            entryDisplayMessage: function (response) {
                if (response.keywords.includes('rest')) {
                    return 'The medbay is not busy, and you realize that\'s likely what the medical staff prefer.<br><br>' +
                        'Hopefully you--or anyone else--don\'t end up here anytime soon.<br><br>' +
                        'The AI physio bots go about their business and ignore you.'
                } else {
                    return 'The lights hurts again. Or rather, the light hurts. There\'s just one right now, dangling above you from an articulating light.<br><br>' +
                        'A phantom hand moves the source of bright stabbing pain away until a face materializes in front of you.<br><br>' +
                        'It\'s Bill Bendo, wearing the same look of concern from Armitage\'s office.';
                }

            },
            entryCommandMessage: function (response) {
                if (!response.keywords.includes('rest')) {
                    return 'The room is probably the cleanest you\'ve seen on Reiner Station. This must be the Med Bay. Still pretty dirty though.';
                } else {
                    return 'The smell of pure alchohol fills your nostrils. You try not to bump into an AI physio bot.';
                }
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Med Bay Actions',
            displayTitle: () => 'Med Bay',
            allowKeywordEntry: true,
            roomPromptList: {
            }
        },
        'brig': {
            title: 'Brig',
            command: ['brig', 'b'],
            displayName: '[B]rig',
            section: 'station',
            contexts: ['station'],
            stations: ['reiner-station'],
            clearanceLevel: 3,
            exitActionState: 'station',
            myTerminalAccess: false,
            available: function (response) {
                if (response.clearanceLevel >= 3 && response.keywords.includes('rest')) {
                    return true;
                } else {
                    return false;
                }
            },
            entryDisplayMessage: function (response) {

                if (response.clearanceLevel <= 3) {
                    return 'The brig is a cold place, even without bringing temperature into consideration. The small furnishings or decorations that adorn personal quarters or enliven other rooms are absent here.<br><br>' +
                    'Two combat servitors flank the only <h>occupied</h> cell--though "occupied" is a little generous given the still form of Lynna Tragel.<br><br>' +
                    'Security cameras ring the upper perimeter of the walls, ensuring there is no <h>blind</h> spot.<br><br>' +
                    'The other cells remain empty and unshielded--little to no violence or insubordination has been <h>documented</h> on Reiner Station since your arrival beyond Meg Gallak\'s murder and Lynna\'s mysterious death.<br><br>' +
                    'Bill Bendo stands over Lynna\'s body, gazing down in consternation.';
                } else {
                    return 'The brig is a cold place, even without bringing temperature into consideration. The small furnishings or decorations that adorn personal quarters or enliven other rooms are absent here.';
                }

            },
            entryCommandMessage: function (response) {
                return 'The air is noticeably thin.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Brig Actions',
            displayTitle: () => 'The Brig',
            allowKeywordEntry: true,
            roomPromptList: {
                'propaganda': {
                    command: ['propaganda'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'You swipe through the propaganda images on the display.<br><br>' +
                            'On one poster featuring a UA General, the words “>>"follow the money"<<” are scribbled in bright blue ink.';
                    }
                },
                'datapads': {
                    command: ['datapads'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'You pour through the datapads. Dozens of files are open on the history of Henko shield tech.<br><br>' +
                            'You stumbled across a partially corrupted file, where only a dozen words are visible.<br><br>' +
                            'The word >>backbone<< is highlighted.';
                    }
                },
                'sit-down': {
                    command: ['sit down', 'chaise', 'lounge', 'chaise lounge', 'sit', 'lie down', 'lay down'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'You sit down to catch your breathe, resting your head back on the chaise lounge.<br><br>' +
                            'Then you see it, a ceiling tile ever-so-slightly dislodged.<br><br>' +
                            'You remove the tile and pop your head into ceiling, but are disappointed. Only a single >>datastick<< is left behind.';
                    }
                },
                'brandy': {
                    command: ['brandy', 'drink', 'have a drink', 'glasses'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Just a sip. No will know, right?<br><br>' +
                            'Oaky, some fruity undertones, and the harshest >>bite<< you\'ve ever experienced.';
                    }
                },
            }
        },
        'moro-mada-ship': {
            title: 'Moro Mada\'s Ship',
            command: [],
            displayName: 'Moro Mada\'s Ship',
            section: '',
            clearanceLevel: 3,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: true,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                return 'You are immediately confronted with two warring personalities when you step onto the other ship. You\'ve never seen a more <h>voluminous</h> collection of physical texts, datapads, and info terminals. But contrasting the sheer avalanche of visual data is a treasure trove of weaponry, scattered about more haphazardly than the texts. Shoulder-mounted lasers used as desk weights and other <h>eccentricities</h>.<br><br>' +
                    'Someone joins you in the main room. Sporting a slim <h>tactical suit</h> with obsidian hair pulled back from a pinched face and steely eyes, Moro Mada stands like a coiled spring, ready for anything. At the same time, though, she seems so relaxed.<br><br>' +
                    'She studies you with pursed lips.<br><br>' +
                    "Took you long enough.";
            },
            entryCommandMessage: function (response) {
                return 'Boarding successful.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Moro Mada Ship Actions',
            displayTitle: () => 'Moro Mada\'s Ship',
            allowKeywordEntry: true,
            roomPromptList: {

            }
        },
        'my-cargo-hold': {
            title: 'Cargo Hold',
            command: [],
            displayName: 'Cargo Hold',
            section: '',
            clearanceLevel: 3,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: true,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                if (response.clearanceLevel <= 3) {
                    if (response.keywords.includes('bye-oleg')) {
                        return 'Devon we need to write something for this. Love you bye!';
                    } else {
                        return 'After you finish loading the Sorelian </h>thruster tech</h>, a ship alert wails from the klaxon alarm.<br><br>' +
                            'Doors seal in the cargo hold as the onboard AI warns of a sudden hull breach and depressurization in another ship compartment.<br><br>' +
                            'Then, just as suddenly as the alarm started, it stops. The doors open and outside the cargo hold stand Oleg Ali. His face is the only thing you recognize through the helmet visor as the rest of him is clad in a <h>beetle</h>-like exosuit. An industrial-strength mining laser is in one hand and a custom welding machine is in the other.<br><br>' +
                            'As he waltzes over to you, you can\'t help but visualize this lone figure gliding through space in nothing but his suit and then carving into your ship like an insect boring into some unsuspecting structure.';
                    }
                } else if (response.clearanceLevel == 4 && !response.keywords.includes('fragment')) {
                    return 'Once again, Oleg Ali boards your ship. Mercifully, this time it didn\'t involve your hull being burrowed into by an insect with a mining laser.<br><br>' +
                    'He saunters up to you and grins widely.<br><br>' +
                    '"Miss me?"';
                } else {
                    return 'And just like that, Oleg is gone.';
                }

            },
            entryCommandMessage: function (response) {
                return 'You\'ve entered your cargo hold.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Cargo Hold Actions',
            displayTitle: () => 'Cargo Hold',
            allowKeywordEntry: true,
            roomPromptList: {

            }
        },
        'magnomi-warship': {
            title: 'Magnomi Warship',
            command: [],
            displayName: 'Magnomi Warship',
            section: '',
            clearanceLevel: 3,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: false,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                if (response.keywords.includes('crumpled')) {
                    return 'You\'re back in control of your own ship. How it happened doesn\'t feel good, but you\'re ready to explore again.';
                    /*
                    return 'Answer these three questions:<br><br>' +
                    'Who gains from Moonraker infighting?<br><br>' +
                    'What kind of killer leaves a trace?<br><br>' +
                    'Is anyone benefiting from you chasing me?<br><br>' +
                    'After you dwell on that, know this: If you come after me again, I will not hesitate to kill you. Our plans matter more than appeasing a trite Henko representative for a blundering MIU investigation. Get your heads out of your collective asses.<br><br>' +
                    '-RR';
                    */
                } else {
                    return 'Before you can raise shields or defend yourself in a meaningful way, a torpedo crashes against the bow of your vessel, overloading your ship systems and disseminating a nerve toxin into the life support system, rendering you inert.<br><br>' +
                        'A cold dark shroud folds over you.<br><br>' +
                        'When you wake, you\'re no longer on your ship but instead strapped to a chair. Ryan Rogal stands over you with a gun pointed menacingly at your head.';
                }

            },
            entryCommandMessage: function (response) {
                if (response.keywords.includes('crumpled')) {
                    return 'You return to your captain\'s chair.';
                } else {
                    return 'The channel is encrypted, but you can tell it\'s a Magnomi ship.';
                }

            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Magnomi Warship Actions',
            displayTitle: () => 'Magnomi Warship',
            allowKeywordEntry: true,
            roomPromptList: {

            }
        },
        'hidden-base': {
            title: 'Hidden Base',
            command: [],
            displayName: 'Hidden Base',
            section: '',
            clearanceLevel: 3,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: true,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                return 'During your descent you noticed that only the central structure remains <h>intact</h>. That\'s where you head. In the dilapidated lobby, you take in your surroundings.<br><br>' +
                    'A central terminal <h>hums</h> with life despite a cracked screen and a grimy console.<br><br>' +
                    'Large viewports provide a sightline to the two spaceships on the docking bay through swaths of hastily-cleaned <h>polymer</h>.<br><br>' +
                    'Nearby the central terminal, on a cot that looks nicer than most of the beds you\'ve seen at Reiner Station, Linus Farno is... <h>napping</h>.';
            },
            entryCommandMessage: function (response) {
                return 'Landing successful.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Hidden Base Actions',
            displayTitle: () => 'Hidden Base',
            allowKeywordEntry: true,
            roomPromptList: {

            }
        },
        // FINAL CHAPTER
        'personal-quarters': {
            title: 'Personal Quarters',
            command: ['p', 'personal quarters'],
            displayName: '[P]ersonal Quarters',
            section: 'station',
            contexts: ['station'],
            stations: ['reiner-station'],
            clearanceLevel: 4,
            exitActionState: 'station',
            myTerminalAccess: true,
            available: function (response) {
                if (response.clearanceLevel == 4 && response.keywords.includes('kill-bill')) {
                    return true;
                } else {
                    return false;
                }
            },
            entryDisplayMessage: function (response) {

                if (response.clearanceLevel == 4 && !response.keywords.includes('fallen')) {
                    return 'You wake up in a cold sweat. You\'re in your personal quarters. Your hands are empty, but your heart is pounding.<br><br>' +
                    'Across from the bed, a full-length mirror reflects your perspiring body and your vacant stare.<br><br>' +
                    'The faintest red light pulsates from underneath a scar near your hip. You recall Bill\'s <h>sightless</h> eyes.';
                } else if (response.clearanceLevel == 4 && response.keywords.includes('fallen')) {
                    return 'You\'re in your personal quarters. Your hands are empty, but your heart is still pounding.<br><br>' +
                    'Across from the bed, a full-length mirror reflects your perspiring body and your vacant stare.<br><br>' +
                    'The faintest red light pulsates from underneath a scar near your hip. You recall Bill\'s sightless eyes.';
                } else {
                    return ''
                }

            },
            entryCommandMessage: function (response) {
                return 'It\'s cold and quiet.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Personal Quarters',
            displayTitle: () => 'Personal Quarters',
            allowKeywordEntry: true,
            roomPromptList: {
                'adfkejage': {
                    command: ['leaving this in case we need it'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'You swipe through the propaganda images on the display.<br><br>' +
                            'On one poster featuring a UA General, the words “>>"follow the money"<<” are scribbled in bright blue ink.';
                    }
                },
                
            }
        },
        'data-vault': {
            title: 'Data Vault',
            command: [],
            displayName: 'Data Vault',
            section: '',
            clearanceLevel: 3,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: true,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                return 'An onboard AI boots up and awaits your input.';
            },
            entryCommandMessage: function (response) {
                return 'Tether successful.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Data Vault Actions',
            displayTitle: () => 'Data Vault',
            allowKeywordEntry: true,
            roomPromptList: {

            }
        },
        'sorelia-waystation-1': {
            title: 'Sorelia Waystation NX7',
            command: [],
            displayName: 'Sorelia Waystation NX7',
            section: '',
            clearanceLevel: 3,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: true,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                return 'As you exit the airlock and enter the station, you realize what Oleg Ali meant about the security measures or impregnable design.<br><br>' +
                'The inner surfaces, metal or otherwise, seem to be constructed in a seamless fashion. Each piece flows into the next as if it were an organism with skin rather than a station with paneling, walls, and digital displays.<br><br>' +
                'You\'re equally unsettled and impressed as you walk into a large common room. Moro Mada reclines on cushioned furniture and eyes you as predator eyes prey.';
            },
            entryCommandMessage: function (response) {
                return 'Docking successful.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Waystation NX7 Actions',
            displayTitle: () => 'Sorelia Waystation NX7',
            allowKeywordEntry: true,
            roomPromptList: {

            }
        },
        'sorelia-waystation-2': {
            title: 'Sorelia Waystation UW3',
            command: [],
            displayName: 'Sorelia Waystation UW3',
            section: '',
            clearanceLevel: 3,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: true,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                if (response.keywords.includes('chimes')) {
                    return 'You\'re left standing alone with no sense of where Vanta Sae went. Was she even there to begin with?<br><br>Something inside you feels different. Lighter.';
                } else {
                    return 'A hulking mass steps in front of you. Though you\'ve never seen any image, from Moro\'s warning, you realize you\'re in the formidable presence of Vanta Sae.<br><br>' +
                    'Their visage haunts you.';
                }
                
            },
            entryCommandMessage: function (response) {
                return 'Docking successful.';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Waystation NX7 Actions',
            displayTitle: () => 'Sorelia Waystation NX7',
            allowKeywordEntry: true,
            roomPromptList: {

            }
        },
        'sorelia': {
            title: 'Sorelia',
            command: [],
            displayName: 'Sorelia HQ',
            section: '',
            clearanceLevel: 3,
            exitActionState: 'world',
            contexts: ['world'],
            myTerminalAccess: true,
            available: function (response) {
                return (response.context == 'world');
            },
            entryDisplayMessage: function (response) {
                if (response.keywords.includes('dae-arum')) {
                    return 'You find your self back aboard your ship. And like Dae Arum, Sorelia is... gone. As if it never existed.';
                } else {
                    return 'You don\'t have to wonder for long, though, before your ship starts to move.<br><br>' +
                'It\'s Sorelia, so you don\'t balk at the sudden loss of control. Control has been an ephemeral thing of late, anyway.<br><br>' +
                'When you do stop, the ramp in the cargo bay opens remotely and you walk out onto a circular dais.<br><br>' +
                'On the immaculate stone surface stands a lone figure, who walks forward and stops a few steps from you. She introduces herself as Dae Arum.<br><br>' +
                '"I am the voice of Sorelia."<br><br>' +
                'As you open your mouth to clarify what she means, she interrupts with the answer.<br><br>' +
                '"I function as a translator. However, in this instance, I am more. This platform is all you will know of Sorelia other than what you\'ve witnessed today. Sorelia wishes to speak with you, and I will translate. Hence, I am the voice. So, speak."';
                }
                
            },
            entryCommandMessage: function (response) {
                return 'ERROR: Your ship controls are unresponsive.<br><br>' +
                'You have discovered Sorelia.<br><br>' +
                'OMEGA CLEARANCE CODE:<h>IGOR-S93V<h>';
            },
            noRoomPrompt: function (response) {
                return 'Error: Did not recognize command.';
            },
            actionTitle: () => 'Sorelia HQ Actions',
            displayTitle: () => 'Sorelia HQ',
            allowKeywordEntry: true,
            roomPromptList: {

            }
        },


    },

}

function createRoomObject(key, room, response) {

    const roomObject = {
        key: key,
        title: room.title,
        command: room.command,
        section: room.section,
        displayName: room.displayName,
        available: room.available(response),
        entryDisplayMessage: room.entryDisplayMessage(response),
        entryCommandMessage: room.entryCommandMessage(response),
        actionTitle: room.actionTitle(),
        displayTitle: room.displayTitle(),
        allowKeywordEntry: room.allowKeywordEntry,
        exitActionState: room.exitActionState,
        myTerminalAccess: room.myTerminalAccess,
        contexts: room.contexts,
        stations: room.stations

    }

    return roomObject;
}

module.exports = Rooms;