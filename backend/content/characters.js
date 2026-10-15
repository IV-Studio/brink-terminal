const Database = require('./database');
const { keywordList } = require('./keywords');

const Characters = {
    checkCharacters: function (response) {
        const characters = Characters.characterList;

        const availableCharacters = {};

        // Loop through each character in the character list
        for (const key in characters) {
            if (characters.hasOwnProperty(key)) {
                const character = characters[key];

                // Check if the user's clearance level is high enough
                const hasClearance =
                    response.clearanceLevel >= character.minimumClearanceLevel;

                // Check if all required keywords are present
                const hasKeywords =
                    character.requiredKeywords.every((keyword) =>
                        response.keywords.includes(keyword)
                    );
                // TO DO: check station

                if (hasClearance && hasKeywords) {
                    // If both conditions are met, add the character to the available list
                    const characterObject = createCharacterObject(key, response);
                    availableCharacters[key] = characterObject;
                }
            }
        }

        response.characters = availableCharacters;
        return response;
    },

    checkForErrors: function () {
        const characters = Characters.characterList;

        const availableCharacters = {};

        // Loop through each character in the character list
        for (const key in characters) {
            if (characters.hasOwnProperty(key)) {
                const character = characters[key];
                checkForDuplicateCommands(character, key);
            }
        }
    },

    /*
    conversationPrompt: function (response, command, character) {
        const { clearanceLevel } = response.clearanceLevel;
        const { keywords } = response.keywords;

        if (Characters.characterList.hasOwnProperty(character)) {
            const characterObject = Characters.characterList[character];

            for (const key in characterObject.conversationList) {
                if (characterObject.conversationList.hasOwnProperty(key)) {
                    const conversation = characterObject.conversationList[key];
                    const commands = conversation.command;

                    if (response.clearanceLevel >= conversation.minimumClearanceLevel) {
                        // Check if the input matches any command in the current conversation
                        if (commands.includes(command.toLowerCase())) {
                            response.conversationResponse = conversation.responseMessage(response);
                            return response; // Return the matching conversation
                        }
                    }
                }
            }
            response.conversationResponse = characterObject.noResponse(response);
            return response;
        }

        return response;

    },
    */
    conversationPrompt: function (response, command, character) {
        // Extract clearanceLevel and keywords from the response object
        const clearanceLevel = response.clearanceLevel;
        const keywords = response.keywords;
    
        // Check if the character exists in the character list
        if (Characters.characterList.hasOwnProperty(character)) {
            const characterObject = Characters.characterList[character];
    
            // Array to store potential matching conversations
            let matchingConversations = [];
    
            // Iterate through the character's conversation list
            for (const key in characterObject.conversationList) {
                if (characterObject.conversationList.hasOwnProperty(key)) {
                    const conversation = characterObject.conversationList[key];
                    const commands = conversation.command;
    
                    // Check if the command matches any command in the conversation
                    if (commands.includes(command.toLowerCase())) {
                        // Check if the user's clearance level is sufficient
                        if (clearanceLevel >= conversation.minimumClearanceLevel) {
                            // Add matching conversation to the array
                            matchingConversations.push(conversation);
                        }
                    }
                }
            }
    
            // If there are matching conversations, select the one with the highest minimumClearanceLevel
            if (matchingConversations.length > 0) {
                let bestConversation = matchingConversations.reduce((prev, current) => {
                    return (prev.minimumClearanceLevel > current.minimumClearanceLevel) ? prev : current;
                });
    
                // Set the conversation response using the responseMessage function
                response.conversationResponse = bestConversation.responseMessage(response);
                if (bestConversation.eventMoment != null) {
                    response.eventMoment = true;
                }
                return response; // Return the matching conversation response
            }
    
            // If no matching command is found, set to noResponse function
            response.conversationResponse = characterObject.noResponse(response);
            return response;
        }
    
        // Return the original response if the character does not exist
        return response;
    },

    // NOTE : Key must match their entry in the Database.js file
    characterList: {
        'bartender': {
            requiredKeywords: [],
            minimumClearanceLevel: -1,
            getStation: function (response) {
                return 'reiner-station';
            },
            getRoom: function (response) {
                if (response.clearanceLevel == 4) {
                    return 'hangar';
                } else {
                    return 'tavern';
                }
                
            },
            entryCommandMessage: function (response) {
                return '<hr>You sit down at the bar. The barkeep approaches.';
            },
            entryDisplayMessage: function (response) {
                if (response.clearanceLevel <= 0) {
                    return 'Good day. Would you like to see our <h>menu</h>?';
                } else if (response.clearanceLevel == 1) {
                    return 'Hello, friend. I\'ve been working on our <h>menu</h>. Wanna try something new?';
                } else if (response.clearanceLevel == 2) {
                    return 'It\'s space o\'clock somewhere. So take a look at the <h>menu</h> and see if there\'s something there for you.'
                } else if (response.clearanceLevel == 3) {
                    return 'You only love me for my <h>menu</h>, don\'t you?'
                } else if (response.clearanceLevel >= 4) {
                    return 'I\'m afraid I don\'t have a new menu right now.<br><br>' +
                    'The tavern is being inspected right now apparently, so I\'ve been relegated to inventory here in the hangar.' +
                    'Sad, really. Take away a job that Ryle relishes oh so much and give it to an AI that doesn\'t need to do hands-on math...'
                }
            },
            noResponse: function (response) {
                let characterResponse = chooseRandomString([
                    "Hmm I don't think we have that. A <h>menu</h> perhaps?",
                    "I don't know anything about that, sorry.",
                ]);

                if (response.clearanceLevel >= 4) {
                    characterResponse = chooseRandomString([
                        "I won't say anything if you want to sneak a bottle.",
                        "I feel tired? Not sure that's part of my programming.",
                        "Be careful out there.",
                        'You ever heard of an AI named BL1NK? Why..? No reason.'
                    ]);
                }
                return characterResponse;
            },
            conversationList: {
                'hello': {
                    command: ['hello', 'hi', 'yo', 'hello there'],
                    requiredKeywords: [],
                    minimumClearanceLevel: -1,
                    responseMessage: function (response) {
                        return 'Hello, and welcome. Can I get you something? Or would you like to see our <h>menu</h>?';
                    }
                },
                'menu': {
                    command: ['menu'],
                    requiredKeywords: [],
                    minimumClearanceLevel: -1,
                    responseMessage: function (response) {

                        let returnResponse = '';

                        if (response.clearanceLevel <= 0) {
                            returnResponse = 'Here you are.<br><br>' +
                                '<u>COCKTAIL MENU</u><br><br>' +
                                '<h>Moonraker Sunrise</h> - tequila, orange juice, strawberry, and a dash of hope<br><br>' +
                                '<h>Bourbon Hazard</h> - bourbon, orange liqueur, jalapeno, and honey<br><br>' +
                                '<h>UA Forget-Me-Not</h> - absinthe, cherry liqueur, lime juice, simple syrup';
                        } else if (response.clearanceLevel == 1) {
                            returnResponse = 'Here you are.<br><br>' +
                                '<u>COCKTAIL MENU</u><br><br>' +
                                '<h>Whiskey</h> - sometimes that\'s all you need<br><br>' +
                                '<h>The Big One</h> - you fulfill this contract and the day unwinds in epic fashion<br><br>' +
                                '<h>The Usual</h> - whatever you like, whenever you like it';
                        } else if (response.clearanceLevel == 2) {
                            returnResponse = 'Here you are.<br><br>' +
                                '<u>COCKTAIL MENU</u><br><br>' +
                                '<h>Tequila Old Fashioned</h> - It\'s like a regular old fashioned but with tequila<br><br>' +
                                '<h>Screwdriver</h> - well, I\'ve got two options for you. either vodka with orange juice or I can give you an actual screwdriver. depends on what you need in a given moment<br><br>' +
                                '<h>Water</h> - honestly, hydration is underrated';
                        } else if (response.clearanceLevel >= 3) {
                            returnResponse = 'Here you are.<br><br>' +
                                '<u>COCKTAIL MENU</u><br><br>' +
                                '<h>Mocktail</h> -  it\'s a little thing I conjured up the other night when i couldn\'t sleep' +
                                '<h>Sartoc Brandy</h> - it\'s way too expensive for the average Moonraker, but you reminded me how good it is<br><br>' +
                                '<h>Tears of Joy</h> - i was leaving this one open to interpretation. what tears would you want to drink?';
                        }
                        return returnResponse;
                    }
                },
                'sunrise': {
                    command: ['moonraker sunrise', 'sunrise', 'moonraker'],
                    requiredKeywords: [],
                    minimumClearanceLevel: -1,
                    responseMessage: function (response) {
                        return 'Good choice. Everyone needs a little hope every now and then.<br><br>Sunrise on the way.';
                    }
                },
                'bourbon': {
                    command: ['bourbon hazard', 'hazard', 'bourbon'],
                    requiredKeywords: [],
                    minimumClearanceLevel: -1,
                    responseMessage: function (response) {
                        return 'You like to live dangerously, I see. It\'s nice to mix things up.<br>One Bourbon Hazard coming right up.';
                    }
                },
                'ua': {
                    command: ['ua', 'UA', 'ua forget-me-not'],
                    requiredKeywords: [],
                    minimumClearanceLevel: -1,
                    responseMessage: function (response) {
                        return 'I wish we could all forget the UA, but sadly they seem intent on sticking around.<br>Maybe not for long...';
                    }
                },
                'bye': {
                    command: ['bye', 'goodbye', 'adios'],
                    requiredKeywords: [],
                    minimumClearanceLevel: -1,
                    responseMessage: function (response) {
                        return 'Good day to you';
                    }
                },
                'another': {
                    command: ['another', 'another one', 'one more'],
                    requiredKeywords: [],
                    minimumClearanceLevel: -1,
                    responseMessage: function (response) {
                        return 'Hmm. One looks like plenty for you.';
                    }
                },
                // CHAPTER 1
                'secret': {
                    command: ['secret'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 0,
                    responseMessage: function (response) {
                        return 'Ah, our mutual friend sent you. You want to sample the <h>rare</h> spirits. Very well.';
                    }
                },
                'rare': {
                    command: ['rare'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 0,
                    responseMessage: function (response) {
                        return '<u>SECRET MENU</u><br><br>' +

                            '<h>Cup o\' Chancellor</h> - everything you hate chilled to perfection in a coup(e) glass<br><br>' +

                            '<h>Ark Tiki</h> - a sip of subterfuge, a hefty dose of red tape, and no honest answers<br><br>' +

                            '<h>Farnos Farce</h> - a dash of intrigue, a fistful of credits, a shot of treason';
                    }
                },
                'cup-o-chancellor': {
                    command: ['chancellor', 'cup o\' chancellor', 'cup'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 0,
                    responseMessage: function (response) {
                        return 'It wouldn\'t be wise to speak about that with you right now.';
                    }
                },
                'arktiki': {
                    command: ['ark', 'tiki', 'ark tiki'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 0,
                    responseMessage: function (response) {
                        return 'There\'s a reason that Ark Tii isn\'t here anymore. I worry our mutual friend may stumble into that very reason.<br>' +
                            'I think she\'s in <h>trouble</h>.<br>' +
                            'Could you help her? I quite like her. She\'s one of the few nice ones.';
                    }
                },
                'trouble': {
                    command: ['trouble'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 0,
                    responseMessage: function (response) {
                        return 'I\'ve already said more than I should. Perhaps you should try messaging our friend about her <h>trouble</h>s?';
                    }
                },
                'farnos-farce': {
                    command: ['farnos', 'farce', 'farnos farce'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 0,
                    responseMessage: function (response) {
                        return 'Let\'s chat about that another time.';
                    }
                },
                // CHAPTER 2
                'whiskey': {
                    command: ['whiskey'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Whiskey, coming right up.';
                    }
                },
                'big-one': {
                    command: ['big one', 'the big one'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'In a celebratory mood today, huh?';
                    }
                },
                'usual': {
                    command: ['the usual', 'usual'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'It shouldn\'t be that surprising. It\'s my job to know what you like. And I\'m very good at my job.<br><br>' +
                            'The Usual, incoming.';
                    }
                },
                'kinta-lar': {
                    command: ['kinta', 'lar', 'kinta lar'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'She\'s never been very talkative. A more transactional individual I\'ve never seen.<br><br>' +
                            'And that\'s saying something. I deal in transactions for a living.<br><br>' +
                            'Not sure what will make her talk.';
                    }
                },
                'linus-farno': {
                    command: ['linus', 'farno', 'linus farno'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 1) {
                            return 'That man would make my skin crawl if I had any.<br><br>' +
                            'He\'s an unsavory type, and I suspect that if you come between him and something that he wants, then you will find yourself moved, forcefully.';
                        } else if (response.clearanceLevel == 2) {
                            return 'Still a prick.';
                        }  else if (response.clearanceLevel >= 3) {
                            return 'Arrogance and stupidity on the station have plummeted to their lowest levels ever since he ran off.';
                        }
                    }
                },
                'meg-gallack': {
                    command: ['meg', 'gallack', 'meg gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 1) {
                            return 'I was saddened to hear that she was taken from us.<br><br>' +
                                'It\'s up to you, though, to fix this. I\'ll help how I can, but it\'s up to you.';
                        } else if (response.clearanceLevel == 2) {
                            return 'Sometimes I feel like she\'s still here with us.';
                        } else if (response.clearanceLevel == 3) {
                            return 'Do you hear her in your head too?';
                        } else if (response.clearanceLevel >= 4) {
                            return 'Err.. I mean, have you figured out who killed her yet?';
                        }
                    }
                },
                'oleg-ali': {
                    command: ['oleg', 'ali', 'oleg ali'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'I don\'t recommend you go looking for him.<br><br> ' +
                            'You have more constitution than I do, though, so who knows? Maybe he\'ll surprise you.';
                    }
                },
                'armitage': {
                    command: ['armitage'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 1) {
                            return 'I don\'t envy being at the top of the pyramid. Sometimes I think gravity flows in reverse and the ones at the top feel it the most.<br><br>' +
                                'I hope he\'s able to keep the station running despite all of the discord lately.';
                        } else if (response.clearanceLevel == 2) {
                            return 'I saw him in the offices if you need to chat with him.'
                        } else if (response.clearanceLevel >= 3) {
                            return 'He has not been having the best of weeks...'
                        }
                    }
                },
                'moro-mada': {
                    command: ['moro', 'mada', 'moro mada'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 1) {
                            return 'That woman has the kind of reputation that scares you even if only half of what they say is true.<br><br>' +
                            'Meg was fond of her, though.';
                        } else if (response.clearanceLevel == 2) {
                            return 'What if I told you I was Moro Mada?<br><br>' +
                            'I\'m not, but I wanted to see your face.'
                        } else if (response.clearanceLevel >= 3) {
                            return 'It seems like she\'ll show up before it\'s all over.<br><br>' +
                            'I\'m not sure why I said that...';
                        }
                        
                    }
                },
                'vintage': {
                    command: ['vintage'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'This is a fine brandy. One of the most expensive bottles from the Sartoc region. Whoever owned this was <h>lucky</h>. Whoever drank it, luckier still.';
                    }
                },
                'lucky': {
                    command: ['lucky'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Life\'s limitations bears fruit, though.<br><br>' +
                            'Space, on this station and on our ships, is finite. It is sacrosanct.<br><br>' +
                            'Cargo is just as tightly regulated as those who <h>transport</h> it.<br><br>' +
                            'So <u>check with Ryle al Wren</u> in the administrative offices. He keeps fasitidious records of all ships going in and out of Reiner Station.<br><br>' +
                            'If anyone knows when and from where an expensive bottle of Sartoc brandy originated, it would be him.';
                    }
                },
                'transport': {
                    command: ['transport'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'As I mentioned, Ryle al Wren might have some information on this.';
                    }
                },
                // CHAPTER 3
                'tequila-old-fashioned': {
                    command: ['tequila', 'tequila old fashioned'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'You\'re a fancy one, aren\'t you? I like your style.';
                    }
                },
                'screwdriver': {
                    command: ['screwdriver'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'I\'ll bring you both, just in case.';
                    }
                },
                'water': {
                    command: ['water'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'I should serve this more.';
                    }
                },
                'ryan-rogal': {
                    command: ['ryan', 'rogal', 'ryan rogal'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 2) {
                            return 'There are some names that you hear and you stop talking.<br><br>' +
                            'That\'s one of those.';
                        } else { 
                            return 'You must be a thrill-seeker.<br><br>' +
                            'Don\'t fly too close to stars, though. You\'ll incinerate once your hull shielding fails. At least that\'s what they tell me.';
                        }

                    }
                },
                'omnitus': {
                    command: ['omnitus'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 2) {
                            return 'Maybe I shouldn\'t know this, but rift-bending is like short-burst spatial jumping.<br><br>' +
                            'Think of splicing through the fabric of space to reappear a short distance away.<br><br>' +
                            'Terrifying if you could control it, right?';
                        } else {
                            return 'I\'d rather drink, wouldn\'t you?';
                        }
                    }
                },
                // CHAPTER 4
                'mocktail': {
                    command: ['mocktail'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'So here\'s the kicker: it doesn\'t have any alcohol in it. That kinda ruins the fun for me personally, but I don\'t judge.';
                    }
                },
                'sartoc-brandy': {
                    command: ['sartoc', 'sartoc brandy'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Feeling spendy today, are we? I like it!';
                    }
                },
                'tears-of-joy': {
                    command: ['tears', 'tears of joy'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Coming right up. Next time it will be Tears of Despair.';
                    }
                },
                'bill-bendo': {
                    command: ['bill', 'bill-bendo'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'He\'s the one inspecting the tavern right now.<br><br>' +
                        'Not sure why, though. He inspects it every night, if you catch my drift.';
                    }
                },
                'armitage': {
                    command: ['armitage'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'It\'s almost like he\'s breeding those combat servitors. They\re everywhere now...';
                    }
                },
            }
        },
        'bill-bendo': {
            requiredKeywords: [],
            minimumClearanceLevel: 0,
            getStation: function (response) {
                return 'reiner-station';
            },
            getRoom: function (response) {
                if (response.clearanceLevel == 0 && response.keywords.includes('terrible')) {
                    return 'tavern';
                } else if (response.clearanceLevel == 1 && response.keywords.includes('unmask') || response.clearanceLevel == 1 && response.keywords.includes('postulate')) {
                    return 'administrative-offices';
                } else if (response.clearanceLevel == 2 && !response.keywords.includes('chapter-3-finished')) {
                    return 'megs-quarters';
                } else if (response.clearanceLevel == 2 && response.keywords.includes('chapter-3-finished')) {
                    return 'administrative-offices';
                } else if (response.clearanceLevel == 3 && !response.keywords.includes('rest')) {
                    return 'med-bay';
                } else if (response.clearanceLevel == 3 && response.keywords.includes('rest')) {
                    return 'brig';
                } else if (response.clearanceLevel == 4 && !response.keywords.includes('more') && !response.keywords.includes('dae-arum')) {
                    return 'tavern';
                } else if (response.clearanceLevel == 4 && response.keywords.includes('dae-arum')) {
                    return 'tavern';
                }
                return '';
            },
            entryCommandMessage: function (response) {
                if (response.clearanceLevel <= 0) {
                    return '<hr>You sit down at the bar next to Bill. He looks frazzled.';
                } else if (response.clearanceLevel == 1) {
                    return '<hr>You approach Bill\'s makeshift desk. It has a functional messines to it. He does not look up, so you give it a light knock.';
                } else if (response.clearanceLevel == 2 && !response.keywords.includes('chapter-3-finished')) {
                    return '<hr>You approach Bill who is staring at Meg\'s wall, deep in thought.';
                } else if (response.clearanceLevel == 2 && response.keywords.includes('chapter-3-finished')) {
                    return '<hr>You approach Bill. You notice his hand is slightly shaking.';
                } else if (response.clearanceLevel == 3 && !response.keywords.includes('rest')) {
                    return '<hr>Bill looks on an you as you sit up slightly in your bed.';
                } else if (response.clearanceLevel == 3 && response.keywords.includes('rest')) {
                    return '<hr>You stand next to Bill.';
                } else if (response.clearanceLevel == 4) {
                    return '<hr>You sit next to Bill.';
                }

            },
            entryDisplayMessage: function (response) {

                if (response.clearanceLevel == 4 && response.keywords.includes('bill-final')) {
                    return 'Ah you again.<br>Buy me a drink when the bartender comes back, eh?<br><br>I think you owe me one. Or twenty. Or however many drinks "I almost killed you" buys me.';
                }
                if (response.clearanceLevel <= 0) {
                    return 'Why do I get the feeling that you already know what I\'m about to say?<br><br>' +
                        'I just met with Armitage, but it feels like word travels around the station faster than the people do.<br><br>' +
                        '...sigh...<br><br>' +
                        'Meg Gallak is <h>dead</h>.?';
                } else if (response.clearanceLevel == 1) {
                    if (response.keywords.includes('postulate')) {
                        return 'Sit down so we can <h>unpack</h> what you\'ve discovered so far.';
                    } else {
                        return 'What do you have for me?';
                    }

                } else if (response.clearanceLevel == 2 && !response.keywords.includes('chapter-3-finished')) {
                    return 'Good to see you.<br><br>' +
                        'You work quickly and efficiently. I\'ve been impressed with your progress so far, but it will take a good deal more before we uncover what\'s going on here. The Utopian Alliance. The Moonraker factions.<br><br>' +
                        'There seems to be no <h>shortage</h> of people who might have wanted Meg Gallak out of the picture.';
                } else if (response.clearanceLevel == 2 && response.keywords.includes('chapter-3-finished')) {
                    return 'You\'re not here to kill me, right?<br><br>' +
                    'I\'m kidding. Let\'s get to work. But if you\'re not ready to talk, make sure you\'ve reviewed the major players involved in this web of conspiracies. Always good to know who the opposition is.';
                } else if (response.clearanceLevel == 3 && !response.keywords.includes('rest')) {
                    return 'You took quite a <h>tumble</h> there. Are you alright?';
                } else if (response.clearanceLevel == 3 && response.keywords.includes('rest')) {
                    return 'That\'s the thing about <h>living</h> in space. You rarely see bodies up close and personal like this.';
                } else if (response.clearanceLevel == 4 && !response.keywords.includes('dae-arum')) {
                    return 'I\'ve been doing some research after we left the brig. It was… illuminating,” he drawls in a rueful tone.<br><br>' + 
                    'Meg discovered the UA sleeper cell before we did. I presume that\'s why they had her killed. What they\'ve accomplished-how deeply they\'ve penetrated the inner circle of our faction headquarters-is staggering. No doubt they thought <h>killing</h> anyone who knew was worth the risk to keep the scale of the operation secret.';
                } else if (response.clearanceLevel == 4 && response.keywords.includes('dae-arum')) {
                    return 'I\'ve been doing some research after we left the brig. It was… illuminating,” he drawls in a rueful tone.<br><br>' + 
                    'Meg discovered the UA sleeper cell before we did. I presume that\'s why they had her killed. What they\'ve accomplished-how deeply they\'ve penetrated the inner circle of our faction headquarters-is staggering. No doubt they thought <h>killing</h> anyone who knew was worth the risk to keep the scale of the operation secret.';
                }
            },
            noResponse: function (response) {
                let characterResponse = chooseRandomString([
                    "What? Let's stay focused.",
                    "What are you going on about now?",
                    "That's not pertinent to this investigation.",
                    "Huh? Don't you have work to do?",
                ]);

                if (response.clearanceLevel == 1) {

                    if (response.keywords.includes('compromised')) {
                        characterResponse = chooseRandomString([
                            "Review your notes before trying again.",
                            "No, you've not done your homework. Get back to it.",
                            "No, I don't think you're on the right track there.",
                            "Seems like you may need to dig deeper."
                        ]);
                    } else {
                        characterResponse = chooseRandomString([
                            "Director Armitage has me running around like mad. There are some concurrent investigations that I have to keep tabs on while you're following leads.<br><br>Is this an urgent matter?",
                            "What have you found?<br><br>Well, keep looking unless you have something substantive to share with me.",
                            "I am so tired.<br><br>I may head to the tavern soon. I could use a drink.",
                        ]);
                    }

                } else if (response.clearanceLevel == 2 && !response.keywords.includes('chapter-3-finished')) {
                    characterResponse = chooseRandomString([
                        "Hmm. What? Are you sure you're up for the task?<br><br>I vouched for you with Armitage. Don't make me regret it.",
                        "I'm not sure what you're going on about. There's more for me to find here, so if you're finished then be on your way.<br><br>It's hard enough looking into someone's life when they're alive. Less so when they're dead.",
                        "I don't know anything about that. *deep sigh*<br>Is daytime too early for a nightcap?"
                    ]);
                } else if (response.clearanceLevel == 2 && response.keywords.includes('chapter-3-finished')) {
                    characterResponse = chooseRandomString([
                        "Hmm. That's not lining up with my findings.",
                        "Sigh... I don't think so. We may need some more resources for this investigation.",
                        "I don't know anything about that. *deep sigh*<br>Is daytime too early for a nightcap?"
                    ]);
                } else if (response.clearanceLevel == 3 && !response.keywords.includes('rest')) {
                    characterResponse = chooseRandomString([
                        "How are you feeling?",
                        "You're likely dehydrated.",
                        "Can I get you anything?"
                    ]);
                } else if (response.clearanceLevel == 3 && response.keywords.includes('rest')) {
                    characterResponse = chooseRandomString([
                        "You feeling any better?",
                        "Doesn't help that we have those damn servitors orbiting the scene like beady-eyed cadavers.",
                        "If you need a break, let me know."
                    ]);
                } else if (response.clearanceLevel == 4 && !response.keywords.includes('dae-arum')) {
                    characterResponse = chooseRandomString([
                        "This isn't the ending I imagined"
                    ]);
                } else if (response.clearanceLevel == 4 && response.keywords.includes('dae-arum')) {
                    characterResponse = chooseRandomString([
                        "This is ending better than I thought it would."
                    ]);
                }

                return characterResponse;
            },
            conversationList: {
                'hello': {
                    command: ['hello', 'hi', 'yo', 'hello there'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 0,
                    responseMessage: function (response) {
                        return '... I don\'t have time for chit chat.';
                    }
                },

                // CHAPTER 1
                'dead': {
                    command: ['dead'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 0,
                    responseMessage: function (response) {
                        return 'Yes, and under suspicious circumstances, I might add. And this comes too soon after Ark Tii\'s accident for my comfort. To the point where I\'m not <h>sure</h> that was an accident anymore.';
                    }
                },
                'sure': {
                    command: ['sure'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 0,
                    responseMessage: function (response) {
                        return 'What I am sure of though is the need for this investigation to <h>proceed</h> with great caution. Whoever is behind this has not hesitated to kill anyone who gets in the way.';
                    }
                },
                'proceed': {
                    command: ['proceed'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 0,
                    responseMessage: function (response) {
                        return 'Yes, here\'s an access code.<br><br>' +
                            'Clearance Level 1 - <u>MANIFOLD</u><br><br>' +
                            'Like it or not, you\'re moving up in the moons. I need someone to <h>confide</h> in as we uncover what\'s going on at Reiner Station.<br>' +
                            'Meet me back here once you get your credentials sorted.<br>' +
                            'Now get out of here. I want to drink alone...';
                    }
                },
                // CHATPER 2
                'scope': {
                    command: ['scope', 'finneal', 'finneal lee'],
                    requiredKeywords: ['unmask'],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Finneal Lee hasn\'t visited the station recently. So this Komek lead is dead in the water for right now.<br><br>' +
                            'But I think Meg knew a lot more than any of us gave her credit for. Go back to her room and leave no stone unturned.<br><br>' +
                            'And retread your steps so far. I\'m sure you\'ll find some more details that will help us piece together the puzzles.';
                    }
                },
                'investigation': {
                    command: ['investigation', 'investigate'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 1) {
                            return 'We\'re making progress, but I worry that it\'s too slow.<br><br>' +
                                'We need to uncover the culprits as soon as possible to ensure the safety of Project Lattice and the station personnel.';
                        } else if (response.clearanceLevel == 2) {
                            return "I'm sure you'll find much of interest beyond this station. There's a world out there full of conspiracy and back-alley deals.<br><br>" +
                                "Just don't end up on the wrong side of any of them.";
                        } else if (response.clearanceLevel == 3 && !response.keywords.includes('rest')) {
                            return "We'll get back to that shortly.";
                        } else if (response.clearanceLevel >= 3) {
                            return "We'll get back to that shortly.";
                        } 

                    }
                },
                'henko': {
                    command: ['henko'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 1) {
                            return 'There\'s a lot more going on beyond Reiner Station. You\'ll see soon enough.';
                        } else if (response.clearanceLevel >= 2 && !response.keywords.includes('chapter-3-finished')) {
                            return 'Armitage is getting antsy. Project Lattice needs to proceed without concern that it\'s compromised, but we haven\'t given him enough confidence yet.'
                        } else if (response.clearanceLevel == 2 && response.keywords.includes('chapter-3-finished')) {
                            return 'Linus Farno\'s days are numbered.<br><br>' + 'How did he refer to Meg?';
                        } else if (response.clearanceLevel == 3 && !response.keywords.includes('rest')) {
                            return "There's a lot of confusion right now. Rightly so.";
                        } else if (response.clearanceLevel >= 3) {
                            return "There's a lot of confusion right now. Rightly so.";
                        } 
                    }
                },
                'meg-gallak': {
                    command: ['meg', 'meg gallack', 'mg', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 1) {
                            return 'Mysterious. Even more than Ark Tii was<br><br>' +
                                'One day I\'m going to march straight into their minefield and detonate it just to spite them.';
                        } else if (response.clearanceLevel == 2) {
                            return 'The more I investigate Meg the more I seem to lose sight of who she was. Or maybe that\'s how she felt and I\'m merely witnessing that unfold.';
                        } else if (response.clearanceLevel >= 3 && !response.keywords.includes('rest')) {
                            return "We can discuss Meg later.";
                        } else if (response.clearanceLevel >= 3) {
                            return "We can discuss Meg later.";
                        } 

                    }
                },
                'unpack': {
                    command: ['unpack'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'I\'ve been tracking down leads myself while running several cases for Armitage. I want to see where we align to get a sense of your progress.<br><br>' +
                            'Who drank brandy with Meg in her room?';
                    }
                },
                'ryan-rogal': {
                    command: ['ryan rogal', 'ryan', 'rogal'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Good, that\'s what I gathered as well from arrival records on the station and intel reports on Rogal.<br><br>' +
                            'On which of the five Moonrakers factions is Finneal Lee informing on?';
                    }
                },
                'komek': {
                    command: ['komek'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {

                        if (response.clearanceLevel <= 1) {
                            return 'Yes, and we need to meet with him quick-like. Whatever he has rattling around in his head could give us insight as to what Meg was involved with.<br><br>' +
                            'Who do we need to find to cajole Kinta Lar into talking?';
                        } else if (response.clearanceLevel >= 2) {
                            return 'I\'m at a loss for words that the Moonraker factions are split enough to cause an incident like that.<br><br>' +
                            'Who was in charge of the Komek ship?';
                        }
                            
                    }
                },
                'oleg-ali': {
                    command: ['oleg ali', 'oleg', 'ali'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'I\'m not going to lie. That will be a tense encounter, but it\'s crucial for us to loosen the mouths of these Ventus types.<br><br>' +
                            'Which organization do you think Linus Farno sent those schematics to?';
                    }
                },
                'utopian-alliance': {
                    command: ['ua', 'utopian alliance'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Your guess is as good as mine right now. I don\'t want to speculate. I want hard evidence so that I can dismantle his entire scheme in one fell swoop.<br><br>' +
                            'Do you think Project Lattice is safe or compromised?';
                    }
                },
                'compromised': {
                    command: ['compromised'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Unfortunately I agree. And your confirmation of my fears must propel me into action, I believe.<br><br>' +
                            'It\'s time to expand this investigation beyond Reiner Station. Our adversaries are operating outside of my reach, so you will be my right-hand and foray out into the inky black.<br><br>' +
                            'Clearance Level 2 - <u>SENTRY</u><br><br>' +
                            'You\'re welcome to look back over the investigation to date, but be ready to depart soon.<br><br>' +
                            'We\'ve got work to do.';
                    }
                },
                // CHAPTER 3
                'shortage': {
                    command: ['shortage'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'What we have right now is an information deficit.<br><br>' +
                            'You\'ve done some initial sleuthing. We\'ve loosened some tongues. A picture is starting to emerge but it\'s still hazy. I need you to learn whatever you can here at the station while also starting to explore the immediate <h>space</h> beyond us.';
                    }
                },
                'space': {
                    command: ['space'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Yes, you can use the MIU-issue Henko ship in the hangar.<br><br>' +
                            'Here\'s what I need from you:<br>' +
                            'a) Determine the nature of the relationship between Meg Gallak and Ryan Rogal;<br>' +
                            'b) Search for evidence that ties Linus Farno to the Utopian Alliance;<br>' +
                            'c) Locate Oleg Ali so that we can coerce Kinta Lar into cooperating;<br>' +
                            'd) Evaluate the connection between Komek energy dealings and UA aggression; and<br>' +
                            'e) If possible, look for <h>ship</h> upgrades along the way. I have a feeling you\'ll need them before our investigation is complete.<br><br>' +
                            'And don\'t forget to check the database for some summary documents. That should refresh you on what we\'ve learned so far while you\'re in and out of Reiner Station.'
                    }
                },
                'ship': {
                    command: ['ship'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'That\'s right—your very own ship. Well, it\'s not yours. It\'s the property of the MIU, but you get the idea. We\'ve granted you hangar access and pilot credentials for now.<br><br>' +
                            'So get out there. Oh, and… bring it back in piece.';
                    }
                },
                'swivel': {
                    command: ['swivel'],
                    requiredKeywords: ['chapter-3-finished'],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Yep, head on a swivel more than anything else.<br><br>' +
                        'Who do you want to talk about first? <h>Magnomi</h>, <h>Ventus</h>,<h>Komek</h>, or our very own <h>Henko</h>? Sorelia is a whole other problem that I don\'t even want to worry about right now.<br><br>' +
                        'Once we\'re done, give Armitage the <h>code</h> and he\'ll know you\'re ready for what comes next.';
                    }
                },
                'invasive-linus': {
                    command: ['public enemy', 'enemy', 'invasive species', 'invasive'],
                    requiredKeywords: ['chapter-3-finished'],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'He may very well have signed off on her death, whether he realizes it or not.<br><br>' +
                        'Who helped you hide the tracking beacon?';
                    }
                },
                'nella-linus': {
                    command: ['nella', 'nella van daval'],
                    requiredKeywords: ['chapter-3-finished'],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Good, we\'ll know more soon then.<br><br>' +
                        'Well done.<br><br>' +
                        'Henko=1';
                    }
                },
                'magnomi-ryan': {
                    command: ['magnomi'],
                    requiredKeywords: ['chapter-3-finished'],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Ryan Rogal may be the provocateur, but who\'s calling the shots?';
                    }
                },
                'kary-powalk': {
                    command: ['kary', 'kary powalk'],
                    requiredKeywords: ['chapter-3-finished'],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'I agree. They\'re being more clandestine than I normally give them credit for. Which means things are worse than expected.<br><br>' +
                       'What did the Magnomi stow on the derelict ship?';
                    }
                },
                'missiles-magnomi': {
                    command: ['missiles', 'missile'],
                    requiredKeywords: ['chapter-3-finished'],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Nothing good will come out of that.<br><br>' +
                        'We\'re on the same page then.<br><br>' +
                        'Magnomi=2';
                    }
                },
                'ventus-oleg': {
                    command: ['ventus'],
                    requiredKeywords: ['chapter-3-finished'],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Oleg Ali seems very dangerous, especially because he pretends to be otherwise.<br><br>' +
                        'Who has Ventus made a deal with?';
                    }
                },
                'sorelia-partnership': {
                    command: ['sorelia'],
                    requiredKeywords: ['chapter-3-finished'],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'It\'s an interesting partnership, to say the least.<br><br>' +
                        'It makes me want to investigate Sorelia even more than I already do.<br><br>' +
                        'What was Oleg Ali extracting from the old Ventus probe?';
                    }
                },
                'hard-drives': {
                    command: ['hard drives', 'hard drive', 'harddrives', 'harddrive'],
                    requiredKeywords: ['chapter-3-finished'],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Also be wary of someone who values information and prioritizes it more than their peers. That person seeks leverage.<br><br>' +
                        'We\'re aligned on this.<br><br>' +
                        'Ventus=4';
                    }
                },
                'lila-komek': {
                    command: ['lila', 'lila al bindar'],
                    requiredKeywords: ['chapter-3-finished'],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'And it seems like she was willing to sacrifice her crew and the Henko ship to maintain the deception.<br><br>' +
                        'What type of tech upgrade were they hiding?';
                    }
                },
                'reactor-lila': {
                    command: ['reactor'],
                    requiredKeywords: ['chapter-3-finished'],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Yes, but I\'m more concerned about who the intended recipient was. Who the attacker was.<br><br>' +
                        'I agree with your findings, though.<br><br>' +
                        'Komek=3';
                    }
                },
                // CHAPTER 4
                'tumble': {
                    command: ['tumble'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Yeah, you started breathing heavily, cradled your head in your hands, and then fell out of your chair.<br><br>' +
                        'The <h>director</h> didn\'t know what to do.';
                    }
                },
                'director': {
                    command: ['director'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Don\'t worry about Armitage right now.<br><br>' +
                        'This kind of revelation will make even the most veteran investigators start to question everything, but you have to be careful to not <h>alienate</h> your allies in the process.<br><br>' +
                        'I vouched for you while you were... indisposed. You\'ve been indispensable throughout this investigation, and you weren\'t privy to any of our confidential findings at the times in which they mattered.';
                    }
                },
                'alienate': {
                    command: ['alienate'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'You aren\'t the type. I\'d bet my life on it.<br><br>' +
                        'To be fair, I might have said the same thing about <h>Lynna</h> just a day ago. Between you and me--and this is petty, I know--but I think whatever conspiracy or clandestine group she was a part of contributed to her spotless record. It makes sense that she\'d use insider information to ingratiate herself to the MIU.<br><br>' +
                        'Close enough cases with stellar investigative procedure to be presumed unimpeachable.<br><br>' +
                        'Clever.';
                    }
                },
                'lynna': {
                    command: ['lynna'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Apologies. Here I am rambling, and you\'re barely recovered.<br><br>' +
                        'Take as long as you need to <h>rest</h>, then meet me in the brig. I want to inspect Lynna\'s remains for myself. And a second set of eyes is always welcome.<br><br>' +
                        'See you there.';
                    }
                },
                'rest': {
                    command: ['rest'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Yes, please rest. I\'ll leave you to it.';
                    }
                },
                'living': {
                    command: ['living'],
                    requiredKeywords: ['rest'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'I\'ve inspected the <h>body</h> on my own, but I admit that this isn\'t my forte.<br><br>' +
                        'If you haven\'t noticed while running around the station and flying off into the void, I like others to do my legwork.<br><br>' +
                        'I\'m not overly fond of people. Dead ones, even less so.';
                    }
                },
                'body': {
                    command: ['body'],
                    requiredKeywords: ['rest'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'I want a fresh set of eyes on this.<br><br>' +
                        'No, seriously, take your time.<br><br>' +
                        'See what you can <h>deduce</h>.';
                    }
                },
                'deduce': {
                    command: ['deduce'],
                    requiredKeywords: ['rest'],
                    minimumClearanceLevel: 3,
                    eventMoment: true,
                    responseMessage: function (response) {
                        return 'Lynna\'s auburn hair pools beneath her like a bloodstain. Her eyes--normally piercing and dark--are vacant as they stare up at the ceiling lights.<br><br>' +
                        'Instinctively, you gently pry open her mouth. With a penlight, you notice a cracked molar and what appears to be slight electrical burns on her gums.<br><br>' +
                        'Patting down her clothes, you discover nothing of note until you reach her laced boots. A thin lines of rubber serrations separates part of the back heel. Pulling on this section, you pull out a hollow tongue of sole concealing a datastick.<br><br>' +
                        'As you hand that over to Bill, one final detail catches your eye. On Lynna\'s exposed forearm, there is a small scar. It\'s an old scar. Without waiting for permission, you flick open a folding knife.<br><br>' +
                        'You cut deeply and quickly. Before Bill can protest, you pull out a subdermal implant, likely years old, that emits a soft, pulsating red light. Aghast, Bill steps forward and retrieves the implant.<br><br>' +
                        'With a datastick in one hand and bloody mystery tech in the other, he looks at you <h>appraisingly</h>.';
                    }
                },
                'appraisingly': {
                    command: ['appraisingly'],
                    requiredKeywords: ['rest'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'That was damn fine detective work. I dare say you\'ve got a knack for the macabre.<br><br>' +
                        'Give me some time to share these findings with Armitage and identify what we\'re dealing with.<br><br>' +
                        'In the meantime, catch back up on our investigation. Lynna may have disrupted things, but we still need to find out who killed Meg Gallak and why.<br><br>' +
                        'I\'ve compiled some summary documents for you. And chat with station personnel. We need to reassess where we\'re at';
                    }
                },
                // FINAL CHAPTER
                'killing': {
                    command: ['killing'],
                    requiredKeywords: ['killing'],
                    minimumClearanceLevel: 4,
                    eventMoment: true,
                    responseMessage: function (response) {
                        return 'He shifts in his seat. A quick grimace as he stretches his back.<br><br>' +
                        '“I don\'t know how Meg knew, but the messages I\'ve been able to decrypt from Lynna\'s datastick verify that she knew and that the UA knew she knew. If you follow me.”<br><br>' +
                        'You sit next to him and listen while he continues his debrief.<br><br>' +
                        '“I found out other things, too…”<br><br>' +
                        'He turns to you then, but you\'ve already raised your weapon to <h>fire</h>.<br><br>';
                    }
                },
                'fire': {
                    command: ['fire'],
                    requiredKeywords: ['fire'],
                    minimumClearanceLevel: 4,
                    eventMoment: true,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('kill-bill')){
                            response.keywords.push('kill-bill');
                        }
                        return '“It\'s a real statement having one of those out in space,” Bill states dryly. “I guess you needed something more final after poisoning my drink didn\'t work.”<br><br>' +
                        'You shake your head numbly.<br><br>' +
                        'Bill raises an eyebrow. “Oh no? Must have been Lynna then, before she—”<br><br>' +
                        'Whatever he was going to say is cut short as you pull the <h>trigger</h>, and he slumps over the bar like a broken puppet.<br><br>';
                    }
                },
                'no': {
                    command: ['no'],
                    requiredKeywords: ['dae-arum'],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Well this is a <h>relief</h>...';
                    }
                },
                'relief': {
                    command: ['relief'],
                    requiredKeywords: ['dae-arum'],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Listen, I saw this going one way and one way only--you killing me (confirming everything I\'d discovered from Lynna\'s personal effects) and then Armitage wrapping up the investigation after cauterizing this gaping wound of a catastrophe.<br><br>' +
                        'Needless to say I\'m surprised that I\'m alive. And I\'m grateful that you might get out of this with an active <h>heart</h>beat as well.';
                    }
                },
                'heart': {
                    command: ['heart'],
                    requiredKeywords: ['dae-arum'],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'We\'ve still got a lot of rebuilding to do. And restoring our faith in you.<br><br>' +
                        'The UA killed Meg because she discovered their breach of Project Lattice. You\'re going to right that wrong. Lynna didn\'t introduce any spyware into the system. But you did...<br><br>' +
                        'Undoing that is crucial in regaining the <h>upper hand</h> over the UA.';
                    }
                },
                'upper-hand': {
                    command: ['upper hand'],
                    requiredKeywords: ['dae-arum'],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'That\'s step one.<br><br>' +
                        'Step two is handing over your subdermal implant and any other UA tech. We\'ve got some reverse engineering ahead of us.<br><br>' +
                        'The UA might think they subverted the Moonraker factions with their espionage program, but we\'re going to exact the same punishment on them <h>tenfold</h>.';
                    }
                },
                'tenfold': {
                    command: ['tenfold'],
                    requiredKeywords: ['dae-arum'],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'The third step will be to ally the Moonraker factions.<br><br>' +
                        'You\'ve made inroads with many of them. Even if it was in the spirit of investigating Meg\'s death.<br><br>' +
                        'We must work together. Henko, Sorelia, Magnomi, Ventus, and Komek. <h>Together</h> we stand a chance.';
                    }
                },
                'together': {
                    command: ['together'],
                    requiredKeywords: ['dae-arum'],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Yes, you\'ll be instrumental in the work that lies ahead. But your role will be changing.<br><br>' +
                        'For obvious reasons, you\'re fired from the MIU. Sorry, but you likely saw that coming.<br><br>' +
                        'Think of it as linear move, rather than a demotion. You\'ll be representing us as the <h>Henko ambassador</h>.';
                    }
                },
                'henko-ambassador': {
                    command: ['henko ambassador'],
                    requiredKeywords: ['dae-arum'],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Funny how life works sometimes, right?<br><br>' +
                        'It\'s also funny how quickly things are able to change from dire to hopeful. I\'ve had some help there, though. Moro Mada sent us an encrypted message and said she\'d be watching you. Something about "taking back a gift" if you felt an itch for the old life.<br><br>' +
                        'There\'s one last <h>wrinkle</h> to iron out, too.';
                    }
                },
                'wrinkle': {
                    command: ['wrinkle'],
                    requiredKeywords: ['dae-arum'],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('bill-final')){
                            response.keywords.push('bill-final');
                        }
                        return 'Oh, I can\'t tell you yet. I\'ve got to upgrade your clearance first.<br><br>' +
                        'It\'s something we\'ve kept from you since the beginning. Something about Meg. We had to. Otherwise it all would have fallen apart.<br><br>' +
                       'But you\'ll need to know if we\'re going to have the best chance of fixing all of this.<br><br>' +
                        'Clearance Level 5 - <u>BRINK</u><br><br>' +
                        'Let\'s get moving, ambassador. There\'s no time to waste and a lotta work ahead of us.';
                    }
                },
            }


        },
        'ryle-al-wren': {
            requiredKeywords: [],
            minimumClearanceLevel: 1,
            getStation: function (response) {
                return 'reiner-station';
            },
            getRoom: function (response) {
                if (response.clearanceLevel <= 2) {
                    return 'administrative-offices';
                }
            },
            entryCommandMessage: function (response) {
                return '<hr>You approach Ryle.';
            },
            entryDisplayMessage: function (response) {
                if (response.clearanceLevel <= 1) {
                    return 'Ryle al Wren, at your service.<br><br>' +
                    'I\'m the master of the logs and the keenest mind in confiscation.<br><br>' +
                    'What do you need?';
                } else if (response.clearanceLevel == 2) {
                    return 'You look like you need some answers.'
                } else if (response.clearanceLevel == 3) {
                    return 'Can I tell you something?' +
                    'I did a little more digging after you asked about those missiles. Most people don\'t think much of supply data, but I live for it. And it tells so much more about politics and what\'s going on in the world out there.' +
                    'Like... where more of those missiles might be. Yeah, I scoured through shipping manifests from other stations (we cargo kings stick together), and it looks like a substantial number of missiles have been requisitioned in recent months. All heading for the lower reaches of Magnomi space' +
                    'You didn\'t hear it from me, okay?';
                } else if (response.clearanceLevel >= 4) {
                    return 'Armitage wants me to thoroughly inspect everything that\'s arrived on Reiner Station in the last few weeks.<br><br>' +
                    'I\'m not sure what he\'s hunting for but it\'s got me nervous.';
                }
            },
            noResponse: function (response) {
                let characterResponse = chooseRandomString([
                    'You wanna see something crazy? Someone brought aboard an entire box full of foam packing pieces. And nothing else.<br><br>What maniac wastes cargo space like that?',
                    'Is this your first investigation? You look a little green behind the ears.<br><br>No offense.',
                    'First rule of supply management: Write everything down.<br><br>Second rule of supply management: Don\'t forget the first rule.'
                ]);

                if (response.clearanceLevel == 2) {
                    let characterResponse = chooseRandomString([
                        'I\'ve seen more hangar rats this week than I care to count. It\'s like they\'re breeding in the walls.',
                        'If you leave Reiner Station, will you bring me back some rocks. I like rocks...',
                        'First rule of supply management: Write everything down.<br><br>Second rule of supply management: Don\'t forget the first rule.'
                    ]);
                } else if (response.clearanceLevel == 3) {
                    let characterResponse = chooseRandomString([
                        'The hangar rats are no more! I\'ve trapped them into one big crate. Now I just need to decide what unfortunate moon I\'ll sequester them on.',
                        'Did you bring back any rocks for me?',
                        'First rule of supply management: Write everything down.<br><br>Second rule of supply management: Don\'t forget the first rule.'
                    ]);
                } else if (response.clearanceLevel >= 4) {
                    let characterResponse = chooseRandomString([
                        'Too much cargo, too little time.',
                        'Take care of yourself. Things are on edge right now. I just don\'t know why.',
                        'First rule of supply management: Write everything down.<br><br>Second rule of supply management: Don\'t forget the first rule.'
                    ]);
                }
                return characterResponse;
            },
            conversationList: {
                'hello': {
                    command: ['hello', 'hi', 'yo', 'hello there'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return '... hello';
                    }
                },
                'meg': {
                    command: ['meg', 'meg gallack', 'gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'She was always exciting. Exotic shipments more often than not. I\'m going to miss seing what crazy things she brought through my office.<br><br>' +
                            'Everyone else was so... ordinary.';
                    }
                },
                'henko': {
                    command: ['henko'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Some days it does feel like we\'re the only ones trying to help out the others.<br><br>' +
                            'Magnomi is all shoot \'em up, shoot \'em up, pow pow.<br><br>' +
                            'Komek is like an energetic bunny hopping all over everyone else\'s toes.<br><br>' +
                            'Ventus is the emotional teenager who just wants to go home and doesn\'t want to talk to their siblings.<br><br>' +
                            'And Sorelia is... weird.';
                    }
                },
                'cargo': {
                    command: ['cargo'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel == 4) {
                            return 'I\'m still the master of cargo, but I am locked out of my office at the moment.<br><br>' +
                            'I didn\'t lock myself out, to be clear. I\'m not that clumsy.';
                        } else {
                            return 'I am the master of cargo. No one is my equal.<br><br>' +
                            '... It sounds cool when I say it in front of the mirror.';
                        }   
                    }
                },
                'transport': {
                    command: ['transport', 'sartoc'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'I confess, I almost confiscated that bottle of brandy. Just so I could drink it. It\'s not often you see something of that quality.<br><br>' +
                            'Alas, I let it slip through my hands.<br><br>' +
                            'Probably a good thing though. Not sure I would have had hands for long if I took it. The manifest shows it arrived with Ryan Rogal. He\'s a Magnomi. One of the <h>extreme</h> ones, too...<br><br>' +
                            'And it must have stayed behind, too, because Ryan left a few days ago.';
                    }
                },
                'extreme': {
                    command: ['extreme'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'That\'s all I\'ll say about that. I don\'t make it habit of discussing just aggressive creatures. Perhaps take this inquiry elsewhere';
                    }
                },
                'ship': {
                    command: ['ship'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 2) {
                            return 'You\'ve got your own ship now!<br><br>'+
                            'Which means I\'ll be your nemesis. Everything you bring back is subject to my scrutiny! Muahahahaha.<br><br>' +
                            'In all reality, though, I do need to check what you bring back to the station.';
                        } else if (response.clearanceLevel == 4) {
                            return 'I\'m still the master of cargo, but I am locked out of my office at the moment.<br><br>' +
                            'I didn\'t lock myself out, to be clear. I\'m not that clumsy.'
                        } else {
                            return 'Brought back anything interesting?<br><br>' +
                            'Come on, let me live vicariously through you. What\'s the coolest thing you\'ve scavenged?';
                        }   
                    }
                },
                'yacht': {
                    command: ['yacht'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        
                        if (response.clearanceLevel <= 2) {
                            return 'Gross, don\'t remind me about that transgression against humanity.<br><br>' +
                            'All that has brought back is communicable diseases.';
                        } else {
                            return 'Hopefully we\'ll never see that monstrosity again.<br><br>' +
                            'Oh, the yacht, too.';
                        }   
                    }
                },
                'cargo': {
                    command: ['cargo'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'I am still the master of cargo. This is my domain.';
                    }
                },
                'missiles': {
                    command: ['missiles', 'missile'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Weird! There\'s something weird about this thing.<br><br>' +
                        'Yep, right there. It\'s subtle but the barcodes <h>etched</h> into the metal here. We didn\'t start adding those until 20 or 30 years ago.<br><br>' +
                        'Which means... that these missiles are substantially newer than the ship they\'re stowed on?'
                    }
                },
                'etched': {
                    command: ['etched'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return '100%. I would bet my cargo records on it, and that\'s not something I\'d do lightly.<br><br>' +
                        'I don\'t know anything else about that <h>ghost ship</h> you found, but someone hid lots of explosives on there for some reason.<br><br>' +
                        'And it doesn\'t seem like a good reason.'
                    }
                },
            }

        },
        'linus-farno': {
            requiredKeywords: [],
            minimumClearanceLevel: 1,
            getStation: function (response) {
                return 'reiner-station';
            },
            getRoom: function (response) {
                if (response.clearanceLevel <= 1) {
                    return 'administrative-offices';
                } else if (response.clearanceLevel == 2) {
                    return 'hangar';
                } else if (response.clearanceLevel >= 3 && response.keywords.includes('bye-linus') == false) {
                    return 'hidden-base';
                }
            },
            entryCommandMessage: function (response) {
                return '<hr>You approach Linus.';
            },
            entryDisplayMessage: function (response) {
                if (response.clearanceLevel <= 1) {
                    return 'Oh, you\'re still in the room. I thought you were in the process of leaving me alone.<br><br>' +
                        'Talk quickly or be on your way. Preferably the latter.<br><br>' +
                        'The bartender is better suited for gossip than me. He\'s always plying people with drinks and commentary on the station personnel.';
                } else if (response.clearanceLevel == 2 && !response.keywords.includes('encrypted messages')) {
                    return 'How do you like my ship?<br><br>' +
                        'Don\'t be deceived by the stylish affectations and the premium furnishing. It will outclass anything here. Top-notch engines and shielding to boot.<br><br>' +
                        'It\'s good for those last-minute getaways when I want to be anywhere but here.'
                } else if (response.clearanceLevel == 2 && response.keywords.includes('encrypted messages')) {
                    return 'I\'ve thought about hiring a bodyguard just to have nuisances like you founder on the rocks of their physique.'
                } else if (response.clearanceLevel >= 3) {
                    return 'Agh! It\'s one thing to be pursued in space by a specter of MIU obstinacy. It\'s unconscionable though to be woken from the restorative benefits of a nap.<br><br>' +
                    'How did you find me? Better yet, why did you find me?<br><br>' +
                    'You of all people should have left me <h>alone</h>.'
                }

            },
            noResponse: function (response) {
                let characterResponse = '';

                if (response.clearanceLevel <= 1) {
                    characterResponse = chooseRandomString([
                        'I don\'t have the time for you right now. I have a meeting to prepare for.',
                        'You shouldn\'t be here. These offices are for management personnel only.',
                        'Waste someone else\'s time. You\'re beneath me.'
                    ]);
                } else if (response.clearanceLevel == 2) {
                    characterResponse = chooseRandomString([
                        'Unless you want to help my assistant buff the outer panels of the yacht, I\'d ask you to step aside.',
                        "Don't stand behind the engines. They'll incinerate you once we run our pre-flight checks.<br><br>On second thought, you're welcome to stand behind the engines if you want.",
                        'Like what you see? This is what hard work buys.'
                    ]);
                } else if (response.clearanceLevel >= 3) {
                    characterResponse = chooseRandomString([
                        'Didn\'t end well for her, did it?',
                        "Oh can we please let it go?!<br><br>Meg this. Meg that. Move on already.",
                        'I have no desire to see Armitage ever again.'
                    ]);
                }
                return characterResponse;
            },
            conversationList: {
                'hello': {
                    command: ['hello', 'hi', 'yo', 'hello there'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Hello there.';
                    }
                },
                'council': {
                    command: ['council'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Yes, I am a council representative. And I perform my duties beyond reproach.<br><br>' +
                            'But council matters are above your clearance level, and to be honest I\'m not sure you\'d grasp the complexity and scope of what we manage.';
                    }
                },
                'henko': {
                    command: ['henko'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'We are the only faction protecting Moonrakers from the void of space and from the grip of the UA.<br><br>' +
                            'It\'s time the rest of them realized that.';
                    }
                },
                'armitage': {
                    command: ['armitage'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'One of these days that buffoon will be supplanted by someone with some actual know-how.<br><br>' +
                            'I would consider the opportunity, but I\'m not sure Reiner Station could afford me.';
                    }
                },

                'accusation': {
                    command: ['accusation', 'accuse'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Excuse me? How could you possibly think that A) You are of the proper station to even address me or B) That I would suffer such an egregious affront to my character without the smallest iota of proof nor the merest hint of motive.<br><br>' +
                            'Get of my sight or I\'ll march you <h>straight</h> to Armitage and have you ousted from the MIU and quite possibly ejected from an airlock.';
                    }
                },
                // CHAPTER 3
                'yacht': {
                    command: ['yacht'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'What do you mean, "Is this mine?"<br><br>' +
                            'Of course it\'s mine. Besides being a council representative, I\'m also a shrewd investor and businessman.<br><br>' +
                            "Other Henko officials might obsess over Moonraker sovereignty and safety, but I like to split my focus and make sure that I'm well taken care of. You should try it sometime.<br><br>" +
                            'Self-care is good for the soul.<br><br>' +
                            'On that note, hurry along. You\'re not good for my blood pressure.'
                    }
                },
                'ship': {
                    command: ['ship'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Well, that\'s a little hyperbolic, don\'t you think? Calling that tin can of yours a ship?<br><br>' +
                            'To each their own, but I\'d rather fly in something that doesn\'t list lazily to the left without your hands on the controls at all times.'
                    }
                },
                'meg': {
                    command: ['meg', 'meg gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'I hear she liked the hangar.<br><br>' +
                            'Maybe she had more in common with the boorish mechanics here than more refined individuals.'
                    }
                },
                'investigation': {
                    command: ['investigation'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Good luck with your sleuthing.<br><br>' +
                            'I wouldn\'t want to be you, but blessedly I\'ll never have to suffer through that.'
                    },

                },
                'spy-probe': {
                    command: ['spy probe'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'What?!<br>' +
                       'What did you say? Who do you think you are?!<br>I\'ll have you strung up--<br>' +
                        'Where are you going?<br>' +
                        'Come back you, you insolent--'
                    },

                },
                // CHAPTER 4
                'alone': {
                    command: ['alone'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Oh, I won\'t be alone for long. Arrangements are being made.<br><br>' +
                        'My <h>services</h> are being rewarded, as they should be.'
                    },

                },
                'services': {
                    command: ['services'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Don\'t be coy. It\'s not befitting our relationship. I\'m sure you\'ll be rewarded for your efforts, too.<br><br>' +
                        'How are those <h>headaches</h>?'
                    },

                },
                'headaches': {
                    command: ['headaches'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Of course, I know about your headaches. You act like you can hide debilitating migraines and fainting episodes.<br><br>' +
                        'You may have a <h>low opinion</h> of me, but my power of observations are not so stunted that I would miss someone convulsing in pain and passing out.<br><br>' +
                        'Did you ever devise some medical excuse or do you think people respond better empathetically to the spontaneity?'
                    },

                },
                'low-opinion': {
                    command: ['low opinion'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Spare me the speech. It\'s just the two of us.<br><br>' +
                        'I don\'t have the stomach for anymore anti-UA propaganda. There was enough of that on Reiner Station, and that\'s just Henko. Imagine being stationed on Leppik or Kaos and all of the drivel you\'d have to swallow.<br><br>' +
                        'I\'m thankful I don\'t have to hear it any longer, so don\'t ruin that for me.<br><br>' +
                        'They\'re just one more player in the game, and you have to admit that they\'ve played it well. Think of all you\'ve personally witnessed. You can\'t argue they\'re playing a damn <h>good game</h>.'
                    },

                },
                'good-game': {
                    command: ['good game'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('bye-linus')){
                            response.keywords.push('bye-linus');
                        }
                        if (!response.keywords.includes('good-game')){
                            response.keywords.push('good-game');
                        }
                        return 'It\'s all just a game.<br><br>' +
                        'As Linus continues to talk, you start to get light-headed.<br><br>Linus holds up a small frequency emitter and wiggles it in front of you as your vision wavers.<br><br>' +
                        '"It\'s all just a game. I play my part. You play your part. Even Meg did, though it might have been short-lived."<br><br>' +
                        'Linus kicks over the cot as you lean precariously. He lowers you onto the soft material.<br><br>' +
                        '"So why don\'t we have a soft reset. Let\'s get back to our positions, take a breather, and you leave me alone as you should."<br><br>' +
                        'In your haze, you hear <h>ship engines</h> roar to life, but it\'s all just white noise in the end.';
                    },
                    eventMoment: true,
                },
                /*
                'ship-engines': {
                    command: ['ship engines'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'When you come to, Linus is gone.<br><br>' +
                        'It doesn\'t take you long to realize that\'s because you\'re back on your ship.<br><br>' +
                        'And you\'re <h>back</h> at Reiner Station...';
                    },
                    eventMoment: true,
                },
                */
            }
        },
        'kinta-lar': {
            requiredKeywords: [],
            minimumClearanceLevel: 1,
            getStation: function (response) {
                return 'reiner-station';
            },
            getRoom: function (response) {
                if (response.keywords.includes('bye-kinta')) {
                    return '';
                } else {
                    return 'tavern';
                }
            },
            entryCommandMessage: function (response) {
                return '<hr>You approach Kinta.';
            },
            entryDisplayMessage: function (response) {

                if (response.clearanceLevel <= 1) {
                    return 'What?';
                } else if (response.clearanceLevel == 2) {
                    return 'Can I help you?<br><br>' + 'That\'s rhetorical, by the way...';
                } else if (response.clearanceLevel >= 3 && !response.keywords.includes('beetle')){
                    return 'Look, if I could have located the Sorelian tech on my own, I wouldn\'t still be here.<br><br>' +
                    'I had hoped that sticking around might give me a clue as to where Meg stashed it, and while that didn\'t happen, it did bring you into my orbit.<br><br>' +
                    'So do you have good news or is there someone else you wanted to talk about?';
                } else if (response.clearanceLevel >= 3 && response.keywords.includes('beetle')){
                    return 'What have you <h>got</h> for me?';
                }
            },
            noResponse: function (response) {
                let characterResponse = chooseRandomString([
                    'Not interested.',
                    'Don\'t know you and don\'t want to.',
                    'Can you please bother someone else?'
                ]);

                if (response.clearanceLevel == 2 ) {
                    characterResponse = chooseRandomString([
                        'Huh? You\'re slowing down my BAC uptake.',
                        'You don\'t read faces very well, do you?<br><br>This one reads, "Go away."',
                        'Not interested.'
                    ])
                } else if (response.clearanceLevel >= 3) {
                    characterResponse = chooseRandomString([
                        'Remember, you\'ve got a shipment to track down. And I\'ve got drinks to... drink.',
                        'You\'re slowing down my BAC uptake.',
                        'We may not be adversaries, but I wouldn\'t call us friends. You find that shipment, though, and I\'ll reconsider.'
                    ])
                }
                return characterResponse;
            },
            conversationList: {
                'hello': {
                    command: ['hello', 'hi', 'yo', 'hello there'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return '...';
                    }
                },
                'shipment': {
                    command: ['shipment'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 1) {
                            return 'I don\'t know what shipment you\'re talking about, and I\'m not here to trade niceties with a stranger.<br><br>' +
                            'Whatever information you want, it\'s not here.<br><br>' +
                            'Not even the shadow of <h>Oleg Ali</h> will entice me to keep chatting. Move along.';
                        } else if (response.clearanceLevel >= 2) {
                            return 'Here\'s the simplest way to describe this. Sorelia and Ventus had a deal that they would provide us with advanced tech (we didn\'t ask where it came from) to help augment our engine research and development.<br><br>' +
                            'Those shipments have been <h>pivotal</h> in establishing the latest line of probes for far-range discovery and consistent unmanned flight.';
                        }
                    }
                },
                'pilot': {
                    command: ['pilot'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <=1) {
                            return 'So that\'s what you\'ve heard about me, huh? Can\'t say I\'m impressed. You could have gleaned that from the tin can over there in less than a minute.<br><br>' +
                            'Let\'s find something worthwhile to talk about if you\'re going to crowd my space.';
                        } else if (response.clearanceLevel >=2) {
                            return 'Haven\'t you heard enough of this by now? I\'m not the one to wax on and on about my exploits. If you want a story, talk to the bartender. Or a drunk.<br><br>' +
                            'They\'ll always be more open to idle chitchat than I am.';
                        }
                    }
                },
                'ventus': {
                    command: ['ventus'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 1) {
                            return 'Yeah, I\'m certainly far from home. But, then again, aren\'t we all?<br><br>' +
                            'The reason I\'m here is to make every effort to help my people. Probes don\'t build themselves. Ships don\'t fly themselves... well, they do, but you get my point.';
                        } else if (response.clearanceLevel == 2) {
                            return 'A probe a day makes home not so far away. That\'s the saying at least.<br><br>'+
                            'We\'ve sent out so many probes, though, that home should be slapping us in the face by now.';
                        } else if (response.clearanceLevel >= 3) {
                            return 'Those long-range probes are the best chance any of us have to crawl out from under the thumb of the UA.<br><br>' +
                            'That\'s worth it, in my book.';
                        }
                        
                    }
                },
                'oleg-ali': {
                    command: ['oleg', 'oleg ali', 'ali'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 1) {
                            return 'Nope, not talking about him. That\'s above your pay grade and well beyond my desire to keep my head firmly attached to my neck.';
                        } else if (response.clearanceLevel == 2) {
                            return 'Some topics are better left alone. Unlike my drink.<br><br>So if you\'ll excuse me.';
                        } else if (response.clearanceLevel >= 3) {
                            return 'I\'m honestly impressed you found him. Then again, it probably means he wanted to be found...';
                        }
                    }
                },
                'wilting-flower': {
                    command: ['wilting flower', 'wilting', 'flower'],
                    requiredKeywords: ['disarmingly'],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        
                        return 'I would love one, to be honest.<br><br>' +
                        'Most of the drinks I\'m offered are heavy on flavor, low on substance.<br><br>' +
                        'You wanted to know about a <h>shipment</h> scheduled with Meg Gallak?';
                    }
                },
                'shipment': {
                    command: ['shipment'],
                    requiredKeywords: ['disarmingly'],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Here\'s the simplest way to describe this. Sorelia and Ventus had a deal that they would provide us with advanced tech (we didn\'t ask where it came from) to help augment our engine research and development.<br><br>' +
                        'Those shipments have been <h>pivotal</h> in establishing the latest line of probes for far-range discovery and consistent unmanned flight.';
                    }
                },
                'pivotal': {
                    command: ['pivotal'],
                    requiredKeywords: ['disarmingly'],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'As someone who has dealt with Meg numerous times since she was stationed here, I can say with confidence that our relationship had nothing to do with her death. Unless I\'m not in the know...<br><br>' +
                        'With her dead, though, we\'ve lost access to the final shipment that we were expecting for the next wave of probes.<br><br>' +
                        'They\'re somewhere off-station. Within reach, but as good as lost without Meg. She was the only one who knew where they were.<br><br>' +
                        'Find me that shipment, and I\'ll talk more than you ever thought possible from me. There are things on this station that you\'re not <h>aware</h> of.';
                    }
                },
                'aware': {
                    command: ['aware'],
                    requiredKeywords: ['disarmingly'],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'I\'ll say no more until we have that shipment in hand.';
                    }
                },
                'destination': {
                    command: ['destination'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'What am I looking at here?<br><br>' +
                        'You planning on visit family over in Komek space?<br><br>' +
                        'The far, far edge of Komek space. <h>Perilously</h> close to the UA at that point.';
                    }
                },
                'perilously': {
                    command: ['perilously'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Whatever you\'re getting into, count me out.<br><br>' +
                        'If dead ships are flying toward the UA, I think I\'ll start flying the <h>opposite</h> direction.';
                    }
                },
                'meg-gallack': {
                    command: ['meg', 'meg gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'She could be obtuse, but she seemed like one of the good ones.<br><br>Those are hard to find, you know?';
                    }
                },
                'got': {
                    command: ['got'],
                    requiredKeywords: ['beetle'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'I was beginning to wonder if the day would ever come.<br><br>' +
                       'I\'ll get that loaded onto my ship <h>ASAP</h>, but we had a deal, so I\'ll share some details that may alter the trajectory of your time on Reiner Station.';
                    }
                },
                'asap': {
                    command: ['asap'],
                    requiredKeywords: ['beetle'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'I\'ll try to be succinct. Here\'s what I know:<br><br>' +
                        'The MIU needs to investigate their own. You\'ve got a leak that you need to plug.<br><br>' +
                        'I don\'t think there\'s a faction that DOESN\'T know about Project Lattice at this point, so you need to be careful there as well. Not everyone wants to be underneath Henko\'s big bubble in the sky.<br><br>' +
                        'Ventus isn\'t the only one scouting far and wide. We\'ve disabled and retrieved numerous stealth probes from the UA... in our sector. So I can only guess there are more out there, checking things out in Moonraker space.<br><br>' +
                        'And, lastly, this is the big <h>reveal</h>...';
                    }
                },
                'reveal': {
                    command: ['reveal'],
                    requiredKeywords: ['beetle'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('bye-kinta')){
                            response.keywords.push('bye-kinta');
                        }
                        if (!response.keywords.includes('reveal')){
                            response.keywords.push('reveal');
                        }
                        return 'Meg was killed by gunfire.<br><br>Can you believe that insanity?! The nerve--to shoot someone with a gun in a spaceship or a space station. You\'re practically asking for calamity.<br><br>' + 
                        'The murderer would need one of two things: unflinching accuracy and restraint OR the explicit trust of whoever they were about to shoot.<br><br>' +
                        'No wonder Armitage hasn\'t disclosed that. It\'s both the biggest clue and the most alarming detail.<br><br>' +
                        'Watch your back out there. I\'m heading out of here as soon as that cargo is loaded. I\'ve had enough of Reiner Station.';
                    }
                },
            }
        },
        'nella-van-daval': {
            requiredKeywords: [],
            minimumClearanceLevel: 2,
            getStation: function (response) {
                return 'reiner-station';
            },
            getRoom: function (response) {
                return 'hangar';
            },
            entryCommandMessage: function (response) {
                return '<hr>You walk towards Nella Van Daval. She\'s cranking something with a wrench, but looks up as you approach.';
            },
            entryDisplayMessage: function (response) {
                if (response.clearanceLevel <= 2) {
                    return 'What can I do you for?';
                } else if (response.clearanceLevel == 4) {
                    return 'I\'m supposed to work with Ryle to inspect every ship in and out of Reiner Station. They\'re all grounded until we\'re finished.<br><br>' +
                    'No, you\'re good. Armitage didn\'t want to disrupt your investigation. But when you return, you\'re on the docket as well.'
                } else {
                    return 'Did they tell you? The signal from that tracker is weak, but it\'s pinging back every now and then. Somewhere in Komek space.' +
                    'You going to check it out?';
                }
                
            },
            noResponse: function (response) {
                let characterResponse = chooseRandomString([
                    'I\'m not sure what you mean, but bring me back some ship parts, and I\'ll get to work on whipping this ship into shape.',
                    'What? Just ignore Mr. Farno while he\'s here. He fawns over the ship and then leaves after some time.',
                    'I don\'t know anything about that, but the ship is as ready as I can get her, right now.'
                ]);

                if (response.clearanceLevel >= 3) {
                    characterResponse = chooseRandomString([
                        'Your ship sucks right now. But it doesn\'t have to! Upgrade that lovely lady.',
                        'I\'m much better at fixing ships than talking.<br><br>Not that I mind the talking.',
                        'Take care of that ship when you\'re out there.'
                    ]);
                }

                if (response.clearanceLevel >= 4) {
                    characterResponse = chooseRandomString([
                        'Your ship is starting to look like something more than spare parts!',
                        'Anything I need to fix?',
                        'Take care of that ship when you\'re out there.'
                    ]);
                }
                return characterResponse;
            },
            conversationList: {
                'hello': {
                    command: ['hello', 'hi', 'yo', 'hello there'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Hello there. What can I do for you?';
                    }
                },
                'vessel': {
                    command: ['vessel'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Yep, she\'s ready for you. I\'ve outfitted her with what we can spare right now. Her thrusters could use an upgrade, and her reactor isn\'t as efficient as it could be, but you\'ll be able to get around.<br><br>' +
                        "I won't say no if you scavenge any parts while you're out there. I like to tinker, and I'd be happy to fix her up as you come and go here at the station.<br><br>" +
                        "For now, though, you've got the greenlight. Just <h>signal</h> the control room and they'll clear you for departure.";
                    }
                },
                'yacht': {
                    command: ['yacht'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 2) {
                            return "Don't get me started on that shiny piece of shit.<br><br>" +
                            "Yeah, it's top of the line in terms of specs, but it's a pretentious waste of money. I could outfit three different Interceptors with full kits for the price of that bloated whale.";
                        } else {
                            return "I can't describe how nice it is for that to be out of my sight.";
                        }
                        
                    }
                },
                'meg-gallack': {
                    command: ['meg', 'meg gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 2) {
                            return "She was always polite when we spoke. It was infrequent, but she left the station enough that I knew her more than I know most station personnel.<br><br>" +
                            "It's never good when someone dies, but it's less ideal when they've been... prematurely assisted.";
                        } else if (response.clearanceLevel == 4) {
                            return "Things have gone downhill since her death.";
                        } else {
                            return 'Find whoever offed her and make them pay.';
                        }
                    }
                },
                'mechanisms': {
                    command: ['mechanisms'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Yeah, it\'s dangerous around here if you\'re not careful. Thankfully, I\'m careful, but not everyone is.<br><br>' +
                        'Accidents happen.';
                    }
                },
                'missiles': {
                    command: ['missiles', 'missile'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Well it\'s still a live round. Which is miraculous if the ship is as old as you say it was.<br><br>' +
                        "But I don't know much more than that. If you want a more discerning eye, Ryle al Wren would be able to cross-check it against any munitions that have ever been housed at Reiner Station.<br><br>" +
                        'Just don\'t let it go to his head. He walked in here one time calling himself the "Cargo Overlord" and I won\'t be able to take it if he gets any weirder.';
                    }
                },
                'stash': {
                    command: ['stash'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Oh, you\'ve made me indescribably happy. To be a part of that creature\'s downfall. It\'s more than a humble mechanic could ask.<br><br>' +
                        'This is right outta those spy fics that I read. I love it.<br><br>' +    
                        'Let\'s find a new home for this beautiful beacon. I know just the right spot.';
                    }
                },
                'armitage': {
                    command: ['armitage'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        if (response.clearanceLevel == 4) {
                            return 'He is... troubled right now.';
                        } else {
                            return 'He was in here earlier. Sniffing around with some combat servitors.<br><br>' +
                            'I don\'t think I\'ve ever seen him before. Kinda freaked me out.'
                        }
                        
                    }
                }
            }
        },
        'io-mg21': {
            requiredKeywords: [],
            minimumClearanceLevel: 2,
            getStation: function (response) {
                return '';
            },
            getRoom: function (response) {
                if (response.keywords.includes('attack-ai')) {
                    return 'derelict-ship';
                } else {
                    return '';
                }
            },
            entryCommandMessage: function (response) {
                return 'Although you were initially startled, the droid raises an arm to greet you';
            },
            entryDisplayMessage: function (response) {
                return 'Are my services needed?<br><br>' +
                'As you may notice, my services are rather <h>limited</h> right now, but I will assist where possible.';
            },
            noResponse: function (response) {
                let characterResponse = chooseRandomString([
                    "I'm sorry, I don't understand. Minimal processing power is reserved for social functioning.",
                    'I don\'t register that command.',
                    'Error: System memory low. I must focus on the flight trajectory.'
                ]);
                return characterResponse;   
            },
            conversationList: {
                'hello': {
                    command: ['hello', 'hi', 'yo', 'hello there'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'How may I be of assistance? Do you have a target for me to eleminate?';
                    }
                },
                'limited': {
                    command: ['limited'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Yes, the majority of my processing power is tied to our <h>flight plan</h>.';
                    }
                },
                'flight-plan': {
                    command: ['flight plan', 'plan'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return "It may seem nonsensical to you, but we do have a course plotted.<br><br>" +
                        "As long as I am functioning, the crew remains.<br><br>" +
                        "I cannot divulge that data to you, but if you or anyone you know is familiar with piloting, then you can surmise our <h>destination</h>."
                    }
                },
                'meg-gallack': {
                    command: ['meg', 'meg gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return "She has visited this ship once before. That is all I am permitted to say without breaking protocol.";
                    }
                },
                'magnomi': {
                    command: ['magnomi'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'I have always been in service to Magnomi, and I will be until we reach our destination.';
                    }
                },
                'ryan-rogal': {
                    command: ['ryan', 'ryan rogal', 'rogal'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'He is not part of our crew. That is all I am permitted to say without breaking protocol.';
                    }
                },
            }
        },
        'armitage': {
            requiredKeywords: [],
            minimumClearanceLevel: 2,
            getStation: function (response) {
                return 'reiner-station';
            },
            getRoom: function (response) {
                
                if (response.clearanceLevel == 2 && response.keywords.includes('encrypted-messages')) {
                    return 'administrative-offices';
                } else if (response.clearanceLevel == 3) {
                    return 'administrative-offices';
                } else {
                    return '';
                }
            },
            entryCommandMessage: function (response) {
                return '<hr>You approach Armitage.';
                
            },
            entryDisplayMessage: function (response) {
                if (response.clearanceLevel == 2) {
                    return 'Let\'s get straight to it. I am pressed for time from all sides.';
                } else if (response.clearanceLevel == 3 && !response.keywords.includes('chapter-4-finished')) {
                    return 'I will not mince words. Everything points to Lynna Tragel operating as a <h>sleeper agent</h> for an unknown cell. We believe we have prevented catastrophic sabotage to Project Lattice, but we don\'t know the extent Lynna has compromised our security.';
                } else if (response.clearanceLevel == 3 && response.keywords.includes('chapter-4-finished')) {
                    return 'Time is running out. We need to ascertain the identity of Meg\'s killer, make sure it\'s not <h>connected</h> to anything Lynna Tragel was involved with, and then seal the leaks on this station.' +
                    'Finishing Project Lattice without any more problems is a matter of paramount importance.'
                } else {
                    return 'Let\'s get straight to it. I am pressed for time from all sides.';
                }
            },
            noResponse: function (response) {
                if (response.clearanceLevel == 3) {
                    let characterResponse = chooseRandomString([
                        'Now\'s not the time to stray off-topic.',
                        'Please stay focused. I\'m not in the mood for trivialities right now.',
                        'Let\'s get back to the matter at hand.'
                    ]);
                    return characterResponse;

                } else {
                    let characterResponse = chooseRandomString([
                        'I don\'t have time for whatever that is. I\'ve got more concurrent investigations than personnel to oversee at this facility so let\'s make this snappy.',
                        'Huh? I don\'t mind inquisitive types, but make sure you\'re heading in the right direction before you flag me down.',
                        'I don\'t know anything about that. I\'ve behind on so much paperwork.<br><br>Do you like paperwork? I\'m happy to share.'
                    ]);
                    return characterResponse;
                }
                
            },
            conversationList: {
                'hello': {
                    command: ['hello', 'hi', 'yo', 'hello there'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'What did I just say... let\'s get to it.';
                    }
                },
                'chat': {
                    command: ['chat'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'I\'ve been mulling this over ever since you sent me those messages.<br><br>' +
                        'Bill is right--Linus is an imbecile. He\'s also likely terrified. The further you wade into deep waters, the more <h>panic</h> sets in that there are bigger fish than you swimming around.<br><br>' +
                        'What if we took advantage of that?';
                    }
                },
                'panic': {
                    command: ['panic'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Precisely.<br><br>' +
                        'People who are scared do one of two things--lash out or run away.<br><br>' +
                        'I don\'t believe Linus is the type to lash out. Not unless he\'s convinced of his victory and has incredibly strong backers at hand. Neither of which is the case right now.<br><br>' +
                        'So he\'d run away. Which at first doesn\'t seem ideal. And yet... he\'d run toward perceived safety. Away from Henko space to whoever he\'s been conspiring with.<br><br>' +
                        'Et voila. Consistent encryption and excessive care will be undone by the simple fear of being <h>caught</h>. Linus will run right toward the very people we need to identify and thwart.';
                    }
                },
                'caught': {
                    command: ['caught'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return "I need you to do two things for me.<br><br>" +
                        '1) Confront Linus and tell him that you\'ve found his <h>spy probe</h>. Say no more and walk away.<br><br>' +
                        '2) Plant this tracking beacon on his pleasure yacht. Have Nella help you find an appropriate place to <h>stash</h> it.<br><br>' +
                        'I suspect that Linus will delay momentarily to collect his most prized possessions and the most damning evidence of his treason before departing on his pleasure yacht.<br><br>' +
                        'And we\'ll sit and wait. Maybe toast with whatever liquor he deigns to leave behind..'
                    }
                },
                'code': {
                    command: ['code'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Yes, very well.<br><br>' +
                        'HVMK<br><br>' +
                        'Please share the matching code.';
                    }
                },
                '1423': {
                    command: ['1423'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Well done! That tells me all I need to know.<br><br>' +
                        'For better or worse, we\'re pulling you into this mess with us. With Linus ready to flee, Magnomi splinter factions advancing destructive plots, and Komek shadow deals, Bill and I will need all the help we can get.<br><br>' +
                        'More details to follow but for now get some rest and grab a drink. Here is your new clearance code: <br><br>' +
                        'Clearance Level 3 - <u>ESCALATE</u><br><br>' +
                        'We\'ll be in touch soon, investigator.';
                    }
                },
                // CHAPTER 3
                'sleeper-agent': {
                    command: ['sleeper agent', 'sleeper'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'We don\'t know how long that has been the case. We don\'t know if she\'s been coerced. We don\'t know who she was working with.<br><br>' +
                        'We\'re currently combing through her entire <h>history</h> within the MIU, both here on Reiner Station and when she was positioned in Magnomi space.';
                    }
                },
                'history': {
                    command: ['history'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'What we do know is that last night she was caught <h>trespassing</h> in the secure engineering rooms dedicated to Project Lattice.<br><br>' +
                        'We\'ve scanned every nanometer of the rooms she infiltrated. There were no explosive devices. No spyware.<br><br>' +
                        'We\'ve also run every diagnostic the engineers can conceive of in order to verify the integrity of the system and to date we have not discovered any virus or malware.';
                    }
                },
                'trespassing': {
                    command: ['trespassing'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Our security personnel, after conferring with the project leads, are under the impression that we\'ve skirted disaster.<br><br>' +
                        'I\'m less optimistic. While overt sabotage may have been avoided, the fact remains we have been <h>duped</h> by an operator who we regarded as one of the best of us.<br><br>' +
                        'And we can\'t even question her to find out why.';
                    }
                },
                'duped': {
                    command: ['duped'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Well, that\'s the best part. After my combat servitors escorted her to the <h>brig</h>, she killed herself as far as I surmise.';
                    }
                },
                'brig': {
                    command: ['brig'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'She was entirely alone in there. Isolated behind an energy shield. Guarded by two combat servitors. Monitored on our security feeds.<br><br>' +
                        'And yet she collapsed on the floor mere minutes after I left the room. Her <h>vitals</h>--gone. Quite possibly the most consequential investigative subject of my career--gone.';
                    }
                },
                'vitals': {
                    command: ['vitals'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'And that leaves me with you two.<br><br>' +
                        'My other MIU investigators on Reiner Station. Who I held in the same regard as I held Lynna Tragel.<br><br>' +
                        'What do you have to <h>say</h> for yourselves?';
                    }
                },
                'bill-bendo': {
                    command: ['bill bendo', 'bill'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'I\'m not certain about anything anymore.';
                    }
                },
                'meg-gallack': {
                    command: ['meg gallack', 'meg', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'We will find her killer, but there are other pressing issues at present.';
                    }
                },
                'linus-farno': {
                    command: ['linus farno', 'linus'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'He has not returned to the station.';
                    }
                },
                'connected': {
                    command: ['connected'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Let\'s start with the thinnest motive and progress from there.<br><br>' +
                        'Were you able to <h>locate</h> the missing shipment for and extract some information from Ventus?<br><br>';
                    }
                },
                'locate': {
                    command: ['locate'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return "You're telling me that in addition to possessing Sorelian thruster tech and taking no meaningful notes or scans of it you also calmly let Kinta Lar walk out of here after she disclosed confidential and redacted information about Meg's murder?<br><br>" +
                        "Bill might be fond of you, but that's as far removed from \"results-oriented\" as I can envision...<br><br>" +
                        "If that\'s how it went with the least likely culprit, this isn't off to a great start.<br><br>" +
                        "What about your <h>meetup</h> with Finneal Lee?";
                    }
                },
                'meetup': {
                    command: ['meetup'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return "Oh, we lost one of our oldest Komek informants, and UA is massing on the borders of Moonraker space, pumped full of excess fuel. Delightful!<br><br>" +
                        'Did you manage anything else there other than observing the slow dissolution of years of contentious peace? No?<br><br>' +
                        '<h>What about</h> your encounter with Ryan Rogal?';
                    }
                },
                'what-about': {
                    command: ['what about'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return "Please tell me you're joking? All someone has to do is offer three pithy questions like some manic genie and you absolve them of your suspicion?<br><br>" +
                        "Who gains from Moonrakers infighting? The instigators! Which is a perfect description of a splinter group of Magnomi looking to start a war with the UA on a scale we haven't seen in our lifetimes<br><br>" +
                        "What kind of killer leaves a trace? ALL OF THEM! THE DEAD BODY ISN'T THE SUBTLEST OF HINTS.<br><br>" +
                        "Who benefits when you stop chasing them? The ones being chased.<br><br>" +
                        "Listen, I do recognize your contributions to this investigation to date, but some of your thinking here is pure <h>lunacy</h>.<br><br>" +
                        "What about Linus Farno? We set him up for a windfall of bad news with a well-concealed tracker and an incoming onslaught of MIU indignation. It's hard to imagine that going poorly.";
                    }
                },
                'lunacy': {
                    command: ['lunacy'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return "You caught him napping and he still got the drop on you? This is incredulous. It strains belief.<br><br>" +
                        "It doesn't matter if he confirmed the UA's involvement, which we all but suspected, if in addition to his confession of treason he merrily went on his way.<br><br>" +
                        "I guess I'm doing him a <h>disservice</h> by not acknowledging my thanks that he kindly dropped you off home here at the station before evaporating into thin air.<br><br>" +
                        "Honestly, I don't have any more follow-up questions. You couldn't get out of my sight fast enough...<br><br>" +
                        "...*sigh*...";
                    }
                },
            }
        },
        'oleg-ali': {
            requiredKeywords: [],
            minimumClearanceLevel: 2,
            getStation: function (response) {
                if (response.clearanceLevel <= 3) {
                    if (response.keywords.includes('beetle')) {
                        return '';
                    } else {
                        return 'reiner-station';
                    }
                } else if (response.clearanceLevel == 4) {
                    return '';
                }
            },
            getRoom: function (response) {
                if (response.clearanceLevel <= 3) {
                    if (response.keywords.includes('beetle') && !response.keywords.includes('bye-oleg')) {
                        return 'my-cargo-hold';
                    } else if (response.keywords.includes('disarmingly') && response.clearanceLevel <= 2) {
                        return 'VEP-H5';
                    } else {
                        return '';
                    }
                } else if (response.clearanceLevel == 4 && !response.keywords.includes('fragment')) {
                    return 'my-cargo-hold';
                } else {
                    return '';
                }
                
            },
            entryCommandMessage: function (response) {
                return 'You approach Oleg cautiously.';
            },
            entryDisplayMessage: function (response) {
                if (response.clearanceLevel <= 3) {
                    if (response.keywords.includes('beetle')) {
                        return 'Well done! ' +
                        'Good of you to <h>find</h> this last shipment for us.';
                    } else {
                        return 'You\'re here just in time! I could use some help.';
                    }  
                } else if (response.clearanceLevel == 4) {
                    return 'Fancy meeting you <h>out here</h>!<br><br>' + 
                    'What are you up to?'
                }
                
            },
            noResponse: function (response) {
                let characterResponse = chooseRandomString([
                    "Huh? You can do better than that.",
                    'What? I don\'t usually mince words with strangers. I\'ll make an exception for you, given that you\'re the only other person here.',
                    '...I\'ll get back to my work here if you don\'t have anything else to share.'
                ]);

                if (response.keywords.includes('beetle')) {
                    characterResponse = chooseRandomString([
                        "Huh? You can do better than that.",
                        'You look surprised.',
                        'Do you have any food onboard?'
                    ]);
                }

                if (response.clearanceLevel == 4) {
                    characterResponse = chooseRandomString([
                        "We have to stop running into each other like this.",
                        'I wonder how many unique ways I can board your ship.',
                        'How are things on Reiner Station?'
                    ]);
                }


                return characterResponse;
            },
            conversationList: {
                'hello': {
                    command: ['hello', 'hi', 'yo', 'hello there'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Yes, hello! Want to give me hand?';
                    }
                },
                'unpredictable': {
                    command: ['unpredictable'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'I find that the best reputation is the one that others make for you.<br><br>' +
                        'If I wanted you dead, my ship computer would have targeted you as soon as you waltzed out in that frail exosuit.<br><br>' +
                        'No, what I need right now is a <h>second set</h> of hands.';
                    }
                },
                'second-set': {
                    command: ['second set', 'second'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return "This probe right here has 50-plus years of scanning data that my compatriots gave up on as soon as it didn't yield results for a suitable new home.<br><br>" +
                        "That\'s... bothersome to me.<br><br>" +
                        "I want to extract that data before carrying on with my work in this sector. But it's tricky because we Ventus don't like meddlers.<br><br>" +
                        "I\'m nothing if not a meddler, but I only have two hands when I need four or six to safely disarm the <h>countermeasures</h> that we hardwire into these things. If we don't take our data, no one else does either.<br><br>" +
                        "So place your hands there and there. And brace them."
                    }
                },
                'counter-measures': {
                    command: ['counter measures', 'countermeasures'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return "Perfect! That's just what I needed.<br><br>" +
                        "See how the control board pops up safely like that?<br><br>" +
                        "If you hadn't showed up, I probably would have tripped the surge wires, and all of the <h>hard drives</h> would have fried.<br><br>" +
                        "One, two, three, four, five, six! Six racks of data. I cannot wait to comb through this.<br><br>";
                    }
                },
                'hard-drives': {
                    command: ['hard drives'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Thank you for your efforts. You stood there vexed so well. As if you\'ve been practicing your whole life.<br><br>' +
                        "I'll tell Kinta that I was pleased with your <h>performance</h>.<br><br>" +
                        "Why are you surprised that I know who you are and what you want? I wouldn't be good at my job if I didn't know.<br><br>" +
                        "You have my favor for now. That could change by the next time we meet. I'm a fickle fellow. Keeps life interesting that way."
                    }
                },
                'performance': {
                    command: ['performance'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        return 'Kinta will tell you what you need to know. I\'ll make sure of that.<br><br>' +
                        'Just buy her a <h>Wilting Flower</h>. She\'ll open right up.<br>' +
                        'Bye now.';
                    }
                },
                'kinta-lar': {
                    command: ['kinta', 'kint lar'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 2) {
                            return 'Hell of a pilot.<br><br>' +
                            'I like her. And she doesn\'t talk much, which is a plus.';
                        } else if (response.clearanceLevel == 3) {
                            return 'Yeah, she\'ll be eager to get her hands on this tech, I imagine.';
                        } else if (response.clearanceLevel >= 4) {
                            return 'She\'ll be out flying again sooner than you\'d think.';
                        } 
                    }
                },
                'ventus': {
                    command: ['ventus'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 2) {
                            return 'It\'s less Ventus and more The Warden that punches my ticket and tells me where to go.<br><br>' +
                            'I find that if your allegiance is too broad, you end up not getting much done.';
                        } else if (response.clearanceLevel ==3) {
                            return 'Sometimes the weak one wants you to think that\'s the case and nothing more.';
                        } else if (response.clearanceLevel >=4) {
                            return 'So boring. Next.';
                        }
                    }
                },
                'meg-gallack': {
                    command: ['meg', 'gallack', 'meg gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 1,
                    responseMessage: function (response) {
                        if (response.clearanceLevel <= 2) {
                            return 'Never heard of her. Should I have?';
                        } else if (response.clearanceLevel ==3) {
                            return 'Okay, maybe I\'ve heard of her.';
                        } else if (response.clearanceLevel >=4) {
                            return 'Figured it all out yet?';
                        }
                        
                    }
                },
                'find': {
                    command: ['find'],
                    requiredKeywords: ['beetle'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Well of course I knew where it was. Who do you think chose to stash it here? Who do you think coordinated all of this with Meg?<br><br>' +
                        'It would be <h>ruinous</h> to forget where I left it...';
                    }
                },
                'ruinous': {
                    command: ['ruinous'],
                    requiredKeywords: ['beetle'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Oh, Kinta didn\'t have any clue as to my involvement. I wouldn\'t be doing my job well if she did.<br><br>' +
                        'No, I <h>prefer</h> to inform only those that affect my operations.<br><br>' +
                        'I informed you, didn\'t I?';
                    }
                },
                'prefer': {
                    command: ['prefer'],
                    requiredKeywords: ['beetle'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'I like to know who I\'m dealing with.<br><br>' +
                        'And if those I\'m dealing with think they know more than they actually do, then I\'m in a position of strength. I have that advantage when it comes to bargaining for what Ventus needs. What The Warden wants.<br><br>' +
                        'I like being in a position of strength.<br><br>' +
                        'And now I know a lot about you. Just by <h>watching</h>.';
                    }
                },
                'watching': {
                    command: ['watching'],
                    requiredKeywords: ['beetle'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Everyone\'s mistake in is assuming that Ventus just wants out. That we\'re isolationists who can\'t be bothered to deal with life as it is.<br><br>' +
                        'The other factions see us as delusional, but that\'s because you\'re not privy to the data our probes have brought back.<br><br>' +
                        'Yes, we want a new home. Yes, we want the Fusion Drive up and running.<br><br>' +
                        'But we are <h>merchants</h> of information. Arbiters of data. And we benefit greatly from that.';
                    }
                },
                'merchants': {
                    command: ['merchants'],
                    requiredKeywords: ['beetle'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'If you haven\'t learned by now, when you have more information than someone else, they are dependent on you and not the other way around. Case in point: Kinta has information for you.<br><br>' +
                        'You have what she wants, so now she\'ll share it with you. And she did\'t have to lift a finger.<br><br>' +
                        'Who\'s <h>winning</h> in that scenario? Think on that.';
                    }
                },
                'winning': {
                    command: ['winning'],
                    requiredKeywords: ['beetle'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('bye-oleg')){
                            response.keywords.push('bye-oleg');
                        }
                        return 'And at that, Oleg Ali departs in the same way he arrived--with shutting doors, wailing alarms, and then quiet.<br><br>' +
                        'You\'re left with the newly-loaded cargo and a twice-<h>repaired</h> hull breach.';
                    },
                    eventMoment: true
                },
                'out-here': {
                    command: ['out here'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Looking to board a Sorelian <h>waystation</h> without permission?<br><br>' +
                        'They don\'t take too kindly to strangers.'
                    }
                },
                'waystation': {
                    command: ['waystation'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'You\'ve never heard of a waystation? The Sorelians have them spread far and wide. It\'s somewhat of a necessity.<br><br>' +
                        'Think about it. If your technology is more advanced (or maybe just different) than everyone else\'s, it\'s not so simple to stop, refuel, and repair just anywhere.<br><br>' +
                        'No, no, no. They need their own network. The <h>trick</h> is in finding them. Sorelians, of course, know where they\'re at, but most others haven\'t a clue.'
                    }
                },
                'trick': {
                    command: ['trick'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Well, I can save you the trouble of boarding.<br><br>' +
                        'It\'s empty. <h>Cleaned</h> out may be more accurate. Sorelians never did like a mess.'
                    }
                },
                'cleaned': {
                    command: ['cleaned'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'How do I know? Because I boarded it first, oh dim-witted one.<br><br>' +
                        'Took my three days to cut into the hard little shell, too. By the time I was inside and ready to leave, the hull had repaired itself. <br><br>' +
                        'Thankfully once you\'re inside, the airlocks are easier to operate manually, <h>wink</h> wink.<br><br>' +
                        'I think my people would have left me if I\'d spent another three days cutting my way out.'
                    }
                },
                'wink': {
                    command: ['wink'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'You searching for anything in particular?<br><br>' +
                        'You seem a little lost. Maybe a <h>map</h>?'
                    }
                },
                'map': {
                    command: ['map'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Hahaha, a good guess wasn\'t it?<br><br>' +
                        'Look, other factions have been trying to navigate the Sorelian minefield ever since those freaks tunneled into that treacherous part of space.<br><br>' +
                        'This fragment is the most valuable thing that the outpost would have possessed and yet it was left behind.<br><br>' +
                        'Smacks of <h>intent</h>, doesn\'t it?'
                    }
                },
                'intent': {
                    command: ['intent'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Oh no, I don\'t <h>want it</h>. I\'m not sure if you could tell from the navigational charts, but I\'m heading in the opposite direction.<br><br>' +
                        'And the largest Ventus vessel around is in tow. I\'ve got other things to deal with. Other pressing--or probing--matters.'
                    }
                },
                'want-it': {
                    command: ['want it'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Look, maybe I like you. I have a soft spot for helpless explorers. I sure don\'t want anyone else to have it.<br><br>' +
                        'Or... maybe Meg asked me to ensure you got it. And I\'ve been waiting to make good on that before Ventus subtracts itself from the equation.<br><br>' +
                        'Ask for it nicely?'
                    }
                },
                'please': {
                    command: ['please'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('fragment')){
                            response.keywords.push('fragment');
                        }
                        return 'With what could possibly be a sincere smile, Oleg hands over the map <h>fragment</h> that he acquired from the Sorelian waystation.<br><br>' +
                        'You watch him as he returns to his ship, and you feel fairly certain that you\'ll never see Oleg Ali again.'
                    },
                    eventMoment: true,
                },
            }
        },
        'finneal-lee': {
            requiredKeywords: [],
            minimumClearanceLevel: 3,
            getStation: function (response) {
                return 'leppik-station';
            },
            getRoom: function (response) {
                return 'hangar';
            },
            entryCommandMessage: function (response) {
                return 'You approach Finneal Lee.';
            },
            entryDisplayMessage: function (response) {
                return 'What the hell are you even doing here?<br><br>' +
                'And before you ask how I know who you are, don\'t. You\'re not the only one with informants on your payroll.<br><br>' +
                'Not to mention your MIU-registered ship and your lackadaisical approach to discretion.<br><br>' +
                'You Henkos can sometimes be so <h>brainless</h>.';
            },
            noResponse: function (response) {
                let characterResponse = chooseRandomString([
                    "I swear, after this, I'm done with all of you.",
                    'The money isn\'t worth the risk, and you\'re all not worth the headache.',
                    'Take your ship and go, please.'
                ]);
                return characterResponse;
            },
            conversationList: {
                'hello': {
                    command: ['hello', 'hi', 'yo', 'hello there'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 2,
                    responseMessage: function (response) {
                        return 'Hello there!';
                    }
                },
                'brainless': {
                    command: ['brainless'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Can you not see what\'s <h>happening</h> around you?<br><br>' +
                        'Surely you\'ve noticed since you\'ve landed on Leppik Station. Things aren\'t as they were a few short months ago. The UA has awoken from its slumber.<br><br>' +
                        'They\'re here, and I\'m not sure if they ever plan to leave.';
                    }
                },
                'happening': {
                    command: ['happening'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Oh, it\'s easy for the rest of you to judge. Henko, who bunker down and pray for the worst to pass. Ventus, who want to run away from all of their problems. Sorelia, who shimmer in and out of existence.<br><br>' +
                        'None of you have to live with the UA breathing down your neck. You sit in the back of the room and shout your commentary at the attentive Komeks in the front row.<br><br>'+
                        'Why do you think we\'re listening so <h>closely</h> to the UA? We\'ll be the frontline casualties in whatever conflict the rest of you stir up.<br><br>' +
                        'Do you want us to be like the Magnomi? Breathing onto every spark in the hopes it flares up into a conflagration?';
                    }
                },
                'closely': {
                    command: ['closely'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return "Of course we're in bed with the UA. It's how we've stayed alive as long as we have.<br><br>" +
                        "If you haven't <h>figured</h> this out yet, then you're pretty shitty investigators."
                    }
                },
                'figured': {
                    command: ['figured'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'What are you <h>doing here</h>?';
                    }
                },
                'doing-here': {
                    command: ['doing here'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    eventMoment: true,
                    responseMessage: function (response) {
                        return 'You relay the events of the past few weeks to Finneal Lee.<br><br>' +
                        'You tell him just enough to inform him of the stakes, but not everything since you\'re still unsure whether any Komek parties are involved. The presence of UA ships at Leppik Station has you worried.<br><br>' +
                        'The more you reveal about the tumult on Reiner Station, the more surprised Finneal is, but you notice that it\'s more the shock of a bemused third party rather than someone invested in the outcome.<br><br>' +
                        'Mention of Sorelia does cause him to perk up, though.<br><br>' +
                        'After you finish conveying the particulars of your investigation, Finneal sighs in what might be <h>relief</h> but could also be exhaustion.';
                    }
                },
                'relief': {
                    command: ['relief'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return "What's transpired must have been difficult for you, but I've never been so happy to assure you that we have absolutely nothing to do with it.<br><br>" +
                        "Komek is busy trying to stay alive. We have a cease-fire with the UA because we're trying to stay alive. We're selling them surplus energy because we're trying to stay alive.<br><br>" +
                        "Stepping into a quagmire of political intrigue and pissing off Sorelia is the last thing we want to do.<br><br>" +
                        "You want a prime example of this? Omnitus was investigating the Sorelian minefield last month. They were \"greeted\" by Moro Mada and barely escaped alive. Do you hear us complaining? Nope, we're just glad Omnitus made it back to Komek space and lived to tell about it.<br><br>" +
                        "We didn't kill Meg Gallak. We aren't stupid enough to.<br><br>" +
                        "So <h>go back</h> and tell your superiors. Komek is off the table. We very much try to avoid being \"on the table\" in all respects.";
                    }
                },
                'go-back': {
                    command: ['go back'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {  
                        if (!response.keywords.includes('go-back')){
                            response.keywords.push('go-back');
                        }
                        return 'Alas, that\'s the end of my monologue.<br><br>' +
                        'Get the hell out of my sight, please, and never come back.';
                    }
                },
                'meg-gallack': {
                    command: ['meg', 'gallack', 'meg gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'I don\'t know them, and I don\'t want to. The less I know, the better.';
                    }
                },
                'lila-al-bindar': {
                    command: ['lil', 'lila al bindar'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Why are you asking about her? Never mind. Don\'t answer that.';
                    }
                    
                },
                'utopian-alliance': {
                    command: ['ua', 'utopian alliance'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'You\'re trying to get me killed, aren\'t you?';
                    }
                },
            }
        },
        'pat-nungar': {
            requiredKeywords: [],
            minimumClearanceLevel: 3,
            getStation: function (response) {
                return 'leppik-station';
            },
            getRoom: function (response) {
                return 'hangar';
            },
            entryCommandMessage: function (response) {
                return 'You apprach the machinist.';
            },
            entryDisplayMessage: function (response) {
                return 'I\'d recommend you not stay too long.<br><br>' +
                'Top off your fuel. Buy any ship parts you\'re lacking. And head on back to where you came from.<br><br>' +
                'We\'re not as welcoming to strangers as we used to be, sadly.';
            },
            noResponse: function (response) {
                let characterResponse = chooseRandomString([
                    "Your ship sucks.",
                    'Your reactor could use a tune-up.',
                    'Take care of your ship when you\'re out there. They\'re all that separate us from the aliens.'
                ]);
                return characterResponse;
            },
            conversationList: {
                'meg-gallack': {
                    command: ['meg', 'gallack', 'meg gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Who?';
                    }
                },
                'lila-al-bindar': {
                    command: ['lil', 'lila al bindar'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'One of our best, she is.<br><br>' +
                        'How do you know her?';
                    }
                    
                },
                'utopian-alliance': {
                    command: ['ua', 'utopian alliance'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Bad form for me to talk about that. I don\'t even know you.';
                    }
                },
            }
        },
        'moro-mada': {
            requiredKeywords: [],
            minimumClearanceLevel: 3,
            getStation: function (response) {
                return '';
            },
            getRoom: function (response) {
                if (response.clearanceLevel <= 3) {
                    if (response.keywords.includes('tactical-suit')) {
                        return 'moro-mada-ship';
                    } else {
                        return '';
                    }
                } else if (response.clearanceLevel >= 4) {
                    return 'sorelia-waystation-1';
                }
                
            },
            entryCommandMessage: function (response) {
                return 'Moro\'s eyes seem to look inside you, seeing something you\'re not aware of.';
            },
            entryDisplayMessage: function (response) {
                if (response.clearanceLevel <= 3) {
                    if (response.keywords.includes('moro-probes')) {
                        return 'I was <h>wondering</h> when you\'d show up.<br>' +
                        'Did you return with the probe data? What\'s the value of all probe responses multiplied?';
                    } else {
                        return 'I was <h>wondering</h> when you\'d show up.';
                    }
                } else if (response.clearanceLevel >=4) {
                    return '<h>Hello</h> again.';
                }
                
            },
            noResponse: function (response) {
                let characterResponse = chooseRandomString([
                    "I should get back to reading.",
                    'I should get back to sparring.',
                    'One of these days you\'ll have more interesting questions for me.'
                ]);

                if (response.clearanceLevel >= 4) {
                    characterResponse = chooseRandomString([
                        "Don't waste my time.",
                        'You want the scalpel again?',
                        'Itching to get back to Bill Bendo?'
                    ]);
                }

                return characterResponse;
            },
            conversationList: {
                'wondering': {
                    command: ['wondering'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Meg was fond of you. Even toward the end when she retreated inward and trusted practically no one.<br><br>' +
                        'When Meg is <h>fond</h> of someone, I keep a close eye on them.';
                    }
                },
                'fond': {
                    command: ['fond'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return "Yes, it came as a surprise to me as well. If you haven't looked in the mirror lately, you\'re not exactly a prime specimen.<br><br>" +
                        'She said your <h>heart</h> was in the right place, though.';
                    }
                },
                'heart': {
                    command: ['heart'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'She was a good agent. And she handled herself admirably. As best as one can when they walk into a <h>shitshow</h> and are told to work magic.';
                    }
                },
                'shitshow': {
                    command: ['shitshow'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Let\'s dispense with the cat and mouse here. I have neither the time nor the patience.<br><br>' +
                        'I know Meg Gallak is dead. I knew before you did because I knew it was going to happen before it happened.<br><br>' +
                        'I know who the killer is. And I\'m not going to do anything about it because that\'s Meg\'s job.<br><br>' +
                        'I also know that you want information. About Meg. About Sorelian plans. About anything to help you make sense of it all.<br><br>' +
                        'I will give you one <h>iota</h> of information--nothing more, nothing less. But I won\'t give it to you until you do something for me.<br><br>' +
                        'You\'ll want to do it, too, because the information I\'ll share will save your life.';
                    }
                },
                'iota': {
                    command: ['iota'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Go download my mission reports from the relay probes I have scattered throughout Moonraker space.<br><br>' +
                        'They\'re highly-encrypted, and if you try to transmit them anywhere off of this <h>datastick</h> they\'ll erase.<br><br>' +
                        'I just can\'t be bothered right now. I\'ve got stacks of other data to comb through in the meantime, and this task feels tedious enough to be commensurate with talking to you again.';
                    }
                },
                'datastick': {
                    command: ['datastick'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Yes, you\'ll need this datastick. Here you go.<br><br>' +
                        'I\'ve hidden the 4 probes, one in the Komek, Magnomi, Henko, and Ventus sectors.<br><br>' +
                        'You\'ll need to use the code <h>GLYPH</h> when trying to download the probe data onto the stick.<br><br>' +
                        'Each probe will share a response number. Keep track of them. Until then, we have nothing more to talk about.';
                    }
                },
                'meg-gallack': {
                    command: ['meg', 'meg gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        if (response.clearanceLevel >= 4) {
                            return "Figured it all out yet?"
                        } else {
                            return "I would trade a thousand of you for one Meg.";
                        }
                    }
                },
                'utopian-alliance': {
                    command: ['ua', 'utopian alliance'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        if (response.clearanceLevel < 4) {
                            return 'Why do you assume that I know more than you do?';
                        } else {
                            return 'That\'s why you\'re here, no?';
                        }
                        
                    }
                },
                'lynna-tragel': {
                    command: ['lynna', 'lynna tragel'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'Some things even I don\'t know. That one... surprised me.';
                    }
                },
                '210': {
                    command: ['210'],
                    requiredKeywords: ['moro-probes'],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'I very much look forward to sifting through the data.<br><br>' +
                        'As promised, here\'s your iota: I won\'t kill you.<br><br>' +
                        'Be thankful about it and be on your way.';
                    }
                },
                'hello': {
                    command: ['hello'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'You offer a greeting as respectfully as possible, given the recent revelations, but her laconic murmur in response doesn\'t fill you with confidence.<br><br>' +
                        'And what little confidence you gained evaporates as Moro Mada languidly flips a switch on a handheld remote.<br><br>' +
                        'A stasis field envelopes you, and you lift off the floor until you\'re floating diagonally. You try and crane your head to keep her in your field of vision, but your muscles are immobilized.<br><br>' +
                        'The Sorelian agent appears at your side and caresses your cheek with a surgical scalpel. A warm, bloody <h>tear</h> slides down your neck.';
                    },
                    eventMoment: true,
                },
                'tear': {
                    command: ['tear'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'How would you describe your current <h>motivations</h>?';
                    },
                },
                'motivations': {
                    command: ['motivations'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Yes, motivations. As in, are you traveling through our minefield because you want to chart a <h>new course</h> for yourself or because you have a voice in your head telling you what to do?';
                    },
                },
                'new-course': {
                    command: ['new course'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'That\'s good to know. My decision to not kill you last time we met was not a promise in perpetuity.<br><br>' +
                        'It was an exercise in restraint. Which is a rarity for me.<br><br>' +
                        'So I want to make sure you\'re intruding upon our privacy for the <h>right reasons</h>.';
                    },
                },
                'right-reasons': {
                    command: ['right reasons'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Where will you kill Bill?';
                    },
                },
                'right-reasons': {
                    command: ['right reasons'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Who killed Meg?';
                    },
                },
                'me': {
                    command: ['me', 'i did', 'it was me', 'i did it'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Who was your other accomplice on Reiner Station besides Lynna Tragel?';
                    },
                },
                'linus-farno-end': {
                    command: ['linus','linus farno'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Stings, doesn\'t it? Sometimes we are what we hate.<br><br>' +
                        'How many fragments did you need to collect to navigate the minefield?';
                    },
                },
                'three': {
                    command: ['3','three'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Okay, that\'s enough for now. Vanta will know what to do with you if you\'re <h>lying</h> to me.';
                    },
                },
                'lying': {
                    command: ['lying'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Moro Mada deactivates the stasis field, and you crash to the floor.<br><br>' +
                        'As you pick yourself up, she returns to her cushioned seat.<br><br>' +
                        '"You can refuel now if you need it."';
                    },
                    eventMoment: true,
                },
                'sorelia': {
                    command: ['sorelia'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'You found us. Or we led you here. Whichever helps you sleep at night.';
                    },
                },
            }
        },
        'ryan-rogal': {
            requiredKeywords: [],
            minimumClearanceLevel: 3,
            getStation: function (response) {
                return '';
            },
            getRoom: function (response) {
                if (!response.keywords.includes('crumpled')) {
                    return 'magnomi-warship';
                } else {
                    return '';
                }
            },
            entryCommandMessage: function (response) {
                return 'You attempt to meet Ryan Rogal\'s eye, but the gun is making that difficult.';
            },
            entryDisplayMessage: function (response) {
                if (response.keywords.includes('-------')) {
                    return 'something probably';
                } else {
                    return 'I warned you last time not to attract my attention.<br><br>' +
                    'That doesn\'t look like it really <h>sunk in</h>.';
                }
                
            },
            noResponse: function (response) {
                let characterResponse = chooseRandomString([
                    "I don't think that's relevant to your current predicament",
                    'I\'m not convinced you appreciate the gravitas of the situation.',
                    'I\'ve got more important things to deal with if you\'re not interested in talking.'
                ]);
                return characterResponse;
            },
            conversationList: {
                'sunk in': {
                    command: ['sunk in'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'I want you to appreciate the fact that you\'re <h>not dead</h> right now. I\'ve killed others for less, so I need you to know how much restraint is on display here.';
                    }
                },
                'not dead': {
                    command: ['not dead'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return "Speaking of dead--which you're not--how's Meg doing?<br><br>" +
                        'Oh, that\'s right! She\'s not because someone shot her point blank in the chest. Did you not know? Curious how that works. Intelligence services being the last one to know, making them much less intelligent than they suggest.<br><br>' +
                        'And look here: I\'ve got a gun. The type of gun that might have done the <h>deed</h>.';
                    }
                },
                'deed': {
                    command: ['deed'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'How dumb do you think I am? Everyone knows my fondness for guns. You think I\'d broadcast my involvement to Moonraker and UA spoofs alike by actually using one in a murder?<br><br>' +
                        'You have got to be <h>kidding</h> me?!<br><br>'+
                        'If I wanted Meg dead--or anyone else for that matter--than they\'d be dead and no one would be the wiser.';
                    }
                },
                'kidding': {
                    command: ['kidding'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'I\'m not shy about killing. It\'s my pastime. My occupation. One might even say my specialty.<br><br>' +
                        'But the smartest killers, the ones that make a career out of it, don\'t telegraph their moves. They don\'t <h>advertise</h> their business or their accomplishments. They get in and they get out.<br><br>'+
                        'I\'m worried you\'re being played for a fool. Scratch that, I\'m not worried. I\'m convinced.';
                    }
                },
                'advertise': {
                    command: ['advertise'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return "Here's the thing. I've got more important things to deal with right now. The UA is making advances all while Magnomi is waiting to blow shit up, and I'm the one with my hand on the trigger waiting to make a move.<br><br>" +
                        "You've got your own problems, though. Don't add me to the equation. It'll throw everything for a <h>loop</h>, nothing will balance out, and I'll have to end up killing you.<br><br>" +
                        "Do you wanna be killed? That used to be such a simple question with an easy answer, but apparently martyrdom is a thing now, and people keep surprising me.";
                    }
                },
                'loop': {
                    command: ['loop'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'It\'s just a death loop with all of you Reiner Station types.<br><br>' +
                        "I didn't kill Meg. A different day, a different motive and sure, I might have killed her, but " +
                        "at the end of the day I didn't. Honestly, I liked her more than most of the people I meet. I certainly liked her more than I like you. What does that say?<br><br>" +
                        "Kary and I are not <h>burdened</h> down by your Project Lattice bullshit. Give us the credit that our plans don't hinge upon a factor that is out of our control.";
                    }
                },
                'burdened': {
                    command: ['burdened'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return "If you're looking at us, then you're looking in the wrong direction.<br><br>" +
                        "And I'd put good credits on the fact that <h>whoever</h> is behind this has laughed mercilessly at your expense.<br><br>" +
                        "The culprit is still out there somewhere, but this guy and this ship are not the ones you're looking for.";
                    }
                },
                'whoever': {
                    command: ['whoever'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('crumpled')){
                            response.keywords.push('crumpled');
                        }
                        return "As Ryan Rogal concludes his epic diatribe, you feel a hot flash. The restraints on your wrists and ankles burn hot, and your head pounds with a massive hammering.<br><br>" +
                        'The walls of Ryan\'s ship vibrate and collide together as your vision spikes. Lights fade and the noise subsides until there is nothing.<br><br>' +
                        'You rouse from a fitful slumber--if it can even be called that--and you\'re back on your ship. You lie in the fetal position on the floor of your cargo hold. A note lies <h>crumpled</h> in your clenched fist.';
                    },
                    eventMoment: true
                },
                'crumpled': {
                    command: ['crumpled'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'The note reads:<br><br>' +
                        'Answer these three questions:<br><br>' +
                        'What kind of killer leaves a trace?<br><br>' +
                        'Is anyone benefiting from you chasing me?<br><br>' +
                        'After you dwell on that, know this: If you come after me again, I will not hesitate to kill you. Our plans matter more than appeasing a trite Henko representative for a blundering MIU investigation. Get your heads out of your collective asses.<br><br>' +
                        '-RR'
                    },
                    eventMoment: true
                },
                'meg-gallack': {
                    command: ['meg', 'meg gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return "I liked her. However, the past tense has a way of helping me move on.";
                    }
                },
                'utopian-alliance': {
                    command: ['ua', 'utopian alliance'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'They\'ll be the first to burn.';
                    }
                },
                'magnomi': {
                    command: ['magnomi'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 3,
                    responseMessage: function (response) {
                        return 'I have always been in service to Magnomi, and I will be continue to be of service.';
                    }
                },
            }
        },
        'sorelian-ai': {
            requiredKeywords: [],
            minimumClearanceLevel: 4,
            getStation: function (response) {
                return '';
            },
            getRoom: function (response) {
                return 'data-vault';
            },
            entryCommandMessage: function (response) {
                return 'You attempt to meet it\'s eyes... if those are in fact eyes.';
            },
            entryDisplayMessage: function (response) {
                if (response.keywords.includes('-------')) {
                    return 'something probably';
                } else {
                    return 'Please enter your Sorelian identification.';
                }
                
            },
            noResponse: function (response) {
                return "Invalid entry. Please try again.";
            },
            conversationList: {
                'meg': {
                    command: ['meg', 'meg gallack', 'meg gallak'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Who is your handler?';
                    }
                },
                'moro': {
                    command: ['moro', 'moro mada'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'What are the coordinates of your current posting?';
                    }
                },
                'reiner': {
                    command: ['00', '0,0', '0 0', '0.0', 'reiner', 'reiner station', 'henko space'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'What faction have you infiltrated?';
                    }
                },
                'henko': {
                    command: ['henko'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'What data do you require from me?';
                    }
                },
                'map': {
                    command: ['map', 'fragment', 'map fragment', 'map piece', 'sorelia'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Further confirmation is required before I can share classified data.<br><br>' +
                        'Who was your predecessor?';
                    }
                },
                'ark-tii': {
                    command: ['ark', 'ark tii'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'What individual(s) were you investigating?';
                    }
                },
                'lynna': {
                    command: ['lynna tragel', 'lynna', 'linus', 'linus farno'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Your last transmitted report included the discovery of UA schemes. What type of agent did you unveil on Reiner Station?';
                    }
                },
                'sleeper': {
                    command: ['sleeper', 'spy', 'hidden', 'sleeper agent'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Finally, what was your occupation prior to becoming ambassador on Reiner Station?';
                    }
                },
                'mine': {
                    command: ['mine', 'mine engineer'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('satisfied')){
                            response.keywords.push('satisfied');
                        }
                        return 'The sphere\'s AI seems <h>satisfied</h> with your responses. Through the data cable, it shares a map fragment for the Sorelian minefield.' +
                        'You retract the cable and ready the ship to depart.';
                    }
                },
                
            }
        },
        'vanta-sae': {
            requiredKeywords: [],
            minimumClearanceLevel: 4,
            getStation: function (response) {
                return '';
            },
            getRoom: function (response) {
                if (response.clearanceLevel == 4 && !response.keywords.includes('chimes')) {
                    return 'sorelia-waystation-2';
                }
            },
            entryCommandMessage: function (response) {
                return 'You attempt to stop your hands from shaking. You are not successful.';
            },
            entryDisplayMessage: function (response) {
                return 'Are you certain you wish to <h>proceed</h>?';
            },
            noResponse: function (response) {
                return "Incorrect";
            },
            conversationList: {
                'proceed': {
                    command: ['proceed'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Vanta Sae looked like the waystation--an organism whose origin you couldn\'t deduce. Part machine, part genetic curiosity. Just dial the genetic part up until you\'re presented with a peerless specimen that could likely dismember you with little effort.<br><br>' +
                        'The voice that emanated from the darkened helmet visor was cool and <h>sibilant</h>.';
                    },
                    eventMoment: true,
                },
                'sibilant': {
                    command: ['sibilant'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Let\'s <h>begin</h>.';
                    }
                },
                'begin': {
                    command: ['begin'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'It\'s hard to describe what happens. You descend into a tranquil state of mind, and on a subconscious level you feel as if Vanta Sae is peeling back your very identity a layer at a time.<br><br>' +
                       'Vanta Sae speaks and you answer, yet the conversation is unintelligible like muffled talk in another room. What you focus on is the hynoptic quality of the Sorelian\'s voice--her aura almost.<br><br>' +
                       'The deep, penetrating voice reverberates throughout the room and hews off more of you until there\'s nothing left but whatever truth was hidden away behind the <h>walls</h> you created.';
                    },
                    eventMoment: true,
                },
                'walls': {
                    command: ['walls'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('chimes')){
                            response.keywords.push('chimes');
                        }
                        return 'When you recover from the psychic barrage, Vanta Sae is gone.<br><br>' +
                        'You feel strange. Like a newborn.<br><br>' +
                        'Your datapad <h>chimes</h> with a new message.';
                    },
                    eventMoment: true,
                },
            }
        },
        'dae-arum': {
            requiredKeywords: [],
            minimumClearanceLevel: 4,
            getStation: function (response) {
                return '';
            },
            getRoom: function (response) {
                if (response.clearanceLevel == 4 && !response.keywords.includes('dae-arum')) {
                    return 'sorelia';
                }
            },
            entryCommandMessage: function (response) {
                return 'You approach the small figure in front of you.';
            },
            entryDisplayMessage: function (response) {
                return '<h>Why</h> are you here?';
            },
            noResponse: function (response) {
                return "I have nothing to offer you on that.";
            },
            conversationList: {
                'why': {
                    command: ['why'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'To wrest control of yourself from the UA will take more than Sorelian intervention.<br><br>' +
                        'It will require you to <h>rewrite</h> yourself.<br><br>' +
                        'Are you ready for that?';
                    },
                },
                'rewrite': {
                    command: ['rewrite'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Very well.<br><br>' +
                        'What is it called when a system has been put under stress? Had too much demanded of it?';
                    }
                },
                'overload': {
                    command: ['overload', 'strain', 'overwhelm', 'over load'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        return 'Precisely.<br><br>' +
                        'That is the ethos of the Utopian Alliance. To use you until there is nothing left. You have to forge a new path and escape the orbit of their control.<br><br>' +
                       'The first Moonrakers were intrepid explorers who braved a void so fear-inducing that the UA were assured of our demise. What is the first open contract Sorelia sourced?';
                    },
                },
                'black-hole': {
                    command: ['black hole', 'black-hole'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('chimes')){
                            response.keywords.push('chimes');
                        }
                        return 'That\'s right. An exploration of the impossible. We need to rediscover that dauntless nature. We are on the brink of war, and if we continue to tear each other down from within, we will never survive an attack from without.<br><br>' +
                        'It is the ties that bind us together that will ultimately free us.<br><br>' +
                        'Sorelia created ship technology that grows more powerful as more Moonrakers work together.<br><br>' +
                        'What is it called?';
                    },
                },
                'the-leech': {
                    command: ['leech', 'the leech'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('chimes')){
                            response.keywords.push('chimes');
                        }
                        return 'That is the <h>cure</h>: cooperation. Working as allies rather than enemies.';
                    },
                },
                'cure': {
                    command: ['cure'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {

                        return 'You? You need no cure.<br><br>' +
                        'You haven\'t ever since your encounter with Vanta Sae. What do you think that was? Reprogramming. Deactivation. All of it.<br><br>' +
                        'No, you needn\'t have come here to be cured. We merely wanted to test your resolve.<br><br>' +
                        'It\'s one thing to be free of your <h>chains</h>. It\'s another to take the first step without them.';
                    },
                },
                'chains': {
                    command: ['chains'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {

                        return 'Bill dies by your hand and yours alone.<br><br>' +
                        'You want to change that?<br><br>Simply say, "No".<br><br> And continue walking away from who you were.<br><br>' +
                        '<h>That is all</h>.';
                    },
                },
                'that-is-all': {
                    command: ['that is all'],
                    requiredKeywords: [],
                    minimumClearanceLevel: 4,
                    responseMessage: function (response) {
                        if (!response.keywords.includes('dae-arum')){
                            response.keywords.push('dae-arum');
                        }
                        return 'At that, Dae Arum turns around.<br><br>' +
                        'And she walks away, receding into an unknown horizon in an impossible manner. Never leaving the dais, yet walking on and on. It is a quintessential Sorelian move.<br><br>' +
                       'You shake your head and look down to make sure you\'re still on the dais as well. You\'re not. You\'re floating back towards your ship, and your eyes take in the last of Sorelia you\'ll ever see.';
                    },
                    eventMoment: true,
                },
            }
        },
    }

}

function createCharacterObject(key, response) {
    // First get the character from the database

    if (Database.characterList.hasOwnProperty(key)) {

        const character = Database.characterList[key];

        const messageObject = {
            name: character.name,
            key: key,
            img: character.img,
            command: character.command,
            room: Characters.characterList[key].getRoom(response),
            station: Characters.characterList[key].getStation(response),
            entryCommandMessage: Characters.characterList[key].entryCommandMessage(response),
            entryDisplayMessage: Characters.characterList[key].entryDisplayMessage(response),
        }

        return messageObject;

    } else {
        return `Character with key "${key}" not found.`; // Return an error message if key doesn't exist
    }

}

function chooseRandomString(strings) {
    if (strings.length === 0) {
        console.warn("random string array is empty");
        return '';
    }
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
}

function checkForDuplicateCommands(character, key) {
    let commandSet = new Set();
    let duplicateCommands = [];

    for (let conversationKey in character.conversationList) {
        if (character.conversationList.hasOwnProperty(conversationKey)) {
            let conversation = character.conversationList[conversationKey];
            conversation.command.forEach(command => {
                if (commandSet.has(command)) {
                    duplicateCommands.push(command);
                    console.log('Duplicate commands found for ' + key + " " + command);
                } else {
                    commandSet.add(command);
                }
            });
        }
    }

    
}


Characters.checkForErrors();
module.exports = Characters;