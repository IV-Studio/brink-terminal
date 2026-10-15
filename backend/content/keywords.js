const newMessage = 'You have 1 new message.';
const newFile = 'A file has been added to your database.';
const newFileReadout = 'This file has been added to your database:';
const newTavernCharacter = 'Someone has arrived at the Tavern.';
const newAudioFile = 'An audio file has been added to your database.';
const moroProbe = '1 audio files has been added to your database, and you have 1 new message.';

const Keywords = {

    checkKeyword: function (response, inputString) {

        for (const key in Keywords.keywordList) {

            if (Keywords.keywordList.hasOwnProperty(key)) {

                const keyword = Keywords.keywordList[key];

                const clearanceReq = keyword.clearanceLevel;

                let otherQualifiers = true;

                if (keyword.room != null) {
                    if (response.room != keyword.room) {
                        otherQualifiers = false;
                    }
                }

                if (keyword.station != null) {
                    if (response.station != keyword.station) {
                        otherQualifiers = false;
                    }
                }


                if (keyword.localCoordinates != null && keyword.tileSetCoordinates != null) {

                    if (response.localCoordinates[0] != keyword.localCoordinates[0] ||
                        response.localCoordinates[1] != keyword.localCoordinates[1] ||
                        response.tileSetCoordinates[0] != keyword.tileSetCoordinates[0] ||
                        response.tileSetCoordinates[1] != keyword.tileSetCoordinates[1]) {
                        otherQualifiers = false;
                    }
                }

                if (response.clearanceLevel >= clearanceReq && otherQualifiers == true) {
                    const keywordSet = keyword.keyword;

                    // Check if any of the keywords are contained in the input string (case-insensitive)
                    const isKeywordFound = keywordSet.some((keyword) =>
                        inputString.toLowerCase() === keyword.toLowerCase()
                    );

                    if (isKeywordFound) {
                        // Keyword is found. Check if we've already unlocked it.
                        if (response.keywords.includes(key)) {
                            response.terminalMessages.push("You've already entered this keycode.");
                            return response;
                        } else {
                            response.keywords.push(key);
                            response.terminalMessages.push(Keywords.keywordList[key].message);
                            return response;
                        }

                    }
                }
            }
        }

        if (response.context != 'room') {
            response.terminalMessages.push("Error: Did not recognize command.");
        }

        return response;
    },
    addCoreKeywords: function (response) {
        for (const key in Keywords.keywordList) {

            if (Keywords.keywordList.hasOwnProperty(key)) {

                const clearanceReq = Keywords.keywordList[key].clearanceLevel;

                let coreKeyword = false;

                if (Keywords.keywordList[key].coreKeyword != null) {
                    coreKeyword = Keywords.keywordList[key].coreKeyword;
                }

                if (response.clearanceLevel > clearanceReq && coreKeyword == true) {
                    // Keyword is found. Check if we've already unlocked it.
                    if (!response.keywords.includes(key)) {
                        response.keywords.push(key);
                    }
                }
            }
        }

        return response;
    },

    checkSpecialKeywords: function (response) {

        // CHAPTER 3
        if (response.clearanceLevel == 2) {
            const itemsToCheck = ['attack-ai', 'final-transmission', 'disarmingly', 'encrypted-messages'];

            const matchingItems = itemsToCheck.filter(item => response.keywords.includes(item));

            if (matchingItems.length >= 3) {
                if (!response.keywords.includes('chapter-3-finished')){
                    response.keywords.push('chapter-3-finished');
                    response.terminalMessages.push(newMessage);
                }
            }
        }

        // CHAPTER 4
        if (response.clearanceLevel == 3) {

            if (response.keywords.includes('glyph-a7x9a', 'glyph-9av3n', 'glyph-mav831', 'glyph-76ca1')) {
                if (!response.keywords.includes('moro-probes')){
                    response.keywords.push('moro-probes');
                    response.terminalMessages.push('You\'ve located all 4 of Moro Mada\'s probes. Return to her ship.');
                }

            }
        }
        if (response.clearanceLevel == 3) {
            const itemsToCheck = ['crumpled', 'reveal', 'go-back', 'good-game'];

            const matchingItems = itemsToCheck.filter(item => response.keywords.includes(item));

            if (matchingItems.length >= 4) {
                if (!response.keywords.includes('chapter-4-finished')){
                    response.keywords.push('chapter-4-finished');
                    response.terminalMessages.push(newMessage);
                }
            }
        }

        return response;
    },

    keywordList: {
        // FACTIONS
        'sorelia': {
            keyword: ['sorelia'],
            clearanceLevel: -1,
            message: newFile,
        },
        'komek': {
            keyword: ['komek'],
            clearanceLevel: -1,
            message: newFile,
        },
        'magnomi': {
            keyword: ['magnomi'],
            clearanceLevel: -1,
            message: newFile,
        },
        'henko': {
            keyword: ['henko'],
            clearanceLevel: -1,
            message: newFile,
        },
        'ventus': {
            keyword: ['ventus'],
            clearanceLevel: -1,
            message: newFile,
        },
        'ua': {
            keyword: ['ua', 'utopian alliance'],
            clearanceLevel: -1,
            message: newFile,
        },
        // BLUEPRINTS
        'sheath': {
            keyword: ['sheath'],
            clearanceLevel: -1,
            message: newFile,
        },
        'entangle': {
            keyword: ['entangle'],
            clearanceLevel: -1,
            message: newFile,
        },
        'safeguard': {
            keyword: ['safeguard'],
            clearanceLevel: -1,
            message: newFile,
        },
        'razor': {
            keyword: ['razor'],
            clearanceLevel: -1,
            message: newFile,
        },
        // CLEARANCE 0
        'critical': {
            keyword: ['critical'],
            clearanceLevel: 0,
            message: newMessage,
            coreKeyword: true
        },
        'investigation': {
            keyword: ['investigation'],
            clearanceLevel: 0,
            message: newMessage,
            coreKeyword: true
        },
        'ambassador': {
            keyword: ['ambassador'],
            clearanceLevel: 0,
            message: newMessage,
            coreKeyword: true
        },
        'miu': {
            keyword: ['miu', 'm.i.u.'],
            clearanceLevel: 0,
            message: newMessage,
            coreKeyword: true
        },
        'lattice': {
            keyword: ['lattice', 'shield'],
            clearanceLevel: 0,
            message: newMessage,
            coreKeyword: true
        },
        'shroud': {
            keyword: ['shroud'],
            clearanceLevel: 0,
            message: newMessage,
            coreKeyword: true
        },
        'trouble': {
            keyword: ['trouble'],
            clearanceLevel: 0,
            message: newMessage,
            coreKeyword: true
        },
        'killed': {
            keyword: ['killed'],
            clearanceLevel: 0,
            message: newMessage,
            coreKeyword: true
        },
        'terrible': {
            keyword: ['terrible'],
            clearanceLevel: 0,
            message: newTavernCharacter,
            coreKeyword: true
        },
        'confide': {
            keyword: ['confide'],
            clearanceLevel: 0,
            message: newMessage,
        },
        'ciphers': {
            keyword: ['ciphers'],
            clearanceLevel: 0,
            message: newMessage,
        },
        // CLEARANCE 1
        'director': {
            keyword: ['director'],
            clearanceLevel: 1,
            message: newMessage,
            coreKeyword: true
        },
        'under threat': {
            keyword: ['under threat', 'under-threat', 'underthreat'],
            clearanceLevel: 1,
            message: newMessage,
            coreKeyword: true
        },
        'note': {
            keyword: ['note'],
            clearanceLevel: 1,
            message: 'You examine the handwritten note, and make a scan for your records.<br>' + newMessage,
            coreKeyword: true
        },
        'schematics': {
            keyword: ['schematics'],
            clearanceLevel: 1,
            message: 'You look through the schematics. Looks like a shield device of some kind, but it\'s MASSIVE. Hopefuly Meg\'s notes will shed some light.<br>' + newFile,
            coreKeyword: true
        },
        'sartoc': {
            keyword: ['sartoc'],
            clearanceLevel: 1,
            message: 'You examine the bottle, and make a note for your records.<br>' + newFile,
            //coreKeyword: true
        },
        'economic': {
            keyword: ['economic'],
            clearanceLevel: 1,
            message: 'Amidst the spreadsheets, you find a message and forward it to yourself. The message\'s data signature appears to be Sorelian in origin.<br>' + newMessage,
            coreKeyword: true
        },
        'prospect': {
            keyword: ['prospect'],
            clearanceLevel: 1,
            message: newMessage,
            coreKeyword: true
        },
        'straight': {
            keyword: ['straight'],
            clearanceLevel: 1,
            message: newMessage,
            coreKeyword: true
        },
        'extreme': {
            keyword: ['extreme'],
            clearanceLevel: 1,
            message: newMessage,
            coreKeyword: true
        },
        'misdeeds': {
            keyword: ['misdeeds'],
            clearanceLevel: 1,
            message: newMessage,
            coreKeyword: true
        },
        'spill over': {
            keyword: ['spill over', 'spill', 'spill-over', 'spillover'],
            clearanceLevel: 1,
            message: newMessage,
            coreKeyword: true
        },
        'casualty': {
            keyword: ['casualty'],
            clearanceLevel: 1,
            message: newMessage,
            coreKeyword: true
        },
        'postulate': {
            keyword: ['postulate', 'divulge'],
            clearanceLevel: 1,
            message: newMessage,
            coreKeyword: true
        },
        'informant': {
            keyword: ['informant'],
            clearanceLevel: 1,
            message: newAudioFile,
            coreKeyword: true
        },
        'war': {
            keyword: ['war'],
            clearanceLevel: 1,
            message: newAudioFile,
            coreKeyword: true
        },
        'classified': {
            keyword: ['classified'],
            clearanceLevel: 1,
            message: newAudioFile,
            coreKeyword: true
        },
        'unmask': {
            keyword: ['unmask'],
            clearanceLevel: 1,
            message: newMessage,
            coreKeyword: true
        },
        // EXTRA MEG MESSAGE ON SOCIALS 5/20
        'skeleton': {
            keyword: ['skeleton'],
            clearanceLevel: 0,
            message: newAudioFile,
        },
        // Extra Meg room audio files
        'bite': {
            keyword: ['bite'],
            clearanceLevel: 1,
            message: newAudioFile,
            room: 'megs-quarters',
        },
        'backbone': {
            keyword: ['backbone'],
            clearanceLevel: 1,
            message: newAudioFile,
            room: 'megs-quarters',
        },
        'datastick': {
            keyword: ['datastick'],
            clearanceLevel: 1,
            message: newAudioFile,
            room: 'megs-quarters',
        },
        'follow-the-money': {
            keyword: ['follow the money', '"follow the money"'],
            clearanceLevel: 1,
            message: newAudioFile,
            room: 'megs-quarters',
        },

        // CLEARANCE 2
        'mechanisms': {
            keyword: ['mechanisms'],
            clearanceLevel: 2,
            message: newFile,
            room: 'hangar',
            coreKeyword: true
        },
        'control-room': {
            keyword: ['control room', 'control-room'],
            clearanceLevel: 2,
            message: newFile,
            room: 'hangar',
            coreKeyword: true
        },
        'detail': {
            keyword: ['detail'],
            clearanceLevel: 2,
            message: newAudioFile,
            room: 'megs-quarters',
            coreKeyword: true
        },
        'darkness': {
            keyword: ['darkness'],
            clearanceLevel: 2,
            message: newAudioFile,
            room: 'administrative-offices',
            coreKeyword: true
        },
        // Derelict Ship
        'signal': {
            keyword: ['signal'],
            clearanceLevel: 2,
            message: 'As you signal the control room, they open up the blast door in front of your ship. You\'re ready to depart.',
            room: 'hangar',
            coreKeyword: true
        },
        'ghost-ship': {
            keyword: ['ghost ship', 'ghost'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'opposite': {
            keyword: ['opposite'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'flicker': {
            keyword: ['flicker'],
            clearanceLevel: 2,
            message: newFile,
        },
        'terminal': {
            keyword: ['terminal'],
            clearanceLevel: 2,
            message: newMessage,
        },
        'pilots-chair': {
            keyword: ['pilots chair', 'pilot\'s chair'],
            clearanceLevel: 2,
            room: 'derelict-ship',
            message: newAudioFile,
        },
        'payloads': {
            keyword: ['payloads', 'payload'],
            clearanceLevel: 2,
            message: newFile,
        },
        'attack-ai': {
            keyword: ['attack ai'],
            clearanceLevel: 2,
            message: newFile,
        },
        'bunks': {
            keyword: ['bunks'],
            clearanceLevel: 2,
            message: newFile,
        },
        'bedding': {
            keyword: ['bedding'],
            clearanceLevel: 2,
            message: newFile,
        },
        // Unkown Probe
        'shadow': {
            keyword: ['shadow'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'grievances': {
            keyword: ['grievances'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'encrypted-messages': {
            keyword: ['encrypted messages', 'encrypted-message'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'intelligence': {
            keyword: ['intelligence'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'veiled': {
            keyword: ['veiled'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'walk': {
            keyword: ['walk'],
            clearanceLevel: 2,
            message: newFile,
            coreKeyword: true
        },
        'frightened': {
            keyword: ['frightened'],
            clearanceLevel: 2,
            message: newAudioFile,
            coreKeyword: true,
            room: 'unknown-probe'
        },
        'unassuming': {
            keyword: ['unassuming'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'disarmingly': {
            keyword: ['disarmingly'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'archaic': {
            keyword: ['archaic'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'final-transmission': {
            keyword: ['final transmission'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'suspicion': {
            keyword: ['suspicion'],
            clearanceLevel: 2,
            message: newMessage + '<br>' + newAudioFile,
            coreKeyword: true
        },
        '011235': {
            keyword: ['011235'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        'chapter-3-finished': {
            keyword: ['chapter-3-finished-481238u924'],
            clearanceLevel: 2,
            message: newMessage,
            coreKeyword: true
        },
        // CHAPTER 4
        'falling': {
            keyword: ['falling'],
            clearanceLevel: 3,
            message: 'From the darkness... something calls to you. Type [awake] to continue.',
            coreKeyword: true
        },
        'brig': {
            keyword: ['brig'],
            clearanceLevel: 3,
            message: newAudioFile,
            coreKeyword: true
        },
        'servitors': {
            keyword: ['servitors'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'lynna-tragel': {
            keyword: ['lynna tragel', 'lynna'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'blind': {
            keyword: ['blind'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'documented': {
            keyword: ['documented'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'occupied': {
            keyword: ['occupied'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'rest': {
            keyword: ['rest'],
            clearanceLevel: 3,
            message: 'You close your eyes and drift back to sleep. When you awake, the chair Bill had occupied is empty.',
            coreKeyword: true
        },
        'timeframe': {
            keyword: ['timeframe'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'scratching': {
            keyword: ['scratching'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'glowers': {
            keyword: ['glowers'],
            clearanceLevel: 3,
            message: newFile,
            coreKeyword: true
        },
        'assault-carrier': {
            keyword: ['assault carrier'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'voluminous': {
            keyword: ['voluminous'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'eccentricities': {
            keyword: ['eccentricities'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'crumpled': {
            keyword: ['crumpled'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'go-back': {
            keyword: ['go-back'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'tactical-suit': {
            keyword: ['tactical suit'],
            clearanceLevel: 3,
            message: 'Someone has entered the room.',
            coreKeyword: true
        },
        // Probe Ventus 
        'glyph-a7x9a': {
            keyword: ['glyph-a7x9a', 'glyph a7x9a', '[glyph-a7x9a]'],
            clearanceLevel: 3,
            message: moroProbe + '<br>The probe transmits encrypted files to your Sorelian datastick, along with the response code: [2]<br><br>In addition to the file, you are given an OMEGA CLEARANCE KEY: <h>PROBE-ALPHA-15B9</h>',
            coreKeyword: false
        },
        // Probe Magnomi
        'glyph-9av3n': {
            keyword: ['glyph-9av3n', 'glyph 9av3n', '[glyph-9av3n]'],
            clearanceLevel: 3,
            message: moroProbe + '<br>The probe transmits encrypted files to your Sorelian datastick, along with the response code: [3]<br><br>In addition to the file, you are given an OMEGA CLEARANCE KEY: <h>PROBE-BETA-XM45</h>',
            coreKeyword: false
        },
        // Probe Henko
        'glyph-mav831': {
            keyword: ['glyph-mav831', 'glyph mav831', '[glyph-mav831]'],
            clearanceLevel: 3,
            message: moroProbe + '<br>The probe transmits encrypted files to your Sorelian datastick, along with the response code: [5]<br><br>In addition to the file, you are given an OMEGA CLEARANCE KEY: <h>PROBE-CHARLIE-9XRTZ</h>',
            coreKeyword: false
        },
        // Probe Komek
        'glyph-76cal1': {
            keyword: ['glyph-76cal1', 'glyph 76cal1', '[glyph-76cal1]'],
            clearanceLevel: 3,
            message: moroProbe + '<br>The probe transmits encrypted files to your Sorelian datastick, along with the response code: [7]<br><br>In addition to the file, you are given an OMEGA CLEARANCE KEY: <h>PROBE-OMEGA-ZP3F</h>',
            coreKeyword: false
        },
        'moro-probes': {
            keyword: ['moro-probes-bariuefajefiiah'],
            clearanceLevel: 3,
            message: '',
            coreKeyword: false
        },
        'beetle': {
            keyword: ['beetle'],
            clearanceLevel: 3,
            message: 'Someone has entered your cargo hold.',
            coreKeyword: true
        },
        'bye-oleg': {
            keyword: ['bye-oleg-agrjaef'],
            clearanceLevel: 3,
            message: '',
            coreKeyword: true
        },
        'bye-kinta': {
            keyword: ['bye-kinta-lkasdfjk'],
            clearanceLevel: 3,
            message: '',
            coreKeyword: true
        },
        'reveal': {
            keyword: ['reveal-3941340'],
            clearanceLevel: 3,
            message: '',
            coreKeyword: true
        },
        'crumpled': {
            keyword: ['crumpled-1249'],
            clearanceLevel: 3,
            message: '',
            coreKeyword: true
        },
        'chapter-4-finished': {
            keyword: ['chapter-4-finished-41faf89'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'disservice': {
            keyword: ['disservice'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'napping': {
            keyword: ['napping'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'polymer': {
            keyword: ['polymer'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'intact': {
            keyword: ['intact'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'hums': {
            keyword: ['hums'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'bye-linus': {
            keyword: ['bye-linus'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        'good-game': {
            keyword: ['good-game'],
            clearanceLevel: 3,
            message: newMessage,
            coreKeyword: true
        },
        // FINAL CHAPTER
        'kill-bill': {
            keyword: ['kill-bill'],
            clearanceLevel: 4,
            message: '',
            coreKeyword: true
        },
        'sightless': {
            keyword: ['sightless'],
            clearanceLevel: 4,
            message: newAudioFile,
            coreKeyword: true
        },
        'not-yet': {
            keyword: ['not yet'],
            clearanceLevel: 4,
            message: newAudioFile,
            coreKeyword: true
        },
        'story': {
            keyword: ['story'],
            clearanceLevel: 4,
            message: newAudioFile,
            coreKeyword: true
        },
        'ua-wins': {
            keyword: ['ua wins'],
            clearanceLevel: 4,
            message: newAudioFile,
            coreKeyword: true
        },
        'soul': {
            keyword: ['soul'],
            clearanceLevel: 4,
            message: newAudioFile,
            coreKeyword: true
        },
        'appetite': {
            keyword: ['appetite'],
            clearanceLevel: 4,
            message: newAudioFile,
            coreKeyword: true
        },
        'everything': {
            keyword: ['everything'],
            clearanceLevel: 4,
            message: newAudioFile,
            coreKeyword: true
        },
        'expulsion': {
            keyword: ['expulsion'],
            clearanceLevel: 4,
            message: newAudioFile,
            coreKeyword: true
        },
        'dreamed': {
            keyword: ['dreamed'],
            clearanceLevel: 4,
            message: newAudioFile,
            coreKeyword: true
        },
        'born': {
            keyword: ['born'],
            clearanceLevel: 4,
            message: newAudioFile,
            coreKeyword: true
        },
        'fallen': {
            keyword: ['fallen'],
            clearanceLevel: 4,
            message: newAudioFile,
            coreKeyword: true
        },
        'more': {
            keyword: ['more'],
            clearanceLevel: 4,
            message: newMessage,
            coreKeyword: true
        },
        'fragment': {
            keyword: ['fragment'],
            clearanceLevel: 4,
            message: newFile,
        },
        'satisfied': {
            keyword: ['satisfied'],
            clearanceLevel: 4,
            message: newFile,
        },
        'insider-b7x': {
            keyword: ['insider-b7x', 'insider-87x'],
            clearanceLevel: 4,
            message: newFile,
        },
        'chimes': {
            keyword: ['chimes-4j15n3kiga'],
            clearanceLevel: 4,
            message: newFile,
        },
        'dae-arum': {
            keyword: ['dae-arum-1248r5'],
            clearanceLevel: 4,
            message: newFile,
        },
        'bill-final': {
            keyword: ['bill-final-adkjgeafj'],
            clearanceLevel: 4,
            message: newFile,
        },
        // TESTING DELETE LATER
        'testing': {
            keyword: ['testing'],
            clearanceLevel: 1,
            message: newAudioFile,
            localCoordinates: [4, 5],
            tileSetCoordinates: [0, 0],
        },
        // EMAILED CODE on JUNE 20
        'amethyst': {
            keyword: ['amethyst'],
            clearanceLevel: 0,
            message: newAudioFile,
        },

        // KEYCARDS
        'covenant-a931y': {
            // AUSTIN TOOK TO ORIGINS
            keyword: ['covenant-a931y', 'covenant a931y'],
            clearanceLevel: 0,
            message: newFile,
        },
        'vendetta-u9nvx': {
            // AUSTIN TOOK TO ORIGINS
            keyword: ['vendetta-u9nvx', 'vendetta u9nvx'],
            clearanceLevel: 0,
            message: newFile,
        },
        'sleeper-9xfab': {
            // AUSTIN TOOK TO ORIGINS
            keyword: ['sleeper-9xfab', 'sleeper 9xfab'],
            clearanceLevel: 0,
            message: newAudioFile,
        },
        'isolated-7cd8r': {
            // AUSTIN TOOK TO ORIGINS
            keyword: ['isolated-7cd8r', 'isolated 7cd8r'],
            clearanceLevel: 0,
            message: newAudioFile,
        },

        'judge': { // UA TRADE AGREEMENT
            keyword: ['judge'],
            clearanceLevel: 0,
            message: '4 new files have been added to your database.',
        },

        'heathens': { // UA WARSHIP
            keyword: ['heathens'],
            clearanceLevel: 0,
            message: '3 new files have been added to your database.',
        },
        'chlorine': { // FLASH
            keyword: ['chlorine'],
            clearanceLevel: 0,
            message: newMessage,
        },
        'goner': { // CLOAKING DEVICE
            keyword: ['goner'],
            clearanceLevel: 0,
            message: newFile,
        },
        'regional': { // GATLING LASER
            keyword: ['regional'],
            clearanceLevel: 0,
            message: newFile,
        },
        'polarize': { // DAUNTLESS
            keyword: ['polarize'],
            clearanceLevel: 0,
            message: newFile,
        },
        'venom-8w33k': { // The FLASH UNLOCK singularity-4d29s
            keyword: ['venom-8w33k'],
            clearanceLevel: 0,
            message: newFile,
        },
        'singularity-4k29s': { // The DAUNTLESS UNLOCK
            keyword: ['singularity-4k29s'],
            clearanceLevel: 0,
            message: newFile,
        },
        'scorpion-8p22b': { // The CLOAKING DEVICE UNLOCK
            keyword: ['scorpion-8p22b'],
            clearanceLevel: 0,
            message: newFile,
        },
        'defense-9bnw6': { // The Gatling Laser UNLOCK
            keyword: ['defense-9bnw6'],
            clearanceLevel: 0,
            message: newFile,
        },
        'raven-5r87d': { // UA WARSHIP 2 UNLOCK galaxy-9m45e
            keyword: ['raven-5r87d'],
            clearanceLevel: 0,
            message: newFile,
        },
        'galaxy-9m45e': { // UA WARSHIP 3 UNLOCK galaxy-9m45e horizon-2n78a
            keyword: ['galaxy-9m45e'],
            clearanceLevel: 0,
            message: newFile,
        },
        'horizon-2n78a': { // UA WARSHIP 4 UNLOCK horizon-2n78a
            keyword: ['horizon-2n78a'],
            clearanceLevel: 0,
            message: newFile,
        },
        'sentinel-9z82j': { // UA BLUEPRINT 1 UNLOCK
            keyword: ['sentinel-9z82j'],
            clearanceLevel: 0,
            message: newFile,
        },
        'shadow-4x29l': { // UA BLUEPRINT 2 UNLOCK
            keyword: ['shadow-4x29l'],
            clearanceLevel: 0,
            message: newFile,
        },
        'ghost-7y16p': { // UA BLUEPRINT 3 UNLOCK
            keyword: ['ghost-7y16p'],
            clearanceLevel: 0,
            message: newFile,
        },
        'nightfall-2m54h': { // UA BLUEPRINT 4 UNLOCK
            keyword: ['nightfall-2m54h'],
            clearanceLevel: 0,
            message: newFile,
        },
        'echo-p3xv': { // VENTUS 1 UNLOCK
            keyword: ['echo-p3xv'],
            clearanceLevel: 0,
            message: newFile,
        },
        'void-wsnl': { // VENTUS 2 UNLOCK
            keyword: ['void-wsnl', 'mach-kj66'],
            clearanceLevel: 0,
            message: newFile,
        },
        'zeta-m6q2': { // VENTUS 3 UNLOCK
            keyword: ['zeta-m6q2'],
            clearanceLevel: 0,
            message: newFile,
        },
        'zero-y7c3': { // VENTUS 4 UNLOCK
            keyword: ['zero-y7c3'],
            clearanceLevel: 0,
            message: newFile,
        },
        'guardian-13x8mv': { // SHIELD LATTICE FINAL
            keyword: ['guardian-13x8mv'],
            clearanceLevel: 0,
            message: newMessage,
        },
        'reliance-38q6vy': { // WARSHIP FINAL
            keyword: ['reliance-38q6vy'],
            clearanceLevel: 0,
            message: newMessage,
        },
        'victoria-52b9cz': { // TRADE AGREEMENT FINAL
            keyword: ['victoria-52b9cz'],
            clearanceLevel: 0,
            message: newMessage,
        },
        'horizons-57t9cv': { // VENTUS FINAL
            keyword: ['horizons-57t9cv'],
            clearanceLevel: 0,
            message: newMessage,
        },
        'cobra': { // THE LEECH
            keyword: ['cobra'],
            clearanceLevel: 0,
            message: newFile,
        },
        'remain': { // THE ICARUS
            keyword: ['remain'],
            clearanceLevel: 0,
            message: newFile,
        },
        'trials': { // THE ORACLE
            keyword: ['trials'],
            clearanceLevel: 0,
            message: newFile,
        },
        'sanctus': { // THE AUTOMATION
            keyword: ['sanctus'],
            clearanceLevel: 0,
            message: newFile,
        },
        'society': { // THE AUTOMATION
            keyword: ['society'],
            clearanceLevel: 0,
            message: newFile,
        },
        'overture': { // THE INITIATOR
            keyword: ['overture'],
            clearanceLevel: 0,
            message: newFile,
        },
        'implant': { // THE DECODER
            keyword: ['implant'],
            clearanceLevel: 0,
            message: newFile,
        },
        'viper-1v62f': { // THE DECODER UNLOCK
            keyword: ['viper-1v62f'],
            clearanceLevel: 0,
            message: newFile,
        },
        'eclipse-3h64v': { // THE LEECH UNLOCK
            keyword: ['eclipse-3h64v'],
            clearanceLevel: 0,
            message: newFile,
        },
        'zenith-1f47z': { // THE ICARUS UNLOCK
            keyword: ['zenith-1f47z'],
            clearanceLevel: 0,
            message: newFile,
        },
        'fusion-5g92y': { // THE ORACLE UNLOCK
            keyword: ['fusion-5g92y'],
            clearanceLevel: 0,
            message: newFile,
        },
        'dagger-6q49c': { // THE AUTOMATION UNLOCK
            keyword: ['dagger-6q49c'],
            clearanceLevel: 0,
            message: newFile,
        },
        'photon-6j81t': { // THE ARTIFACT 205-B UNLOCK
            keyword: ['photon-6j81t'],
            clearanceLevel: 0,
            message: newFile,
        },
        'exodus-3t91g': { // THE INITIATOR UNLOCK
            keyword: ['exodus-3t91g'],
            clearanceLevel: 0,
            message: newFile,
        },
        
    },
}

function checkForDuplicateKeywords() {

    let keywordSet = new Set();
    let duplicateKeywords = [];

    for (let keywordKey in Keywords.keywordList) {
        if (Keywords.keywordList.hasOwnProperty(keywordKey)) {
            let keyword = Keywords.keywordList[keywordKey];
            keyword.keyword.forEach(command => {
                if (keywordSet.has(command)) {
                    duplicateKeywords.push(command);
                    console.log('Duplicate keywords found for ' + keywordKey + " " + command);
                } else {
                    keywordSet.add(command);
                }
            });
        }
    }
}

checkForDuplicateKeywords();

module.exports = Keywords;