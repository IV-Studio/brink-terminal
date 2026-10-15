const sectionFiles = "files";
const sectionAudio = "audio logs";
const sectionPersonal = "personal notes";
const sectionMeg = "meg's terminal";
const soreliaMap = "map to sorelia";


const Database = {
    getAvailableEntries: function (response) {
        const files = Database.fileList;

        const availableFiles = {};

        // FILES

        // Loop through each message in the message list
        for (const key in files) {
            if (files.hasOwnProperty(key)) {
                const file = files[key];

                // Check if the user's clearance level is high enough
                const hasClearance =
                    response.clearanceLevel >= file.minimumClearanceLevel;

                const hasKeywords =
                    file.requiredKeywords.every((keyword) =>
                        response.keywords.includes(keyword)
                    );

                if (hasClearance && hasKeywords) {
                    // If both conditions are met, add the message to the available list
                    const fileObject = createFileObject(key, file, response)
                    availableFiles[key] = fileObject;
                }
            }
        }

        response.files = availableFiles;

        // CHARACTERS

        const availableCharacters = {};

        const characters = Database.characterList;

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

                if (hasClearance && hasKeywords) {
                    // If both conditions are met, add the message to the available list
                    const characterObject = createCharacterObject(key, character, response)
                    availableCharacters[key] = characterObject;
                }
            }
        }

        response.characterFiles = availableCharacters;

        return response;
    },

    fileList: {
        'Sorelia': {
            requiredKeywords: ['sorelia'],
            minimumClearanceLevel: -1,
            name: 'Sorelia_Faction-Brief_01b.pdx',
            section: sectionFiles,
            filetype: 'Document',
            img: 'https://ucarecdn.com/51583e85-03f6-4616-8c4f-17c8b859eb7c/Sorelia4x.png',
            body: function (response) {
                let returnString = 'A secretive group who some would label as isolationist while others might claim they were intrusive. Sorelians always seem to operative individually when outside of their mine-laden asteroid field, but they maintain ambassadorial postings at almost every location of significance within the Moonraker collective.';
                if (response.clearanceLevel >= 1) {
                    returnString = returnString + '<br><br><hr>Meg Gallak appears to be both the Sorelian ambassador on the station as well as a sleeper agent with other agendas. From what I can gather, this is not abnormal for Sorelian personnel and confirms most faction suspicions that Sorelians are up to something.<br><br>They live like life is as treacherous as the minefield in which they live.'
                }
                if (response.clearanceLevel >= 3) {
                    returnString = returnString + '<br><br><hr>Sorelia has their hands firmly entangled in many enterprises across the Moonraker factions.<br><br>' +
                    'Meg was dealing with Ventus representatives to secure advanced thruster technology, but that appears to be just <h>scratching</h> the surface.<br><br>' +
                    'Lynna Tragel is making me second-guess everything at this point. Maybe Sorelia doesn\'t have the best interests of all Moonrakers at heart.'
                }
                
                return returnString;
            }
        },
        'Henko': {
            requiredKeywords: ['henko'],
            minimumClearanceLevel: -1,
            name: 'Henko_Faction-Brief_91n.pdx',
            section: sectionFiles,
            filetype: 'Document',
            img: 'https://ucarecdn.com/31d03541-2c85-41d5-bc7f-9113a4cabafd/Henko4x.png',
            body: function (response) {
                let returnString = 'Out of all of the Moonraker factions, Henko is the most devoted to the collective. With a robust trade network established and an emphasis placed on defensive measures, Henko focuses on protecting ships, planets, and people.<br><br>The five moons of Korath are as hazardous as they come, but the Henko have endured adversity to make a home there.';
                if (response.clearanceLevel >= 1) {
                    returnString = returnString + '<br><br><hr>Project Lattice feels like the culmination of years of work from the Henko. But with great power comes an enormous target on your back, and I\'m worried that Reiner Station isn\'t prepared for that.<br><br>Henko isn\'t prepared for that.<br><br>The Moonraker factions will have to work together at a time when they\'ve never been farther apart.'
                }
                if (response.clearanceLevel >= 3) {
                    returnString = returnString + '<br><br><hr>Project Lattice is more important than ever. If saboteurs and other instigators are trying to compromise it, then there is no time like the present to finish the work.<br><br>' +
                    'With all that\'s happened between Linus Farno and Lynna Tragel, though, how secure is Henko?<br><br>' +
                    'How secure is the MIU? And who can I trust?'
                }
                return returnString;
            }
        },
        'Komek': {
            requiredKeywords: ['komek'],
            minimumClearanceLevel: -1,
            name: 'Komek_Faction-Brief_NB3.pdx',
            section: sectionFiles,
            filetype: 'Document',
            img: 'https://ucarecdn.com/cd63f954-978d-426b-ac46-f66ea227fdd7/Komek4x.png',
            body: function (response) {
                let returnString = 'The Komek are known for their reactor technology, close proximity to UA space, and secondary market for power reserves. They are believed to maintain an unofficial cease-fire with the UA.<br><br>Residing on Primis Minor, a moon orbiting the second innermost planet in the solar system, the Komek harvests solar power and rely on all other factions needing their power reserves.';
                if (response.clearanceLevel >= 1) {
                    returnString = returnString + '<br><br><hr>The power of a star at their fingertips. The UA hovering uncomfortably close.<br><br>' +
                        'I\'m not sure the benefits outweigh the drawbacks. I\'ve never had an affinity for numbers, but it will be necessary to peel back the layers of this labyrinthine economic empire. My eyes will bleed spreadsheets by the time I\'m done.<br><br>' +
                        'First problem: I know practically no Komeks.';
                }
                if (response.clearanceLevel >= 3) {
                    returnString = returnString + '<br><br><hr>You never think about how essential power is until you\'re faced with the prospect of losing it or with your rivals gaining more than you.<br><br>' +
                    'I need to find Finneal Lee and figure out what\'s going on. It\'s one thing if Komek is selling energy reserves to the UA for profit. It\'s upsetting, but it\'s understandable. It\'s something more sinister if they\'re willingly funding a war machine, though. The decimated ship remains you discovered recently aren\'t encouraging.<br><br>' +
                    'Ships are only as good as the parts that keep them running. And reactors are pretty damn essential.';
                }
                return returnString;
            }
        },
        'Magnomi': {
            requiredKeywords: ['magnomi'],
            minimumClearanceLevel: -1,
            name: 'Magnomi_Faction-Brief_72X.pdx',
            section: sectionFiles,
            filetype: 'Document',
            img: 'https://ucarecdn.com/f3d4fa9e-a8a7-48b2-8cc2-ec63635df89a/Magnomi4x.png',
            body: function (response) {
                let returnString = 'The Magnomi are a militaristic group. They specialize in developing weapons technology and attack UA ships on sight. Easily the most aggressive faction of the Moonrakers.<br><br>They reside in the Sartoc asteroid belt. While it is resource-scarce, only smaller ships and highly skilled pilots can navigate the Sartoc belt without being battered into a thousand pieces, making it a safe haven from the UA.';
                if (response.clearanceLevel >= 1) {
                    returnString = returnString + '<br><br><hr>There are two ways to wage war. One group fights to ensure that future generations can live to never experience war. The other fights to maintain the status quo because they don\'t know any other life and they fear the unknown.<br><br>' +
                        'Magnomi is divided between those two philosophies. And I\'m not sure which one is winning.';
                }

                if (response.clearanceLevel >= 3) {
                    returnString = returnString + '<br><br><hr>We\'ve received word of a new Magnomi cell. They\'ve been accused of attacking Moonraker convoys and resorting to base piracy and terroristic violence. It\'s unclear whether this is a natural progression of the leadership from individuals like Kary Powalk or yet another evolution of Magnomi politics.' +
                    'No matter who is leading them, I need to watch myself out there. No matter how basic the ship is, parts are parts. It wouldn\'t do to be jettisoned into the vacuum of space.' +
                    'If I can find out more about these "marauders", that would be helpful.';
                }
                return returnString;
            }
        },
        'Ventus': {
            requiredKeywords: ['ventus'],
            minimumClearanceLevel: -1,
            name: 'Ventus_Faction-Brief_8Va.pdx',
            section: sectionFiles,
            filetype: 'Document',
            img: 'https://ucarecdn.com/8fdeead8-6b78-47f9-89c7-7fbc86dc1409/Ventus4x.png',
            body: function (response) {
                let returnString = 'The Ventus dedicate all of their resources to advancing thruster technology and research. Their ship engines are second to none, which helps them to steer clear of UA patrols as well as other Moonraker factions.<br><br>The small city of Queens Port and the repurposed UA mining vessel parked next to it contain the majority of the Ventus population, but few traders are granted access. The moon where they live remains unnamed as the Ventus claim they are waiting for a new home in the stars when their exploratory probes return.';
                if (response.clearanceLevel >= 1) {
                    returnString = returnString + '<br><br><hr>Sometimes the most reserved are the ones who have the most to say. I feel like the Ventus have information that I\'ll need before this is all over.<br><br>' +
                        'When a Ventus is around, I should pay attention. Because they\'ll likely try to scurry off before I can question them. It\'s appropriate, though. The ones with the fastest engines don\'t like slowing down for the rest of us.';
                }
                if (response.clearanceLevel >= 3) {
                    returnString = returnString + '<br><br><hr>We need to reinvigorate our relationship with Ventus. They may be focused on developing their long-range probes and are looking into distant space, but trouble is brewing.<br><br>' +
                    'If the Magnomi drag us kicking and screaming into a war or if the Utopian Alliance preempts them and ignites a new era of conflict on their own, we\'ll need all the help we can get.<br><br>' +
                    'Isolationists, warmongerers, turtle shells, energy siphons, and the mystery flavors of Sorelia. Individually, each Moonraker faction can be overpowered. If we can manage to work together, though...';
                }
                return returnString;
            }
        },
        'UA': {
            requiredKeywords: ['ua'],
            minimumClearanceLevel: -1,
            name: 'Utopian-Alliance-Brief_71Nb.pdx',
            section: sectionFiles,
            filetype: 'Document',
            img: 'https://ucarecdn.com/8b1ab58d-29fe-492b-a1ea-993100e212ee/UA4x.png',
            body: function (response) {
                let returnString = 'Error: This entry has been corrupted';
                if (response.clearanceLevel >= 1) {
                    returnString = returnString + '<br><br><hr>The Utopian Alliance is active and dangerous. They\'ve likely infiltrated Moonraker space. The more pertinent question is what they haven\'t contaminated rather than what they have.<br><br>' +
                        'Faction politics is tricky enough without an extra player meddling with our affairs. If the UA has its hands in any pockets on Reiner Station, I need to have eyes in the back of my head.<br><br>' +
                        'And a weapon sounds good. Where can I requisition a weapon?';
                }
                if (response.clearanceLevel >= 3) {
                    returnString = returnString + '<br><br><hr>Something weighs on your mind about the inspection of Lynna Tragel\'s body.<br><br>' +
                    'You\'ve been thinking a lot about Meg lately, as well...';
                }
                return returnString;
            }
        },
        // CHAPTER 2
        'chapter-2-starting-note': {
            requiredKeywords: [],
            minimumClearanceLevel: 1,
            name: 'Investigation to Date .1',
            section: sectionPersonal,
            filetype: 'Personal Note',
            body: '<li>Bill Bendo, via Directive S of the MIU, requisitioned help for his investigation</li><br><br>' +
                '<li>Meg Gallak, Sorelian ambassador to Reiner Station, was the subject of the investigation</li><br><br>' +
                '<li>Her predecessor, Ark Tii, died unexpectedly... and in what we know now to be suspicious circumstances</li><br><br>' +
                '<li>A pre-established relationship with Meg Gallak now lends context to the investigation and her goings-on at the station</li><br><br>' +
                '<li>Before I could meet with Meg Gallak, she was killed. The strange part, though, is that she knew it was coming</li><br><br>' +
                '<li>This might relate in some way to Project Lattice here on Reiner Station</li><br><br>' +
                '<li>I\'ll need to expand my search to the station in general and start questioning people in order to learn more</li><br><br>',
        },
        'slueth-and-slurp': {
            requiredKeywords: ['sartoc'],
            minimumClearanceLevel: 1,
            name: 'Slueth and Slurp',
            section: sectionPersonal,
            filetype: 'Personal Note',
            body: 'The brandy seems expensive, but you know little about it. If anyone would know something about a rare <h>vintage</h> like this, it would be the bartender.<br><br>',
        },
        'slimy-face': {
            requiredKeywords: ['schematics'],
            minimumClearanceLevel: 1,
            name: 'slimy face',
            filetype: 'Personal Note',
            section: sectionMeg,
            body: 'Someone transmitted these schematics to a recipient outside of Henko space, conceivably outside of Moonraker space if they used a relay.<br><br>' +
                'So… that\'s not good. And I have a semi-certain guess that\'s bordering on a rock-solid assumption that wouldn\'t need much massaging to blossom into a full-blown <h>accusation</h>.<br><br>' +
                'It rhymes with <u>Farnus Lino.</u><br><br>' +
                'Looks like I\'ve got some digging to do. And by that I mean digging my fingernails into his slimy face, regardless of how vomitous that sounds.<br><br>',
        },
        'project-lattice': {
            requiredKeywords: [],
            minimumClearanceLevel: 1,
            name: 'Project Lattice',
            filetype: 'Note',
            section: sectionPersonal,
            body: 'A defense system comprised of interconnected energy shields. A indefinably valuable research project that has been spearheaded by the Henko faction, staffed with what was presumed to be personnel beyond reproach.<br><br>' +
                'The former remains true. The latter... we\'re looking into.<br><br>' +
                '-B. Bendo'
        },
        // CHAPTER 3
        'chapter-3-starting-note': {
            requiredKeywords: [],
            minimumClearanceLevel: 2,
            name: 'Investigation to Date .2',
            section: sectionPersonal,
            filetype: 'Personal Note',
            body: "<li>Meg Gallak's room revealed much about the goings-on at Reiner Station and in Moonraker space beyond</li><br><br>" +
                "<li>Linus Farno is under suspicion for revealing Henko secrets, but more investigation is warranted to identify his co-conspirators</li><br><br>" +
                "<li>Ryan Rogal must be found. It is concerning that Magnomi might be behind this, but we need to know more before we can assume</li><br><br>" +
                "<li>Kinta Lar won't talk without some encouragement. If we want to figure out what Ventus is up to, it will require Oleg Ali</li><br><br>" +
                "<li>Komek seems to be in bed with the UA. That's not ideal, but more information is required if we want maximum exposure</li><br><br>" +
                "<li>Meg recorded audio files during her time here. Maybe there are more to find, and maybe others did the same</li><br><br>" +
                "<li>I'll need to travel beyond the station if I want to find all the answers to this investigation</li><br><br>"
        },
        'hangar-note-1': {
            requiredKeywords: ['mechanisms'],
            minimumClearanceLevel: 2,
            name: 'Hangar Notes .1',
            filetype: 'Personal Note',
            section: sectionPersonal,
            body: 'There are massive pieces of machinery here, designed to maintenance ships, unload and load cargo, along with any other of the myriad tasks that are required in the hangar.<br><br>' +
                'And it wouldn\'t be hard to for an accident to occur. It would be altogether too easy, actually.<br><br>' +
                'An inattentive mechanic. Faulty wiring. It wouldn\'t take much for something to go wrong, especially if it was nudged along by a helping (or hurting) hand.'
        },
        'hangar-note-2': {
            requiredKeywords: ['control-room'],
            minimumClearanceLevel: 2,
            name: 'Hangar Notes .2',
            filetype: 'Personal Note',
            section: sectionPersonal,
            body: 'It doesn\'t seem like much happens in the hangar without every step of the process being logged by someone or something in the control room.<br><br>' +
                'Between the station personnel, surveillance cameras, and any assigned AI, it would be foolish to conduct any clandestine meetings in here.<br><br>' +
                'Why had Meg wanted to meet me here?'
        },
        'derelict-ship-1': {
            requiredKeywords: ['flicker'],
            minimumClearanceLevel: 2,
            name: 'Derelict Ship .1',
            filetype: 'Personal Note',
            section: sectionPersonal,
            body: 'How long the ship has been adrift.<br><br>' +
                'You\'re no expert in ship tech, and you\'ve been on Reiner Station for... a long time?... but this seems like something from another era entirely.'
        },
        'heavy-munitions': {
            requiredKeywords: ['payloads'],
            minimumClearanceLevel: 2,
            name: 'Heavy Munitions',
            filetype: 'Personal Note',
            section: sectionPersonal,
            body: 'You\'ve set aside one of the <h>missiles</h> to bring back to Reiner Station.<br><br>' +
                'Maybe Nella or Ryle can give you more information about the weaponry. Given the number of pallets in the cargo hold, how destructive is the ship\'s payload?'
        },
        'attack-ai': {
            requiredKeywords: ['attack-ai'],
            minimumClearanceLevel: 2,
            name: 'Attack AI',
            filetype: 'Personal Note',
            section: sectionPersonal,
            body: 'Cables are jacked into the torso of this broken AI bot. And its eyes are... alight.<br><br>' +
                'You remember vividly how you almost pissed yourself when it turned to face you.'
        },
        'bunks': {
            requiredKeywords: ['bunks'],
            minimumClearanceLevel: 2,
            name: 'An Intrusive Presence',
            filetype: 'Personal Note',
            section: sectionPersonal,
            body: 'One of the bunks has been slept in recently. Crumbling personal items are pushed to the edges of the <h>bedding</h>, and the dust has been disturbed.<br><br>' +
                'Either there\'s an elusive crew member hiding in the vents or the ship has had another visitor.'
        },
        'Derelict Ship .2': {
            requiredKeywords: ['bedding'],
            minimumClearanceLevel: 2,
            name: 'Derelict Ship .2',
            filetype: 'Personal Note',
            section: sectionPersonal,
            body: 'Hidden underneath the bedding, you find a personal datapad.<br><br>' +
            'The datapad is locked and has a six-digit passkey. Nearby lies an empty bottle of brandy and a note that reads: "Fn = Fn-1 + Fn-2"'
        },
        'exosuits': {
            requiredKeywords: ['walk'],
            minimumClearanceLevel: 2,
            name: 'Exosuits',
            filetype: 'Personal Note',
            section: sectionPersonal,
            body: 'Exosuits are uncomfortable, you realize for not the first time.<br><br>' +
                'And the acknowledgement that space is not safe and it\'s rather nice to walk without protection from the environment does lend support to the narrow focus of Ventus to find a new home.<br><br>' +
                'It\'d be nice if they weren\'t so hard to talk to, though.'
        },
        // BLUEPRINTS
        // HENKO
        'Lattice-Blueprint-1': {
            requiredKeywords: ['sheath'],
            minimumClearanceLevel: -1,
            name: 'Henko-Shield-Lattice_L1_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/2301acaa-7d36-47e6-a933-4842fa4086ed/-/preview/1000x1000/',
            body: 'Congratulations, you have found 1/4 Shield Lattice Blueprints. OMEGA CLEARANCE CODE: <h>VOYEUR-251X</h>',
        },
        'Lattice-Blueprint-2': {
            requiredKeywords: ['entangle'],
            minimumClearanceLevel: -1,
            name: 'Henko-Shield-Lattice_L2_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/59a11fdb-a5cb-4ae6-a3be-1575194205f3/-/preview/1000x1000/',
            body: 'Congratulations, you have found 1/4 Shield Lattice Blueprints. OMEGA CLEARANCE CODE: <h>INDIGO-MNI5</h>',
        },
        'Lattice-Blueprint-3': {
            requiredKeywords: ['safeguard'],
            minimumClearanceLevel: -1,
            name: 'Henko-Shield-Lattice_L3_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/632870f5-38e2-41cb-80fc-3caeaeb1b6ec/ShieldLatticeBlueprints3Square.jpg',
            body: 'Congratulations, you have found 1/4 Shield Lattice Blueprints. OMEGA CLEARANCE CODE: <h>BACKSLIDE-PLA5</h>',
        },
        'Lattice-Blueprint-4': {
            requiredKeywords: ['razor'],
            minimumClearanceLevel: -1,
            name: 'Henko-Shield-Lattice_L4_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/55048e66-dcd2-4899-9527-ba2ddd635791/-/preview/1000x1000/',
            body: 'Congratulations, you have found 1/4 Shield Lattice Blueprints. OMEGA CLEARANCE CODE: <h>LAVISH-MX47</h>',
        },
        'UA-Warship-Blueprint-1': { // CARD AT ORIGINS
            requiredKeywords: ['vendetta-u9nvx'],
            minimumClearanceLevel: -1,
            name: 'UA-Warship_L1_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/dfe4cfdb-50a5-401f-9534-19ca36d0dab7/-/preview/1000x1000/',
            body: 'Congratulations, you have found 1/4 UA Warship Blueprints. OMEGA CLEARANCE CODE: <h>PALANDIN-BM3C</h>',
        },
        'UA-Warship-Blueprint-2': {
            requiredKeywords: ['raven-5r87d'],
            minimumClearanceLevel: -1,
            name: 'UA-Warship_L2_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/eb923b3a-40e6-449e-aade-2074481f4ea2/-/preview/1000x1000/',
            body: 'Congratulations, you have found 1/4 UA Warship Blueprints. OMEGA CLEARANCE CODE: <h>TRENCH-8139</h>',
        },
        'UA-Warship-Blueprint-3': {
            requiredKeywords: ['galaxy-9m45e'],
            minimumClearanceLevel: -1,
            name: 'UA-Warship_L3_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/9cd10a9a-f636-4bd6-a09a-771eca6c11a2/-/preview/1000x1000/',
            body: 'Congratulations, you have found 1/4 UA Warship Blueprints. OMEGA CLEARANCE CODE: <h>CHLORINE-BM3X</h>',
        },
        'UA-Warship-Blueprint-4': {
            requiredKeywords: ['horizon-2n78a'],
            minimumClearanceLevel: -1,
            name: 'UA-Warship_L4_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/2a827ed1-45b5-4cd6-8931-427afe772ca5/-/preview/1000x1000/',
            body: 'Congratulations, you have found 1/4 UA Warship Blueprints. OMEGA CLEARANCE CODE: <h>LEGEND-M333</h>',
        },
        'Komek-Trade-Agreement-1': { // ORIGINS KEYCARD
            requiredKeywords: ['sentinel-9z82j'],
            minimumClearanceLevel: -1,
            name: 'Komke-UA-Trade-Agreement_L1_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/719a5175-2644-4fa8-acf4-621d8ea5bc0f/-/preview/1000x1000/',
            body: 'Congratulations, you have found 1/4 Trade Agreement documents. OMEGA CLEARANCE CODE: <h>PRIDE-81BZ</h>',
        },
        'Komek-Trade-Agreement-2': {
            requiredKeywords: ['shadow-4x29l'],
            minimumClearanceLevel: -1,
            name: 'Komke-UA-Trade-Agreement_L2_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/fe2f7cdc-1521-4173-aade-fd44ffeb5b36/-/preview/1000x1000/',
            body: 'Congratulations, you have found 1/4 Trade Agreement documents. OMEGA CLEARANCE CODE: <h>CHOKER-381X</h>',
        },
        'Komek-Trade-Agreement-3': {
            requiredKeywords: ['ghost-7y16p'],
            minimumClearanceLevel: -1,
            name: 'Komke-UA-Trade-Agreement_L3_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/24bd38af-d8db-42a9-8a91-5de088a8bacb/-/preview/1000x1000/',
            body: 'Congratulations, you have found 1/4 Trade Agreement documents. OMEGA CLEARANCE CODE: <h>FORMIDABLE-BQY2</h>',
        },
        'Komek-Trade-Agreement-4': {
            requiredKeywords: ['nightfall-2m54h'],
            minimumClearanceLevel: -1,
            name: 'Komke-UA-Trade-Agreement_L4_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/069ff51b-d577-4001-858a-8f131b70669b/-/preview/1000x1000/',
            body: 'Congratulations, you have found 1/4 Trade Agreement documents. OMEGA CLEARANCE CODE: <h>RETROGRADE-MN13</h>',
        },
        // Ventus Fusion Drive
        'Ventus-Fusion-Drive-1': { // ORIGINS KEYCARD
            requiredKeywords: ['echo-p3xv'],
            minimumClearanceLevel: -1,
            name: 'Ventus-Fusion-Drive-Blueprints_L1_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/52fba877-bef9-4a05-8f0c-89d288b5d4ec/VentusBlueprintsSquare_00000.jpg',
            body: 'Congratulations, you have found 1/4 Ventus Fusion Drive Blueprints. OMEGA CLEARANCE CODE: <h>MEMORIES-73GXB</h>',
        },
        'Ventus-Fusion-Drive-2': {
            requiredKeywords: ['void-wsnl'],
            minimumClearanceLevel: -1,
            name: 'Ventus-Fusion-Drive-Blueprints_L2_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/532f1144-206e-4521-9d4e-b17d80562fa0/VentusBlueprintsSquare_00001.jpg',
            body: 'Congratulations, you have found 1/4 Ventus Fusion Drive Blueprints. OMEGA CLEARANCE CODE: <h>LIGHTNING-HPM3A</h>',
        },
        'Ventus-Fusion-Drive-3': {
            requiredKeywords: ['zeta-m6q2'],
            minimumClearanceLevel: -1,
            name: 'Ventus-Fusion-Drive-Blueprints_L3_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/27722b2a-83ea-495a-b29a-7e4848f4832e/VentusBlueprintsSquare_00002.jpg',
            body: 'Congratulations, you have found 1/4 Ventus Fusion Drive Blueprints. OMEGA CLEARANCE CODE: <h>TEMPORAL-IN6K7</h>',
        },
        'Ventus-Fusion-Drive-4': {
            requiredKeywords: ['zero-y7c3'],
            minimumClearanceLevel: -1,
            name: 'Ventus-Fusion-Drive-Blueprints_L4_TOP-SECRET.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/204bb107-d4df-4b97-ae9b-d4c831980626/VentusBlueprintsSquare_00003.jpg',
            body: 'Congratulations, you have found 1/4 Ventus Fusion Drive Blueprints. OMEGA CLEARANCE CODE: <h>FURIOUS-WE3V2</h>',
        },
        // UA
        // AUDIO FILES

        'meg-audio-informant': {
            requiredKeywords: ['informant'],
            minimumClearanceLevel: 1,
            name: 'MG-audio_log-pflp-02.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/bfdfd4b1-449c-4633-8ec8-b51610e1b002/meg_informant_v2.mp3',
            body: '',
            transcript: 'Sorelia, the many-eyed, many-horned, lying, purple schemers.<br><br>' +
                'I mean that with love. Fear, too. What if this discord is us?<br><br>' +
                'What if I\'m unwittingly an agent designed to <h>unmask</h> some larger plot?<br><br>' +
                'I know I\'m disposable. We all are, in the end, but I\'d really rather not be bait.<br><br>' +
                'Whether designed to lure out some other faction plans or some obscure Sorelian power play, it would really really suck to be bait.<br>So let\'s hope I\'m not…',
        },
        'meg-audio-war': {
            requiredKeywords: ['war'],
            minimumClearanceLevel: 1,
            name: 'MG-audio_log-mkjq-04.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/6c7b5785-6dc4-4ea2-b314-301905ede8fe/meg_war_v2.mp3',
            body: '',
            transcript: 'I\'ve got to start talking all this out or my head is going to explode.<br><br>' +
                'Sorelians are supposed to excel at compartmentalization… And yet everything is about to <h>spill over</h> and muddy the waters.<br><br>' +
                'I can\'t let that happen. For my own sanity.'
        },
        'meg-audio-classified': {
            requiredKeywords: ['classified'],
            minimumClearanceLevel: 1,
            name: 'MG-audio_log-pfla-03.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/8bf21334-252d-4faf-9ff3-a7dae6944ccf/meg_classified_v2.mp3',
            body: '',
            transcript: 'The usual suspects. Who profits? Who gains anything from poking the Sorelian bear?<br><br>' +
                'It\'s entirely possible that Ark Tii was a secondary <h>casualty</h> in some other scheme.<br><br>' +
                'I can\'t help but think Project Lattice is central to what\'s going on, though.<br><br>' +
                'Reiner Station. Current UA plans. Growing tensions between Moonraker factions. Not to mention our own plans here.<br><br>' +
                'There\'s too much at stake for me to believe in coincidence.'
        },
        'meg-audio-magnomi': {
            requiredKeywords: ['bite'],
            minimumClearanceLevel: 1,
            name: 'MG-audio_log-magnomi-04.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/6be1e3ef-ed86-49f3-a834-47cd6e3bd1dd/meg_magnomi.mp3',
            body: '',
            transcript: 'Magnomi, AKA the fighty and bitey ones. They will no doubt be mixed up in this.<br><br>' +
                'They so frequently play with their cards in the open, however. It would be surprising if they\'ve developed a measure of subtlety and deception.<br><br>' +
                'And worrisome. I\'ll have to meet with them and play dumb to assess what they\'re planning.'
        },
        'meg-audio-ventus': {
            requiredKeywords: ['datastick'],
            minimumClearanceLevel: 1,
            name: 'MG-audio_log-ventus-05.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/d6a1259e-d2c1-43ad-955a-28a35008dd6d/meg_ventus.mp3',
            body: '',
            transcript: 'Ventus, the surly wayfinders. Unless I\'m misreading things, it should be business as usual, but they have grown impatient of late.<br><br>' +
                'The undercurrent of vicious distrust and obstinacy is strong enough that Ark Tii could have been swept away.<br><br>' +
                'I must discover a means of extracting information. Maybe withholding is the path forward.'
        },
        'meg-audio-komek': {
            requiredKeywords: ['follow-the-money'],
            minimumClearanceLevel: 1,
            name: 'MG-audio_log-komek-06.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/afb5fc7d-e887-4707-9cda-51acd51f13fc/meg_komek.mp3',
            body: '',
            transcript: 'Komek, where currency is king, trade is queen, and the unholy union between the two is presided over by the UA.<br><br>' +
                'I recognize that my superiors value every connecting thread between Moonrakers and the UA.<br><br>' +
                'A wealth of information is revealed, usually without the knowledge of the parties directly involved.<br><br>' +
                'It does make me question how much we\'ve empowered the UA by letting this continue as long as we have. With regards to the Komek, I will follow the money.'
        },
        'meg-audio-henko': {
            requiredKeywords: ['backbone'],
            minimumClearanceLevel: 1,
            name: 'MG-audio_log-henko-06.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/337bb178-1bb4-47d2-8690-412051b7369b/meg_henko.mp3',
            body: '',
            transcript: 'Henko, the backbone of the Moonraker defensive measures. Soon to be the entire damn skeleton if the Lattice Shield launches without incident.<br><br>' +
                'The concern will be if a dissatisfied minority of Henko personnel ruin it for everyone else.<br><br>' +
                'A hostile splinter worming its way into the host. I\'ll prepare my scalpels and start cutting to look for problems.<br><br>' +
                'The only problem is I have no clue what to do when I find them…'
        },
        'bill-audio-vanta-sae': {
            requiredKeywords: ['detail'],
            minimumClearanceLevel: 2,
            name: 'BB-audio_log-vanta-sae-01.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/82a7faec-3c28-439a-b5ca-5be7c1e8b37a/billvantasae.mp3',
            body: '',
            transcript: 'Sometimes I think Sorelia knows more than the rest us combined. What I would give for a chance to talk face to face with Vanta Sae. Or Moro Mada. Or even Meg, for that matter. I miss her spark. Reiner Station is quieter without her.'
        },
        'bill-audio-omnitus': {
            requiredKeywords: ['darkness'],
            minimumClearanceLevel: 2,
            name: 'BB-audio_log-omnitus-04.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/80b2617f-b2c0-431c-9bc2-498bd185dd5d/billomnitus.mp3',
            body: '',
            transcript: 'What does rift-bending mean to you? Nothing good, right? It concerns me that Komek employs such a deadly individual like Omnitus. And if it has nothing to do with Meg Gallak\'s murder, then it\'s bad timing.'
        },
        'bill-audio-oleg-ali': {
            requiredKeywords: ['frightened'],
            minimumClearanceLevel: 2,
            name: 'BB-audio_log-oleg-ali-02.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/59f2c501-3989-4faf-abea-82f72e4dc6df/billolegali.mp3',
            body: '',
            transcript: 'I don\'t know what The Warden is up to, but it\'s disconcerting that Oleg Ali has been sent anywhere near Reiner Station. It could have nothing to do with us as the Ventus are almost as obtuse as the Sorelia, but it could also mean everything. I hate fumbling around in the dark..'
        },
        'bill-audio-ryan-rogal': {
            requiredKeywords: ['pilots-chair'],
            minimumClearanceLevel: 2,
            name: 'BB-audio_log-ryan-rogal-03.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/21c817e0-4624-47cd-a757-763cb1bf3c2c/billryanrogal.mp3',
            body: '',
            transcript: 'Trigger man. I hate that term. Makes it sound like problems can be solved just by pulling a trigger when more often than not they simply cause more problems. I feel guilty for not sharing details about Ryan Rogal\'s past exploits, but sometimes ignorance is the best defense when fear would so easily supplant it.'
        },
        'bill-audio-ventus': { // CARD AT ORIGINS
            requiredKeywords: ['isolated-7cd8r'],
            minimumClearanceLevel: 0,
            name: 'BB-audio_log-ventus-06.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/3bff45bf-a00e-4a3e-9ad7-214dace17b7f/billventus.mp3',
            body: '',
            transcript: 'It\'s painfully obvious that they want as little to do with the rest of us as possible, but I\'d love even a little cooperation. We were all left out in the cold void by the UA. It would be better to pool our resources rather than split into blocs of discontent spacefarers.'
        },
        'bill-audio-magnomi': {
            requiredKeywords: ['aghiefija'],
            minimumClearanceLevel: 2,
            name: 'BB-audio_log-magnomi-07.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/4a20f70d-0408-4a26-8b64-5ae47a5007a0/billmagnomi.mp3',
            body: '',
            transcript: 'Shoot first, ask questions later. Now don\'t confuse what I\'m saying. I\'m not trying to downplay the value of killing something that needs killing. It\'s just that sometimes I like to have answers before I\'m jettisoning bodies out of the airlock.'
        },
        'bill-audio-komek': {
            requiredKeywords: ['suspicion'],
            minimumClearanceLevel: 2,
            name: 'BB-audio_log-kmoek-08.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/e6666b8a-b9bb-459e-90e1-5ef843321842/billkomek.mp3',
            body: '',
            transcript: 'Merchants of death. Is that too severe a title? Take what I say with a grain of salt because Henko ships are fitted with Komek reactors whenever possible, but it does grind my gears somewhat that they have such a cozy relationship with the UA.'
        },
        'bill-audio-sorelia': {
            requiredKeywords: ['amethyst'],
            minimumClearanceLevel: 0,
            name: 'BB-audio_log-sorelia-09.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/82cb9c77-2c48-4ffc-ab88-2067fc0b2898/billsorelia.mp3',
            body: '',
            transcript: 'We\'ve started to explore paths through the Sorelian minefield. The first wave of probes were decimated within minutes, but each successive group has made it a little farther based on the previous wave\'s data. Tentative dates for manned scouting trips are being determined.'
        },
        'bill-audio-utopian-alliance': {
            requiredKeywords: ['alskjfeak'],
            minimumClearanceLevel: 0,
            name: 'BB-audio_log-uptopian-alliance-10.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/bc7966a9-7535-48e5-a8ef-36fca97db3cd/billua.mp3',
            body: '',
            transcript: 'I hesitate to even record some of my findings. I still have to talk with Armitage on how thoroughly we might be compromised.'
        },
        'bill-audio-sleeper': { // CARD AT ORIGINS
            requiredKeywords: ['sleeper-9xfab'],
            minimumClearanceLevel: 0,
            name: 'BB-audio_log-sleeper-11.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/4d685910-fd63-4525-95de-de3110d45829/billsleeper.mp3',
            body: '',
            transcript: 'Someone in the MIU must be a UA sleeper agent. So many of our investigations end too abruptly or resolve too smoothly. It\'s like they\'re being carefully guided by outside influence with inside help.'
        },
        //https://ucarecdn.com/5c8eab3d-9ba8-4d20-aafe-4242050abd09/
        //unlocked via code posted on socials 5/20
        'meg-audio-where-to-start': {
            requiredKeywords: ['skeleton'],
            minimumClearanceLevel: 0,
            name: 'MG-audio_log-xlpn-00.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/5c8eab3d-9ba8-4d20-aafe-4242050abd09/meg_ark_tiimp3.mp3',
            body: '',
            transcript: 'Where to start? I\'m the new Sorelian ambassador on Reiner Station.<br><br>' +
                'And even though I\'m not supposed to know that this is the home of Project Lattice, I do.<br><br>' +
                'Just as I\'m certain that others on the station will know I\'m not just here as the ambassador.<br><br>' +
                'The question is: who?',
        },
        // CHAPTER 3
        'moro-audio-brig': {
            requiredKeywords: ['brig'],
            minimumClearanceLevel: 0,
            name: 'MM-audio_log-brig-39af-3.audi0',
            filetype: 'Audio',
            section: sectionAudio,
            audio: 'https://ucarecdn.com/a2648053-1dc0-49db-9c04-cd7daa20f79b/moro5.mp3',
            body: '',
            transcript: 'Meg, if you find yourself in the brig, then you have already lost. Consider it worse than death because in death you are free. You are unmoored and untethered.<br><br>' +
            'If there is a choice between being imprisoned and killed, make the right choice. Or better yet, do your job well enough to where you never had to decide.',
        },
        'glowers-personal-note': {
            requiredKeywords: ['glowers'],
            minimumClearanceLevel: 3,
            name: 'Glowers',
            filetype: 'Personal Note',
            section: sectionPersonal,
            body: 'Normally "glowers" don\'t bother me, but this one seemed particularly uninviting.<br><br>' +
            'Upon closer inspection, I think I understand why. It wasn\'t me. It was anyone paying more than cursory attention to the ship... because of the faded UA insignia on the side of the hull.<br><br>' +
            'Yeah, they tried to paint over it, but their heart wasn\'t in it.<br><br>' +
            'Their heart is really into those energy cells, though. They are loading up as much as that ship will carry.<br><br>' +
            'I should really stop staring, though. His glowers are attracting the scowls of his crewmates and that\'s too much eye contact for me.',
        },
        // Moro Mada Probes
        'mm-ventus-probe-audio': {
            requiredKeywords: ['glyph-a7x9a'],
            minimumClearanceLevel: 3,
            name: 'MM-audio_log-ventus-probe-93faj.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/70e5c0e7-583b-4f4b-bc15-6ffd99b87b00/moro1.mp3',
            section: sectionAudio,
            body: '',
            transcript: 'There are fewer counter-intelligence field agents in existence than you\'d assume.<br><br>' +
            'When that world becomes known to you, you start to see ghosts and shadows everywhere, but that\'s paranoia and naivety.<br><br>' +
            'For a field agent, you must understand that everyone is hiding something. What you\'re hiding just needs to be buried layers deeper than anyone else.',
        },
        'mm-magnomi-probe-audio': {
            requiredKeywords: ['glyph-9av3n'],
            minimumClearanceLevel: 3,
            name: 'MM-audio_log-magnomi-probe-avn81.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/7db02031-aac4-4022-94fd-dd7fe74ac884/moro2.mp3',
            section: sectionAudio,
            body: '',
            transcript: 'Trust is the enemy.<br><br>' +
            'Because you want to tell someone. You feel a compulsion to confide in someone. You can\'t, though.<br><br>' +
            'This isn\'t a secret that will shock and surprise. It\'s a secret that will get you killed.<br><br>' +
            'You must treat it as such. Even though it will make you lonelier than you thought possible.',
        },
        'mm-henko-probe-audio': {
            requiredKeywords: ['glyph-mav831'],
            minimumClearanceLevel: 3,
            name: 'MM-audio_log-henko-probe-391fm.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/58c67caa-8d05-4ea7-b4b4-96596987d1df/moro3.mp3',
            section: sectionAudio,
            body: '',
            transcript: 'There are worse things than being alone.<br><br>' +
            'Being dead. Being a traitor. Being a nobody.<br><br>' +
            'Solitude is a shelter to retreat to when the walls are closing in around you. When prying eyes rove a little too close.<br><br>' +
            'Also, remember that you\'re not as alone as you feel. I\'m here. You may never feel like I am. You may laugh at the notion. But I\'m here when it counts.',
        },
        'mm-komek-probe-audio': {
            requiredKeywords: ['glyph-76cal1'],
            minimumClearanceLevel: 3,
            name: 'MM-audio_log-komek-probe-391ma.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/dd92df3b-ef33-4d23-aef6-c476031c4db9/moro4.mp3',
            section: sectionAudio,
            body: '',
            transcript: 'I trained you for this. I know you\'re ready.<br><br>' +
            'I do have to ask, however: Do you know you\'re ready? It\'s a very important question.<br><br>' +
            'What you\'ve planned. What you\'re aiming for. No one else can pull it off. So if you\'re feeling any measure of doubt whatsoever, you should abort.<br><br>' +
            'There\'s no coming back from this. You of all people know that.',
        },
        // KS UNLOCKS
        // UA TRADE AGREEMENTS
        'ua-trade-agreement-1-clue': {
            requiredKeywords: ['judge'],
            minimumClearanceLevel: -1,
            name: 'UA-Trade-Agreement-Location-1.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/afed1717-add9-427a-b3d0-a3b287d0f7b1/UATrade1.jpg',
            body: '',
        },
        'ua-trade-agreement-2-clue': {
            requiredKeywords: ['judge'],
            minimumClearanceLevel: -1,
            name: 'UA-Trade-Agreement-Location-2.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/d34afecf-e832-48bc-8dfa-3120b2d975a1/UATrade2.jpg',
            body: '',
        },
        'ua-trade-agreement-3-clue': {
            requiredKeywords: ['judge'],
            minimumClearanceLevel: -1,
            name: 'UA-Trade-Agreement-Location-3.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/32c35203-6578-4e05-954e-c54a43df393f/UATrade3.jpg',
            body: '',
        },
        'ua-trade-agreement-4-clue': {
            requiredKeywords: ['judge'],
            minimumClearanceLevel: -1,
            name: 'UA-Trade-Agreement-Location-4.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/f161c91d-848c-4520-83da-7cefbd8c60c4/UATrade4.jpg',
            body: '',
        },
        // UA WARSHIP
        'ua-warship-2-clue': {
            requiredKeywords: ['heathens'],
            minimumClearanceLevel: -1,
            name: 'UA-Warship-Plans-Location-2.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/ddeac96a-b13b-4284-9adb-6ae6609be543/UAWarship2.jpg',
            body: '',
        }, 
        'ua-warship-3-clue': {
            requiredKeywords: ['heathens'],
            minimumClearanceLevel: -1,
            name: 'UA-Warship-Plans-Location-3.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/d98f1c20-3fb8-4722-b16e-8264189d8602/UAWarship3.jpg',
            body: '',
        },
        'ua-warship-4-clue': {
            requiredKeywords: ['heathens'],
            minimumClearanceLevel: -1,
            name: 'UA-Warship-Plans-Location-4.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/a967025c-3d68-4e07-9115-e0cf1fbbb174/UAWarship4.jpg',
            body: '',
        },
        // CLOAKING DEVICE
        'cloaking-device-clue': {
            requiredKeywords: ['goner'],
            minimumClearanceLevel: -1,
            name: 'Cloaking-Device-Location.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/a14aeadf-2b58-47ab-a4df-5f585304ea73/CLOAKINGDEVICE.jpg',
            body: '',
        }, // CLOAKING DEVICE
        'gatling-laser-clue': {
            requiredKeywords: ['regional'],
            minimumClearanceLevel: -1,
            name: 'Gatling-Laser-Location.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/5c5fea1f-c80d-4766-822d-18d748b81978/GATLINGLASER0000000.jpg',
            body: '',
        }, // DAUNTLESS
        'dauntless-clue': {
            requiredKeywords: ['polarize'],
            minimumClearanceLevel: -1,
            name: 'Dauntless-Location.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/b67e4838-ceac-4e9f-aba6-1b6aea8c43a0/Dauntless.jpg',
            body: '',
        },

        // FLASH UNLOCKED
        'unlock-the-flash': {
            requiredKeywords: ['venom-8w33k'],
            minimumClearanceLevel: -1,
            name: 'The Flash',
            filetype: 'Ship Part Unlock',
            section: 'Ship Part Unlock',
            img: 'https://ucarecdn.com/1c2cc7b3-186b-4b0f-a363-883714592f75/Flash.png',
            body: 'Congratulations, you have found the Flash. OMEGA CLEARANCE CODE: <h>CLANCY-158Z</h>',
        },
        // DAUNTLESS UNLOCKED
        'unlock-the-dauntless': {
            requiredKeywords: ['singularity-4k29s'],
            minimumClearanceLevel: -1,
            name: 'The Dauntless',
            filetype: 'Ship Part Unlock',
            section: 'Ship Part Unlock',
            img: 'https://ucarecdn.com/d740ecbe-d980-4071-a278-50292c543065/TheDauntless.png',
            body: 'Congratulations, you have found the Dauntless. OMEGA CLEARANCE CODE: <h>NORSE-BN65</h>',
        },
        // CLOAKING DEVICE UNLOCKED
        'unlock-the-cloaking-device': {
            requiredKeywords: ['scorpion-8p22b'],
            minimumClearanceLevel: -1,
            name: 'The Cloaking Device',
            filetype: 'Ship Part Unlock',
            section: 'Ship Part Unlock',
            img: 'https://ucarecdn.com/857a7f48-f08f-4840-886f-527095439cc8/CloakingDevice.png',
            body: 'Congratulations, you have found the Cloaking Device. OMEGA CLEARANCE CODE: <h>ELEMENT-QE23Y</h>',
        },
        // CLOAKING DEVICE UNLOCKED
        'unlock-the-gatling-laser': {
            requiredKeywords: ['defense-9bnw6'],
            minimumClearanceLevel: -1,
            name: 'The Gatling Laser',
            filetype: 'Ship Part Unlock',
            section: 'Ship Part Unlock',
            img: 'https://ucarecdn.com/533ae07f-c941-48e3-8981-9a1976b52bd0/-/preview/1000x800/',
            body: 'Congratulations, you have found the The Gatling Laser. OMEGA CLEARANCE CODE: <h>TRUCE-B9P12</h>',
        },
        'chapter-4-starting-note': {
            requiredKeywords: [],
            minimumClearanceLevel: 3,
            name: 'Investigation to Date .3',
            section: sectionPersonal,
            filetype: 'Personal Note',
            body: "<li>I followed the leads from Meg's room and they led me all across Henko space</li><br><br>" +
            "<li>After determining his guilt, I confronted Linus Farno, and he fled the station. We've got a tracker on his ship, so I'll need to hunt him down</li><br><br>" +
            "<li>It appears that an offshoot of the Magnomi is deliberating setting the stage for attacks on the UA that may start a war</li><br><br>" +
            "<li>I found Oleg Ali, which got Kinta to talk, but Ventus won't comply fully until we find their missing shipment</li><br><br>" + 
            "<li>Komek is definitely entangled with the UA. It appeared as if a Komek crew gave their lives to hide their collusion with UA forces.</li><br><br>" +
            "<li>I'm starting to have headaches. They hurt...</li><br><br>" + 
            "<li>I need to expand my reach when traveling beyond Reiner Station if I'm going to track down all of our leads.</li>"
        },
        // FINAL CHAPTER
        'mm-final-thoughts-1': {
            requiredKeywords: ['sightless'],
            minimumClearanceLevel: 4,
            name: 'MG-audio_log-final-thoughts-1.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/246296ab-25b3-4df1-9eb7-b9c01b60a93d/MM_Final_1.mp3',
            section: sectionAudio,
            body: '',
            transcript: 'Hey, you. It\'s been a while, hasn\'t it?<br><br>' +
            'You must be disoriented right now-a lot of things bouncing around in that head of yours, colliding with each other until you\'re left with nothing but a cloudy cerebral stew. You killed me, but you don\'t remember it. Now you\'ve gone ahead and killed Bill, but you haven\'t really, <h>not yet</h>.<br><br>' +
            'OMEGA CLEARANCE CODE: <h>REUS-SUM-X31<h>',
        },
        'mm-final-thoughts-2': {
            requiredKeywords: ['not-yet'],
            minimumClearanceLevel: 4,
            name: 'MG-audio_log-final-thoughts-2.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/762b9bd4-afac-461d-b351-2831473adfca/MM_Final_2.mp3',
            section: sectionAudio,
            body: '',
            transcript: 'And let me be the first to soothe your mounting anxiety: I knew you were going to kill me. At best, I was planning on it, and at worst, I was hoping for it. It\'s the only path I could see to arrive at this moment right here with you. Speaking of paths, you\'ve got two branching ones in front of you that will determine how this <h>story</h> ends.',
        },
        'mm-final-thoughts-3': {
            requiredKeywords: ['story'],
            minimumClearanceLevel: 4,
            name: 'MG-audio_log-final-thoughts-3.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/a21898a4-4e1a-4c47-83fb-67e21d18288b/MM_Final_3.mp3',
            section: sectionAudio,
            body: '',
            transcript: 'Walk down that first path, and I can\'t help you anymore. You meet up with Bill, and you kill him. You\'ve seen how it will go down; you\'re programmed to follow through with it. There\'s nothing either of us can do to save him. Maybe he sees it coming, but maybe he doesn\'t. Bill dies. Your backdoor into Project Lattice remains undiscovered. And the <h>UA wins</h>… again.',
        },
        'mm-final-thoughts-4': {
            requiredKeywords: ['ua-wins'],
            minimumClearanceLevel: 4,
            name: 'MG-audio_log-final-thoughts-4.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/c5be1305-d767-4a67-866f-bf2598d9ccc0/MM_Final_4.mp3',
            section: sectionAudio,
            body: '',
            transcript: 'I understand you might not like what you\'e hearing. You might think I\'m crazy (and you\'d only be half-wrong there since I\'m recording preemptive messages hoping you trust a dead person). But you\'re the perfect sleeper agent for them because people like you, and they trust you. You\'re not a loner; you\'re a collaborator. Deep down, you\'re a good person, and I suspect you don\'t want to be doing what you\'re doing. Headaches? Fainting spells? Those aren\'t the symptoms of a <h>soul</h> at peace.',
        },
        'mm-final-thoughts-5': {
            requiredKeywords: ['soul'],
            minimumClearanceLevel: 4,
            name: 'MG-audio_log-final-thoughts-5.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/5e2a8631-4d2c-4de5-bb5e-40e813a7f589/MM_Final_5.mp3',
            section: sectionAudio,
            body: '',
            transcript: 'You\'re fighting this, not living it. You\'re being activated rather than directed, so I\'m placing a life-sized bet on assuming you don\'t want to take that first path. The Utopian Alliance has systematically consumed and depleted every resource, intellectual property, and basic right that we ever possessed. Their <h>appetite</h> is insatiable, their methods are cancerous, and they are coming for us.',
        },
        'mm-final-thoughts-6': {
            requiredKeywords: ['appetite'],
            minimumClearanceLevel: 4,
            name: 'MG-audio_log-final-thoughts-6.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/3495b229-43db-4b46-b1ab-a4cd67205986/MM_Final_6.mp3',
            section: sectionAudio,
            body: '',
            transcript: 'Have you ever wondered how the UA came to prominence? How the Liberty Party rose to power? It started with class warfare, but it ended with the control of information and the theft of intellectual property and research. Their ships\' navigational and weapons technology can be traced to Magnomi engineers prior to our exodus. Thrusters from Ventus, reactor advancements from Komek, and defensive countermeasures from Henko. <h>Everything</h> was ours. Is ours.',
        },
        'mm-final-thoughts-7': {
            requiredKeywords: ['everything'],
            minimumClearanceLevel: 4,
            name: 'MG-audio_log-final-thoughts-7.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/d4d35314-1307-4b24-b6bf-74ff23f5ac2b/MM_Final_7.mp3',
            section: sectionAudio,
            body: '',
            transcript: "Slow deaths are the ones you don't see coming. Where your rights, your accomplishments, and your freedom dissipate until they're nothing but vapor and a memory. Death by a thousand cuts. The first notes of discord and decline are playing in Moonraker space while the UA conducts the music from afar with invisible hands. Well, not so invisible anymore, but you catch my drift. You're dancing like a puppet, and unless you cut the strings, you're going to be a part of the second mass <h>expulsion</h> and intellectual theft of our people.",
        },
        'mm-final-thoughts-8': {
            requiredKeywords: ['expulsion'],
            minimumClearanceLevel: 4,
            name: 'MG-audio_log-final-thoughts-8.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/5b4efe5d-fdf4-4c89-abaa-3c972984a874/MM_Final_8.mp3',
            section: sectionAudio,
            body: '',
            transcript: "What the UA didn't expect was that adversity would make us innovate. Death has a way of forcing adaptation, and the Moonrakers are the greatest example of that in history. We have all eclipsed where we were and what we knew before settling on the moons. It was a long road, but we are in positions of power that the UA never <h>dreamed</h> possible… They want it now, though. All of it. The question is: are we going to let them have it?",
        },
        'mm-final-thoughts-9': {
            requiredKeywords: ['dreamed'],
            minimumClearanceLevel: 4,
            name: 'MG-audio_log-final-thoughts-9.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/ecb826a9-6c98-4407-bfbe-7dcebb380832/MM_Final_9.mp3',
            section: sectionAudio,
            body: '',
            transcript: "That brings us to the second path-the one where you don't kill Bill. The one where you go to Sorelia and deactivate. We have the technology to reverse what's been done to you. It's our technology, after all. The UA certainly wasn't intelligent enough to figure it out independently. You might say I feel somewhat responsible for what happened to you, despite the theft of intellectual property taking place well before I was ever <h>born</h>.",
        },
        'mm-final-thoughts-10': {
            requiredKeywords: ['born'],
            minimumClearanceLevel: 4,
            name: 'MG-audio_log-final-thoughts-10.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/a3e443c9-166c-4df4-adba-ecd3d722dcb8/MM_Final_10.mp3',
            section: sectionAudio,
            body: '',
            transcript: "This path isn't easy. Without a Sorelian ship, you'll never be able to navigate the minefield in our sector of space. You need a map, and unfortunately, one doesn't exist. Not a whole one, anyway. There are fragments out there you'll need to collect. One in the nebula. One hidden so close to our star that the radiation will eat away at your ship. And the last one is… complicated. You'll have to kill a UA general for it, but I don't know which one. They recovered it from a <h>fallen</h> Sorelian agent months ago.",
        },
        'mm-final-thoughts-11': {
            requiredKeywords: ['fallen'],
            minimumClearanceLevel: 4,
            name: 'MG-audio_log-final-thoughts-11.audi0',
            filetype: 'Audio',
            audio: 'https://ucarecdn.com/ef7636ba-160a-480d-b8f3-5686405d92cc/MM_Final_11.mp3',
            section: sectionAudio,
            body: '',
            transcript: "So, the first step-you killed me. Don't sweat it. I'm over it… I assume. The second step, though, is all on you. Which way will it lead? Who do you want to be when it's all said and done? A puppet or something <h>more</h>?",
        },
        'sorelia-map-1': {
            requiredKeywords: ['fragment'],
            minimumClearanceLevel: 4,
            name: 'sorelia-map-fragment-1.image',
            filetype: 'Image',
            section: soreliaMap,
            img: 'https://ucarecdn.com/c5686b7f-558e-44e4-8686-ed5569c75d03/-/preview/811x811/',
            body: '',
        }, 
        'sorelia-map-2': {
            requiredKeywords: ['satisfied'],
            minimumClearanceLevel: 4,
            name: 'sorelia-map-fragment-2.image',
            filetype: 'Image',
            section: soreliaMap,
            img: 'https://ucarecdn.com/f207aaad-d35b-43a6-963d-b08e65da31dc/-/preview/383x1000/',
            body: '',
        }, 
        'sorelia-map-3': {
            requiredKeywords: ['insider-b7x'],
            minimumClearanceLevel: 4,
            name: 'sorelia-map-fragment-3.image',
            filetype: 'Image',
            section: soreliaMap,
            img: 'https://ucarecdn.com/cbe89896-561c-4f9d-8efa-326817bcb011/-/preview/990x700/',
            body: '',
        }, 
        'leech-clue': {
            requiredKeywords: ['cobra'],
            minimumClearanceLevel: -1,
            name: 'Leech-Location.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/57dd27ea-b9d0-4d73-8f4b-ad8eb4a8df37/-/preview/800x800/',
            body: '',
        },
        'icarus-clue': {
            requiredKeywords: ['remain'],
            minimumClearanceLevel: -1,
            name: 'Icarus-Location.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/47064011-a3b0-43b5-a44f-648324d883fe/-/preview/800x800/',
            body: '',
        },
        'oracle-clue': {
            requiredKeywords: ['trials'],
            minimumClearanceLevel: -1,
            name: 'Oracle-Location.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/fb495ad2-b29f-4eca-a84e-2b00652f1d2f/-/preview/800x800/',
            body: '',
        },
        'automation-clue': {
            requiredKeywords: ['sanctus'],
            minimumClearanceLevel: -1,
            name: 'Automation-Location.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/0bd96fa4-ef24-4028-8e7b-d2e385bab50f/-/preview/800x800/',
            body: '',
        },
        'artifact-clue': {
            requiredKeywords: ['society'],
            minimumClearanceLevel: -1,
            name: 'Artifact-205-B-Location.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/dbf9f4af-4590-4d38-aa8b-4c6fe1689e0c/-/preview/800x800/',
            body: '',
        },
        'initiator-clue': {
            requiredKeywords: ['overture'],
            minimumClearanceLevel: -1,
            name: 'Initiator-Location.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/d58c2faa-0c7d-439e-af1b-3b1268b7681b/-/preview/800x800/',
            body: '',
        },
        'decoder-clue': {
            requiredKeywords: ['implant'],
            minimumClearanceLevel: -1,
            name: 'Decoder-Location.image',
            filetype: 'Image',
            section: sectionFiles,
            img: 'https://ucarecdn.com/23e647eb-7ed1-41d4-8844-875cbb2e03f7/adheahe.jpg',
            body: '',
        },
        'unlock-the-decoder': {
            requiredKeywords: ['viper-1v62f'],
            minimumClearanceLevel: -1,
            name: 'The Decoder',
            filetype: 'Ship Part Unlock',
            section: 'Ship Part Unlock',
            img: 'https://ucarecdn.com/1ab1d13e-7eb1-4410-9f22-681addbb4b83/The_Decoder.png',
            body: 'Congratulations, you have found the Decoder. OMEGA CLEARANCE CODE: <h>NIGHT-JN65V</h>',
        },
        'unlock-the-leech': {
            requiredKeywords: ['eclipse-3h64v'],
            minimumClearanceLevel: -1,
            name: 'The Leech',
            filetype: 'Ship Part Unlock',
            section: 'Ship Part Unlock',
            img: 'https://ucarecdn.com/e889b06c-0db4-499e-85a8-1d994de221c2/TheLeech.png',
            body: 'Congratulations, you have found the Leech. OMEGA CLEARANCE CODE: <h>HEARTBEAT-VC45</h>',
        },
        'unlock-the-icarus': {
            requiredKeywords: ['zenith-1f47z'],
            minimumClearanceLevel: -1,
            name: 'The Icarus',
            filetype: 'Ship Part Unlock',
            section: 'Ship Part Unlock',
            img: 'https://ucarecdn.com/5bddf9f6-47b0-4b73-85b5-6d561fb6336a/The_Icarus.png',
            body: 'Congratulations, you have found the Icarus. OMEGA CLEARANCE CODE: <h>SUNRISE-MN126</h>',
        },
        'unlock-the-oracle': {
            requiredKeywords: ['fusion-5g92y'],
            minimumClearanceLevel: -1,
            name: 'The Oracle',
            filetype: 'Ship Part Unlock',
            section: 'Ship Part Unlock',
            img: 'https://ucarecdn.com/03d51a0a-c653-45cf-8619-af86ec8b220c/TheOracle.png',
            body: 'Congratulations, you have found the Oracle. OMEGA CLEARANCE CODE: <h>SHINE-CG3005</h>',
        },
        'unlock-the-automation': {
            requiredKeywords: ['dagger-6q49c'],
            minimumClearanceLevel: -1,
            name: 'The Automation',
            filetype: 'Ship Part Unlock',
            section: 'Ship Part Unlock',
            img: 'https://ucarecdn.com/7d5bbb00-35d7-4d5c-a262-461956279f00/The_Automation.png',
            body: 'Congratulations, you have found the Automation. OMEGA CLEARANCE CODE: <h>POWER-NV1511</h>',
        },
        'unlock-the-artifact': {
            requiredKeywords: ['photon-6j81t'],
            minimumClearanceLevel: -1,
            name: 'The Artifact 205-B',
            filetype: 'Ship Part Unlock',
            section: 'Ship Part Unlock',
            img: 'https://ucarecdn.com/6c2c4f4d-d402-4e73-8f11-73d544f6d3f0/Artifact_205B.png',
            body: 'Congratulations, you have found the Artifact 205-B. OMEGA CLEARANCE CODE: <h>ALGORYTHM-CGXAG</h>',
        },
        'unlock-the-initiator': {
            requiredKeywords: ['exodus-3t91g'],
            minimumClearanceLevel: -1,
            name: 'The Initiator',
            filetype: 'Ship Part Unlock',
            section: 'Ship Part Unlock',
            img: 'https://ucarecdn.com/b3692f38-3671-4d31-a345-2e5e2f111b7b/The_Initiator.png',
            body: 'Congratulations, you have found the Initiator. OMEGA CLEARANCE CODE: <h>VIOLENCE-9ZB45</h>',
        },

    },
    characterList: {
        'bartender': {
            name: 'Bartender',
            command: ['bartender', 'barkeep', 'bar'],
            requiredKeywords: [],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/782dbeb4-f94b-403e-bf4e-ad2ac3cf3fcc/-/preview/721x577/',
            height: '6\' 08"',
            faction: 'Henko',
            role: 'Barkeep',
            notes: 'Makes pretty fantastic drinks. <br>-B. Bendo',
        },
        'bill-bendo': {
            name: 'Bill Bendo',
            command: ['bill', 'bendo', 'bill bendo'],
            requiredKeywords: [],
            minimumClearanceLevel: -1,
            img: 'https://ucarecdn.com/626bd019-5175-43ff-8e0e-b9ebe2ac5671/-/preview/721x577/',
            height: '6\' 07"',
            faction: 'Henko',
            role: 'Supply Sergeant',
            notes: 'I\'d rather not get sidetracked. Read up on me in your own time, preferably after hours when you\'re not working.<br>-B. Bendo',
        },
        'meg-gallak': {
            name: 'Meg Gallak',
            command: ['meg', 'gallack', 'meg gallack', 'meg gallak', 'gallak'],
            requiredKeywords: ['critical'],
            minimumClearanceLevel: 0,
            img: 'https://ucarecdn.com/e6cd5722-d1da-4fea-8800-854d4bcb6395/-/preview/721x577/',
            height: '5\' 04"',
            faction: 'Sorelia',
            role: 'Mine Engineer',
            notes: 'Some days I don\'t really know who I am.<br><br>' +
                'It\'s been a long time since the mines, and this <h>investigation</h> is taking its toll.<br><br>' +
                '-MG .9',
        },
        'ark-tii': {
            name: 'Ark Tii',
            command: ['ark', 'tii', 'ark tii'],
            requiredKeywords: [],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/4a62a3c4-ab8a-4ff1-a9ed-64188d77716a/-/preview/1000x800/',
            height: '5\' 04"',
            faction: 'Sorelia',
            role: 'Diplomat',
            notes: 'The Sorelian ambassador before Meg Gallak. A stiff individual. Couldn\'t ever get a read on him. If I\'m being honest, Meg arriving was a much-needed breath of fresh. Her unconventional background may not seem aligned with an ambassadorial posting, but her work here has definitely improved Henko-Sorelian relations.<br><br>' +
                '-B. Bendo',
        },
        'lynna-tragel': {
            name: 'Lynna Tragel',
            command: ['lynna', 'tragel', 'lynna tragel'],
            requiredKeywords: ['miu'],
            minimumClearanceLevel: 0,
            img: 'https://ucarecdn.com/216df9ec-6550-4b74-b3bd-4e717a928e55/-/preview/1000x800/',
            height: '5\' 09"',
            faction: 'Henko',
            role: 'Infiltrator',
            notes: 'An accomplished investigator in the MIU. We\'ve never worked together, but she\'s single-handedly closed a dozen cases in this sector, on the heels of an equally successful stint in Magnomi space, which everyone knows is not a forgiving place.<br><br>' +
                '-B. Bendo',
        },
        'armitage': {
            name: 'Armitage',
            command: ['armitage'],
            requiredKeywords: ['terrible'],
            minimumClearanceLevel: 0,
            img: 'https://ucarecdn.com/4a62a3c4-ab8a-4ff1-a9ed-64188d77716a/-/preview/1000x800/',
            height: '6\' 00"',
            faction: 'Henko',
            role: 'Overseer',
            notes: 'The de facto head of the Moonrakers Investigative Unit. Also happens to be the director here at Reiner Station. Two more important hats do not exist to wear within Henko.<br><br>' +
                'To be clear, you will not bother Armitage. You report to me. The director has enough to deal with already.<br><br>' +
                '-B. Bendo',
        },
        'linus-farno': {
            name: 'Linus Farno',
            command: ['linus', 'farno', 'linus farno'],
            requiredKeywords: ['shroud'],
            minimumClearanceLevel: 0,
            img: 'https://ucarecdn.com/16993632-e110-46d1-8840-7b9f619352f3/-/preview/1000x800/',
            height: '6\' 00"',
            faction: 'Henko',
            role: 'Council Member',
            notes: function (response) {
                if (response.clearanceLevel <= 1) {
                    return 'A council member who will likely take umbrage if you get in his way. A man of many agendas and little patience, if any. We have the, ahem, pleasure of his representation here on the station. The council likes to keep an eye on all key Moonrakers projects.<br><br>' +
                        '-B. Bendo';
                } else if (response.clearanceLevel == 2) {
                    return 'There\'s a long line of people waiting to punch Linus Farno in the face. But, unfortunately, he\'s got enough credibility to avoid getting hit.<br><br>' +
                        'If we want to knock him down a peg or three, then we need incriminating evidence. Not just schematics from an anonymous sender. We need a hardwire connection between that insufferable lout and whoever is paying him.<br><br>' +
                        'His last transmission went out from Reiner Station. So we have to go out as well.';
                } else if (response.clearanceLevel >= 3) {
                    return 'There\'s a long line of people waiting to punch Linus Farno in the face. But, unfortunately, he\'s got enough credibility to avoid getting hit.<br><br>' +
                        'If we want to knock him down a peg or three, then we need incriminating evidence. Not just schematics from an anonymous sender. We need a hardwire connection between that insufferable lout and whoever is paying him.<br><br>' +
                        'His last transmission went out from Reiner Station. So we have to go out as well.' +
                        '---<br><br>' +
                        'Linus has left the building. He\'s gone... and his pleasure yacht too. All of this is good news because it means you should be able to track him down and, with some luck, identify his co-conspirators.<br><br>' +
                        'From the tracking device that Nella helped you install, it seems that Linus entered Komek space. That\'s all you know for now, but Armitage is adamant that tracking down the council member is a top priority.<br><br>' +
                        'Part of you wonders what a confrontation with Linus would look like. Then again, part of you relishes the opportunity.'
                }
            }
        },
        'lyntoba-ga': {
            name: 'Lyntoba Ga',
            command: ['lyntoba', 'ga', 'lyntoba ga'],
            requiredKeywords: ['lattice'],
            minimumClearanceLevel: 0,
            img: 'https://ucarecdn.com/fac34913-ed26-4f87-85c1-3763bb76c363/-/preview/1000x800/',
            height: '6\' 00"',
            faction: 'Henko',
            role: 'Shield Tech',
            notes: 'A shield tech involved with various Reiner projects. I know little about them.<br><br>' +
                '-B. Bendo',
        },

        // CLEARANCE 1
        'moro-mada': {
            name: 'Moro Mada',
            command: ['moro', 'mada', 'moro mada'],
            requiredKeywords: ['economic'],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/1a1eea01-7129-4b5b-b9eb-83971d4207fa/-/preview/721x577/',
            height: '5\' 06"',
            faction: 'Sorelia',
            role: 'Sabotuer',
            notes: 'Little is known about Moro Mada. Some say that she\'s the linchpin of Sorelian operations outside of the minefield. Some say that she\'s a ghost, designed to mislead and misdirect the other Moonraker factions while real Sorelian agents move unseen.<br><br>' +
                'I, for one, believe her to be real. And, if she is, she\'s undoubtedly one of the most prominent influences in both counter-intelligence and espionage.<br><br>' +
                'Pray you never meet her.<br><br>' +
                '-B. Bendo',
        },
        'kinta-lar': {
            name: 'Kinta Lar',
            command: ['kinta', 'lar', 'kinta lar'],
            requiredKeywords: ['note'],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/1b6dba90-9d9d-4bac-bf4b-7a75ae8aa114/-/preview/1000x800/',
            height: '5\' 10"',
            faction: 'Ventus',
            role: 'Field Surveyor',
            notes: 'Kinta Lar is a pilot of enormous talent. While she\'s not one to boast, Kinta has traveled more extensively throughout and beyond Moonraker space than practically anyone else alive.<br><br>' +
                'Maybe more than anyone else ever.<br><br>' +
                'She\'s absolutely committed to the Ventus cause, with dozens of planetary expeditions under her belt, and she\'s even impressed the Sorelians, which is hard to do.<br><br>' +
                '-B. Bendo',
        },
        'ryle-al-wren': {
            name: 'Ryle Al Wren',
            command: ['ryle', 'wren', 'ryle al wren'],
            requiredKeywords: ['sartoc'],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/bfaf32d6-0f92-44cb-9f6f-e5565d53d44b/-/preview/721x576/',
            height: '5\' 09"',
            faction: 'Henko',
            role: 'Sergeant',
            notes: 'Our supply officer. A dependable fellow.<br>' +
                '-B. Bendo',
        },
        'finneal-lee': {
            name: 'Finneal Lee',
            command: ['finneal', 'lee', 'finneal lee'],
            requiredKeywords: ['prospect'],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/504f79ea-8b25-406b-9fd6-7978c85c47f4/-/preview/1000x800/',
            height: '6\' 01"',
            faction: 'Komek',
            role: 'Regional Director',
            notes: function (response) {
                if (response.clearanceLevel <= 1) {
                    return 'We don\'t have files on Finneal Lee that you can access. That would compromise certain operations and information sources.<br><br>' +
                        'Speak with the man in person.<br><br>' +
                        '-B. Bendo';
                } else if (response.clearanceLevel == 2) {
                    return 'Finneal Lee hasn\'t visited the station in a while, but he\'s the one to talk to if we want to expose more details about Komek dealings.<br><br>' +
                        'Informants are notoriously skittish, though, and Finneal is no exception. It\'ll depend on some charisma and tact whenever we do meet.<br><br>' +
                        'Until then, stay on the lookout for any snippets regarding the Komek. Any information is good information.'
                } else if (response.clearanceLevel >= 3) {
                    return 'Finneal Lee hasn\'t visited the station in a while, but he\'s the one to talk to if we want to expose more details about Komek dealings.<br><br>' +
                        'Informants are notoriously skittish, though, and Finneal is no exception. It\'ll depend on some charisma and tact whenever we do meet.<br><br>' +
                        'Until then, stay on the lookout for any snippets regarding the Komek. Any information is good information.' +
                        '---<br><br>' +
                        'The Komek informant hasn\'t returned to Reiner Station, and you\'re not sure if he will in within the <h>timeframe</h> you need him to.'
                }
            }
        },
        'oleg-ali': {
            name: 'Oleg Ali',
            command: ['oleg', 'ali', 'oleg ali'],
            requiredKeywords: ['extreme'],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/634967ef-a7c5-4ba6-b10d-db97a767ac05/-/preview/1000x800/',
            height: '5\' 06"',
            faction: 'Ventus',
            role: 'Helmsman',
            notes: function (response) {
                if (response.clearanceLevel <= 1) {
                    return 'If there is any plot materlalizing out of the Ventus, it\'s surely being masterminded by The Warden.<br><br>' +
                        'But The Warden does not leave Ventus space and is typically ensconced in Queens Port.<br><br>' +
                        'So Oleg Ali is his right-hand man. The one to go out and execute whatever orders are necessary to advance the Ventus agenda. If his name is being bandied about, then there is definitely something afoot. Something integral to Ventus plans.<br><br>' +
                        'He\'s not on Reiner Station right now, but he\'s apparently close by. If you happen upon him, tread carefully.<br><br>' +
                        '-B. Bendo';
                } else if (response.clearanceLevel == 2) {
                    return 'The Ventus are not talking about whatever shipment Meg was involved with.<br><br>' +
                        'If we\'re going to pry some words out of that tight-lipped pilot, we\'re going to need leverage. And that comes in the form of Oleg Ali.<br><br>' +
                        'He\'s the Warden\'s rigth-hand man, so if we can win him over to our side--get him to value us in some way--then we can turn up the heat on Kinta Lar.';
                } else if (response.clearanceLevel >= 3) {
                    return 'The Ventus are not talking about whatever shipment Meg was involved with.<br><br>' +
                        'If we\'re going to pry some words out of that tight-lipped pilot, we\'re going to need leverage. And that comes in the form of Oleg Ali.<br><br>' +
                        'He\'s the Warden\'s rigth-hand man, so if we can win him over to our side--get him to value us in some way--then we can turn up the heat on Kinta Lar.' +
                        '---<br><br>' +
                        'Finding Oleg Ali enabled you to unearth the truth about the relationship between Ventus and Sorelia. Sorelia seems invested in the success of long-range Ventus probes. We\'ve heard tell of a new technology called a Fusion Drive. These two disparate threads may be connected.<br><br>' +
                        'Kinta Lar won\'t talk any further until we deliver Meg\'s last shipment. It\'s supposedly near Reiner Station, but we have no context for what that means.<br><br>' +
                        'I doubt that the Ventus were complicit in the murder of Meg Gallak, as the progression of their thruster technology hinged on the health of their relationship with Sorelia, but it\'s possible that continuing to work with them will bear some fruit.';
                }
            }
        },
        'ryan-rogal': {
            name: 'Ryan Rogal',
            command: ['ryan', 'rogal', 'ryan rogal'],
            requiredKeywords: ['extreme'],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/5ee3b251-6c0a-4066-83e1-044b41ae9850/-/preview/721x577/',
            height: '6\' 00"',
            faction: 'Magnomi',
            role: 'Munitions Expert',
            notes: function (response) {
                if (response.clearanceLevel <= 1) {
                    return 'It seems likely that Meg Gallak and Ryan Rogal shared a drink together. That is disconcerting because Rogal is the trigger man for Kary Powalk, who assiduously works to incite conflict between the UA and Moonrakers.<br><br>' +
                        'I don\'t like Rogal being anywhere near Reiner Station, let alone Meg Gallak. It makes me second-guess what I know about Meg somewhat. However, it makes me concerned about how far Magnomi may go to deteriorate relations between Moonraker factions in the name of war with the UA.<br><br>' +
                        'Of all the people we\'re looking into, Kary Powalk and Ryan Rogal are among the most dangerous.<br><br>' +
                        '-B. Bendo';
                } else if (response.clearanceLevel == 2) {
                    return 'Rogal is believed to have met with Meg Gallak on more than one occasion.<br><br>' +
                        'The last time he was here, they shared a bottle of Sartoc brandy. It\'s expensive stuff, and whatever they discussed might have cost Meg her life.<br><br>' +
                        'If we\'re going to find out if Magnomi had plans that Meg was aware of, we need to find him and question him.<br><br>' +
                        'Maybe Meg has met him off-station before just as he\'s met her here. It\'s worth looking into.';
                } else if (response.clearanceLevel >= 3) {
                    return 'Rogal is believed to have met with Meg Gallak on more than one occasion.<br><br>' +
                        'The last time he was here, they shared a bottle of Sartoc brandy. It\'s expensive stuff, and whatever they discussed might have cost Meg her life.<br><br>' +
                        'If we\'re going to find out if Magnomi had plans that Meg was aware of, we need to find him and question him.<br><br>' +
                        'Maybe Meg has met him off-station before just as he\'s met her here. It\'s worth looking into.' +
                        '---<br><br>' +
                        'Ryan Rogal, at the behest of Kary Powalk, has been nudging a munition-filled shipwreck to the edges of UA space.<br><br>' +
                        'He\'s also encountered Meg Gallak more than once and is a primary suspect in her death. Rogal and Powalk represent an aggressive splinter cell of the Magnomi, and their plans to foment warmongering throughout Moonraker factions and to elicit an overt response from the Utopian Alliance threaten our safety and the completion of Project Lattice.<br><br>' +
                        'You must seek out Rogal to be certain he wasn\'t directly or indirectly responsible for Meg\'s murder. But be careful. He\'s an accomplished field agent.';
                }
            }
        },
        'omnitus': {
            name: 'Omnitus',
            command: ['omnitus'],
            requiredKeywords: ['extreme'],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/2d328f07-7703-4082-9ebc-06c6ba547cac/-/preview/1000x800/',
            height: '6\' 09"',
            faction: 'Komek',
            role: 'Rift Bender',
            notes: 'Rift benders are worrisome even when they\'re not suspected of assassination. Omnitus checks both boxes, and it doesn\'t bode well that they\'re close to Reiner Station.<br><br>' +
                'Komek parties are circumspect in any public statement or overt action, but they do deal in the darker shades of morality if the occasion arises.<br><br>' +
                'We don\'t want Omnitus to take an interest in us. In spite of that, we must take an interest in them.<br><br>' +
                '-B. Bendo',
        },
        'vanta-sae': {
            name: 'Vanta Sae',
            command: ['vanta', 'sae', 'vanta sae'],
            requiredKeywords: ['extreme'],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/0abd146f-968b-40d4-81c9-048bb68207fc/-/preview/1000x799/',
            height: '6\' 00"',
            faction: 'Sorelia',
            role: 'Symbiont',
            notes: 'No one has ever laid eyes on Vanta Sae. No description has been recorded.<br><br>' +
                'Just whispers in the dark.<br><br>' +
                'Maybe you\'ll be the first...<br><br>' +
                '-B. Bendo',
        },
        // CHAPTER 3
        'nella-van-daval': {
            name: 'Nella Van Daval',
            command: ['nella', 'nella van daval', 'daval'],
            requiredKeywords: [],
            minimumClearanceLevel: 2,
            img: 'https://ucarecdn.com/5b39f437-035c-44b3-b6ce-2e8dd57d65eb/-/preview/721x576/',
            height: '5\' 11"',
            faction: 'Ventus',
            role: 'Pilot',
            notes: '',
        },
        'kary-powalk': {
            name: 'Kary Powalk',
            command: ['kary', 'kary powalk'],
            requiredKeywords: ['011235'],
            minimumClearanceLevel: 2,
            img: 'https://ucarecdn.com/5a492d0a-39ca-44a7-ba7d-d1cf4bbca81c/-/preview/721x577/',
            height: '5\' 09"',
            faction: 'Magnomi',
            role: 'Fleet Admiral',
            notes: '',
        },
        'io-mg21': {
            name: 'IO-MG21',
            command: ['io-mg21', 'io mg21'],
            requiredKeywords: ['attack-ai'],
            minimumClearanceLevel: 2,
            img: 'https://ucarecdn.com/1af5909c-7365-40d2-ad66-cc62bc9cb9a8/-/preview/1000x800/',
            height: '6\' 00"',
            faction: 'Magnomi',
            role: 'Attack AI',
            notes: '',
        },
        'pat-nungar': {
            name: 'Pat Nungar',
            command: ['pat', 'pat nungar'],
            requiredKeywords: ['glowers'],
            minimumClearanceLevel: 3,
            img: 'https://ucarecdn.com/189228d0-f1ad-4340-9588-d3eae8221714/-/preview/1000x800/',
            height: '6\' 06"',
            faction: 'Komek',
            role: 'Machinist',
            notes: 'I\'ve never met the man, but his file says he\'s a machinist at Leppik Station.' +
                '-B. Bendo',
        },
        'nella-van-daval': {
            name: 'Nella Van Daval',
            command: ['nella van daval', 'nella'],
            requiredKeywords: [],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/8757f3c2-4c4b-4415-9f1e-753a87cecf58/-/preview/721x576/',
            height: '5\' 11"',
            faction: 'Ventus',
            role: 'Engine Mechanic',
            notes: 'Mouthy in the right way, knowledgeable in the best way.<br><br>' +
            'Some individuals spurn the pyramid of authority and focus their energy on being the best in their field. Nella is kind of that way. I\'ve never minded the nerve with which she comments on life because we secretly have one of the best ship mechanics in Moonraker space mildly going about her business--even if she\'s nosing into others.<br><br>' +
            'It\'s always good when talent is not paired with arrogance.<br><br>' +
            '-B. Bendo',
        },
        'lila-al-bindar': {
            name: 'Lila Al Bindar',
            command: ['lila-al-bindar', 'lila al bindar', 'lila'],
            requiredKeywords: [],
            minimumClearanceLevel: 1,
            img: 'https://ucarecdn.com/da0f1a5f-25aa-433f-b6b5-ad1c0cbf2722/-/preview/720x577/',
            height: '4\' 11"',
            faction: 'Komek',
            role: '2nd Lieutenant',
            notes: 'Lila al Bindar is a well-respected Komek officer, who\'s been instrumental in maintaining the ceasefire with the UA as their economic and military vessels intrude upon Komek space.<br><br>' +
            'She also had a sterling record as a pilot prior to field advancement<br><br>' +
            'If we ever need to cultivate assets among Komek leadership, she\'d be a valuable one.<br><br>' +
            '-B. Bendo',
        },
        'sorelian-ai': {
            name: 'Sorelian AI',
            command: [],
            requiredKeywords: [],
            minimumClearanceLevel: 5,
            img: 'https://ucarecdn.com/f6604771-df84-4612-8908-9019dd348209/-/preview/1000x800/',
            height: '8\' 00"',
            faction: 'Sorelia',
            role: 'The Seer',
            notes: '',
        },
        'dae-arum': {
            name: 'Dae Arum',
            command: ['dea arum'],
            requiredKeywords: [],
            minimumClearanceLevel: 5,
            img: 'https://ucarecdn.com/e422f03d-e14e-4bc9-a963-7916ec6d6a97/-/preview/1000x800/',
            height: '4\' 11"',
            faction: 'Sorelia',
            role: 'Translator',
            notes: '',
        },
    }
}

// TO DO: loop through all messages, and send them back to the user.

function createFileObject(key, file, response) {
    let body = '';
    if (typeof file.body === 'function') {
        body = file.body(response);
    } else {
        body = file.body;
    }

    const fileObject = {
        key: key,
        img: file.img,
        audio: file.audio,
        name: file.name,
        section: file.section,
        filetype: file.filetype,
        body: body,
        transcript: file.transcript,
    }

    return fileObject;
}

function createCharacterObject(key, character, response) {

    let notes = '';
    if (typeof character.notes === 'function') {
        notes = character.notes(response);
    } else {
        notes = character.notes;
    }

    const returnObject = {
        command: character.command,
        name: character.name,
        img: character.img,
        height: character.height,
        faction: character.faction,
        role: character.role,
        notes: notes
    }

    return returnObject;
}

module.exports = Database;