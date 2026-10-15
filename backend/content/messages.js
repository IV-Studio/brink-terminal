const inbox = 'inbox';
const archive = 'archive';
const deleted = 'deleted';

const Messages = {

    getAvailableMessages: function (response) {
        const messages = Messages.messageList;

        const availableMessages = {};

        // Loop through each message in the message list
        for (const key in messages) {
            if (messages.hasOwnProperty(key)) {
                const message = messages[key];

                // Check if the user's clearance level is high enough
                const hasClearance =
                    response.clearanceLevel >= message.minimumClearanceLevel;

                // Check if all required keywords are present
                const hasKeywords =
                    message.requiredKeywords.every((keyword) =>
                        response.keywords.includes(keyword)
                    );

                if (hasClearance && hasKeywords) {
                    // If both conditions are met, add the message to the available list
                    const messageObject = createMessageObject(key, message.section, message.subject, message.sender, message.body, message.archive, response.clearanceLevel)
                    availableMessages[key] = messageObject;
                }
            }
        }

        response.messages = availableMessages;

        return response;
    },

    messageList: {
        'firstMessage': {
            requiredKeywords: [],
            minimumClearanceLevel: -1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 0,
            subject: 'Directive S - Details Pending',
            body: "I've received word from Director Armitage regarding my current investigation and your official request.<br><br>" +
                "I'll be in touch shortly. Be on the lookout for my next message on 05.07.<br><br>" +
                "-Bill Bendo",
        },
        'unknown-1': {
            requiredKeywords: [],
            minimumClearanceLevel: -1,
            section: deleted,
            sender: 'unknown',
            archive: 10,
            subject: '-Decrypted Intercept-',
            body: "What happened?! You can\’t tell me this is a good thing. We're losing a grip on the situation, and you need to handle it.<br><br>" +
  
            "Figure out what the hell is going on, and then report back ASAP<br><br>" +

            "What I’d give for a drink right now...",
        },
        // CHAPTER 1
        'directive-s': {
            requiredKeywords: [],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'bill-bendo',
            archive: 1,
            subject: 'Directive S',
            body: 'You asked to be read in on something big, and the day has come. The Moonrakers Investigative Unit has elevated my current work to <h>critical</h>, and I could use some boots on the ground.<br><br>' +
            'I don’t like dirtying my hands on every datapad and my boots in every corridor, so you’ll be my eyes and ears out there. Keep in mind you only have Clearance 0, the lowest level, but if you assist in this investigation, it won\'t be long before you reach Clearance 1. <br><br>' +
            'Enjoy the rarified air up here. We don’t let just anyone into the MIU.<br><br>'+
            '-B. Bendo',
        },
        'critical': {
            requiredKeywords: ['critical'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'meg-gallak',
            archive: 1,
            subject: 'URGENT!',
            body: 'Come to the hangar ASAP. I have to tell you something. I don\'t have much time.<br><br>' +
            'If you\'re having those headaches again, just check the database.<br><br>'+
            '-MG .3',
        },
        'ongoing-investigation': {
            requiredKeywords: ['investigation'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'bill-bendo',
            archive: 1,
            subject: 'Ongoing Investigation',
            body: 'Let\'s catch you up to speed.<br><br>' +
            'Meg Gallak is the new Sorelian <h>ambassador</h>. She arrived at the station shortly after the unfortunate accident that befell Ark Tii--more on that later.<br><br>' +
            'Meg quickly demonstrated an aptitude for navigating the social and political mores of Reiner Station.<br><br>' +
            'Until recently, she was under casual observation by the <h>MIU</h>, but now she\'s under direct investigation.<br><br>' +
            'Sorelians rarely divulge their intentions, so we\'re unsure who\'s in more danger--her or us.<br><br>' +
            '-B. Bendo',
        },
        'ambassador': {
            requiredKeywords: ['ambassador'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'meg-gallak',
            archive: 1,
            subject: 'what am i doing',
            body: 'Sorelian Ambassador. Sounds prestigious, <h>L</h>ofty even. They said I\'d get used to the work first, the title second, and the constant surveillance last, if <h>A</h>t all. I\'d say the claim was presumptuous at best, given the <h>T</h>rue nature of my work, but I\'ve since learned <h>T</h>hat politicians seldom say anything of real consequence.<br><br>' +
            'Then again, I guess that <h>I</h>ncludes me now. Don’t you worry, though. I’ve got plenty of <h>C</h>onsequences on the way.<br><br>' + 
            'One for <h>E</h>ach and everyone one of you.<br><br>'+
            '-MG .16',
        },
        'miu': {
            requiredKeywords: ['miu'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'meg-gallak',
            archive: 1,
            subject: 'no one is accountable',
            body: 'Who investigate<h>S</h> the investigators? What <h>H</h>appens when oversight turns a blind eye or, worse, doesn\'t know they\'re bl<h>I</h>nd?<br><br>' +
            'Reiner Station lies at the center of a tangled w<h>E</h>b, and I\'m increasingly worried I\'m stuck quivering whi<h>L</h>e something is skittering in the shadows.<br><br>' +
            '<h>D</h>ramatic sigh...<br><br>' +
            'Lynna would likely laugh at me right now.<br><br>'+
            '-MG .8',
        },
        'classified': {
            requiredKeywords: ['lattice'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'bill-bendo',
            archive: 1,
            subject: 'Classified Information',
            body: 'I hear you\'ve been asking around about Project Lattice? How do you know about this? Did you talk with Lyntoba?<br><br>' +
            'Well, regardless, that\'s well above your clearance level for now, so I\'d let the subject lie. It would be more prudent to focus on the investigation at hand and help uncover the <h>shroud</h> of mystery covering Meg Gallak.<br><br>' +
            '-B. Bendo',
        },
        'follow-the-credits': {
            requiredKeywords: ['shroud'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'meg-gallak',
            archive: 1,
            subject: 'follow the money',
            body: 'All information is accessible for the right price. The problem with Reiner Station is that what\'s being worked on here would be catastrophic in the wrong hands. And you know the saying, "The wrongest of hands have the deepest of pockets."<br><br>' +
            'Guess I\'ll have to follow the credits.<br><br>' +
            'I have a feeling I\'ll need a drink after this. If you haven\'t already, say hey to the bartender. Tell him his <h>secret</h> friend sent you.<br><br>' +
            '-MG .5',
        },
        'dont-bother': {
            requiredKeywords: ['trouble'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'meg-gallak',
            archive: 1,
            subject: 'why am i dead',
            body: 'Don\'t bother coming to the hangar, because if you\'re reading this, then the worst possible thing has happened… or maybe the best. I\'m not sure yet.<br><br>' +
            'And though I doubt your readiness, I have no one else to turn to. You\'re probably thinking that I\'m being cryptic, and I know at times I\'ve been resistant to share more with you because I question everyone and everything—an occupational curse—but I need your help. Truly and sincerely. We all may need your help before this is over. Cryptic again. Yeah, I get it.<br><br>'+
            'You can do this. One step at a time.<br><br>' +
            'First step: Figure out who <h>killed</h> me.<br><br>'+
            'Because I haven\'t yet, and it\'s bothering me.<br><br>'+
            '-MG .18',
        },
        'urgent-killed': {
            requiredKeywords: ['killed'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'bill-bendo',
            archive: 1,
            subject: 'URGENT!',
            body: 'Meet me at the bar. I need to talk to you in person.<br><br>' +
            'Something <h>terrible</h> has happened.<br><br>' +
            '-B. Bendo',
        },
        'congratulations-meg': {
            requiredKeywords: ['confide'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'meg-gallak',
            archive: 1,
            subject: 'a long ride',
            body: 'Congratulations, you\'re stuck with me. You might be the only one I trust on this station, so you\'ll get to see inside my head.<br><br>' +
            'Apologies in advance. It\'s a scary place. But this is the only contingency that ensures my work carries on if I don\'t--you know, carry on.<br><br>' +
            'I\'ll be in touch.<br><br>'+
            '-MG .19',
        },
        'ciphers': {
            requiredKeywords: ['ciphers'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'meg-gallak',
            archive: 1,
            subject: 'smart cookie',
            body: 'Sorelians are only as mysterious as we are inscrutable. If the impossible becomes possible, then the mystery starts to fade.<br><br>' +
            'And that\'s the rub. We\'ve done some impossible things, but once you accomplish the same, you can sweep the curtain aside and we\'ll be very... scrutable.<br><br>' +
            'Catch up.<br><br>' +
            '-MG',
        },
        // CHAPTER 2
        'chapter-2-opener': {
            requiredKeywords: [],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 2,
            subject: 'Clearance Approved',
            body: 'I see your clearance has come through.<br><br>' +
            'I\'m meeting with <h>Director</h> Armitage shortly to discuss what our options are.<br><br>' +
            '-B. Bendo',
        },
        'project-lattice': {
            requiredKeywords: ['director'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'armitage',
            archive: 2,
            subject: 'Project Lattice',
            body: 'Attention, dedicated personnel of Project Lattice. This is an encrypted transmission to the steadfast individuals who have been tasked with one of the greatest undertakings in Moonraker history.<br><br>' +
            'The Lattice Shield will very likely come to define a break in two distinct eras of politics between Moonraker factions and the Utopian Alliance, ushering in a new age of peace and prosperity for Moonrakers everywhere.<br><br>' +
            'This shield defense system will create a sophisticated network of protection that can provide safety to entire moons, so be proud of what you\'re working toward, but also beware the nefarious motives of any who might not share our goal.<br><br>' +
            'We are Henko. We are manifesting a future free from UA warmongering and Moonraker retaliation. And we will be <h>under threat</h> from multiple fronts, seen and unseen, until the Lattice Shield goes live.<br><br>' +
            'Hold your work close to your chest. And hold your clearance codes closer.<br><br>' +
            '- Director Armitage',
        },
        'current-objectives': {
            requiredKeywords: ['under threat'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 2,
            subject: 'Current Objectives',
            body: 'Your ascendancy in the MIU will almost certainly correlate with how well we execute this investigation.<br><br>' +
            'Here are our current objectives. Determine who would have motive to kill Meg Gallak. And determine if anyone else is in danger.<br><br>' +
            'Let\'s start with what we can control. <u>Go to Meg\'s room and see what you can find there.</u><br><br>' +
            'And we\'re in the process of decrypting Meg\'s personal terminal. I\'ll forward you messages as we decipher them when they seem relevant to the investigation.<br><br>' +
            '-B. Bendo',
        },
        'mg-update-report': {
            requiredKeywords: ['note'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 2,
            subject: 'FWD: MG - Update Report',
            body: 'We just de-crypted this message on Meg\'s terminal. It\'s author is unknown.<br>'+
            '-B. Bendo<br><br>'+
            '---- Forwarded message ----<br><br>' +
            'All progress will halt if the next <h>shipment</h> doesn\'t arrive soon.<br><br>' +
            'And I don\'t have to remind you what\'s at stake, so don\'t confuse our mutual success with some altruistic streak on your part. This is better for all of us.<br><br>' +
            '<u>Meet with Kinta</u> when you\'re ready to depart.<br><br>'
        },
        'profit-over-morals': {
            requiredKeywords: ['economic'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'meg-gallak',
            archive: 2,
            subject: 'FWD: Profit over morals',
            body:
            '---- Forwarded message ----<br><br>' +
            'The correlations between Komek profits and increased UA activity are undeniable. While we\'ve long had suspicions of a black-market agreement between the two groups, this extensive data assessment is the nail in the coffin.<br><br>' +
            'It confirms Komek hesitance in antagonizing the Utopian Alliance, and it also suggests that the completion of the Lattice Shield is a dangerous <h>prospect</h> for many of our… adversaries, shall we say.<br><br>' +
            'Good work, Gallak. Triple-check your work and identify weak points for any aggressive maneuvers toward our work or your person.<br><br>' +
            '-MM',
        },
        'komek-ua-affairs': {
            requiredKeywords: ['prospect'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 2,
            subject: 'Komek-UA Affairs',
            body: 'The MIU has been investigating contentious splinters of Moonrakers across all factions.<br><br>' +
            'Komek energy merchants selling excess power to the Utopian Alliance meet that criterion. Whether they know it or not, they are willingly and recklessly propping up the most existential threat to Moonraker freedom.<br><br>' +
            'We\'ve an <h>informant</h> who has shared knowledge of this in the past. He hasn\'t visited the station in a while, but you need to speak with Finneal Lee.<br><br>' +
            '-B. Bendo,',
        },
        'straight-as-the-moon': {
            requiredKeywords: ['straight'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 2,
            subject: 'FWD: straight as the curvature of a moon',
            body: 'The decryption process continues. This time a personal note written by Meg.'+
            '-B. Bendo<br><br>'+
            '---- Forwarded message ----<br><br>' +
            'Linus Farno is as crooked as they come. We have a whole host of evidence back on Sorelian servers as to his <h>misdeeds</h>, but they\'re all minor transgressions in what is surely a larger conspiracy.<br><br>' +
            'We will absolutely nail that man to the hull of a ship one day, but I need to know more of what he\'s doing here on Reiner Station first.<br><br>' +
            '-MG',
        },
        'extreme-alert': {
            requiredKeywords: ['extreme'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 2,
            subject: 'ALERT!',
            body: 'I\'m concerned that previously disparate strands of information are starting to intertwine.<br><br>'+
            'And it doesn\'t mean anything good. I\'m copying an earlier communique from Armitage:<br><br><hr>'+
            '---- Forwarded message ----<br><br>'+
            'ALERT! HIGH-VALUE FACTION PERSONNEL IN CLOSE PROXIMITY<br><br>' +
            'Oleg Ali - Ventus<br><br>' +
            'Ryan Rogal - Magnomi<br><br>' +
            'Omnitus - Komek<br><br>' +
            'Vanta Sae - Sorelia<br><br>' +
            'PLEASE MONITOR AND REPORT ANY SUSPICIOUS ACTIVITY<br><br>' +
            'ALL INDIVIDUALS <h>CLASSIFIED</h> AS ESCALATING FACTORS<br><br><hr><br>' +
            'Be careful out there.<br><br>' + 
            '-B. Bendo',
        },
        'widening-web': {
            requiredKeywords: ['unmask'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 2,
            subject: 'Widening Web',
            body: 'The <h>scope</h> of this investigation continues to grow.<br><br>' + 
            '<u>Meet me</u> at the administrative offices.<br><br>',
        },
        'persons-of-interest': {
            requiredKeywords: ['misdeeds'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 2,
            subject: 'Persons of Interest',
            body: 'We know that Linus Farno has committed acts tantamount to treason, but the problem is we don\'t know why.<br><br>'+
            'Is he undermining his opposition within Henko to advance his faction status? Is he colluding with another faction to cripple the Lattice Shield or manufacture a <h>war</h>? Has he established contact with the UA?<br><br>' +
            'We simply don\'t know. And until we do, we have to endure the seesawing nausea of his condescension to those below him and simpering to those above.<br><br>' +
            '-B. Bendo',
        },
        'get-off-this-station': {
            requiredKeywords: ['spill over'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 2,
            subject: 'FWD: i gotta get off this station',
            body: 'Got another one for you.'+
            '-B. Bendo<br><br>'+
            '---- Forwarded message ----<br><br>' +
            'RR wants to meet. Not sure if I want to host him here. Seems like a bad move. We could rendevue at the old mining asteroid; he loves derelict things... and brandy.<br><br>' + 
            'I\'ll need to debrief MM afterward, though. And it might be time to share some intel with the MIU. Just have to figure out how to <h>divulge</h> it without sounding too informed.<br><br>' +
            '-MG',
        },
        'war-what-is-it-good-for': {
            requiredKeywords: ['casualty'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 2,
            subject: 'FWD: war what is it good for?',
            body: 'Another personal note has been decryped from Meg\'s terminal.'+
            '-B. Bendo<br><br>'+
            '---- Forwarded message ----<br><br>' +
            'Who wants war more than anyone? The answer seems clear to me, but there are plenty in Sorelia who <h>postulate</h> deeper and wider than I ever could.<br><br>' +
            'I wonder what Vanta Sae would think about all of this. I could use some of her wisdom right about now.<br><br>' +
            '-MG',
        },
        'bill-debrief': {
            requiredKeywords: ['postulate'],
            minimumClearanceLevel: 1,
            section: inbox,
            sender: 'bill-bendo',
            archive: 2,
            subject: 'Debrief',
            body: 'We\'re pulling on some of the same threads at this point. Let\'s meet up.<br><br>' +
            'Come back to my office.<br><br>' +
            '-B. Bendo',
        },
        // CHAPTER 3
        'liftoff': {
            requiredKeywords: [],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'bill-bendo',
            archive: 3,
            subject: 'Liftoff',
            body: 'I\'m looking for any other clues as to what Meg was investigating from the belongings in her room.<br><br>' +
            '<u>Meet me</u> here before you disembark. We\'ve got some details to discuss.<br><br>' +
            '-B. Bendo',
        },
        'rr-hello': {
            requiredKeywords: ['ghost-ship'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'ryan-rogal',
            archive: 3,
            subject: 'Hello',
            body: 'Meg mentioned you once. Said you were brighter than most.<br><br>' +
            'I\'m not sure you want to attract my attention, though, so dim the lights when you\'re poking around in the shadows.<br><br>' +
            '-RR',
        },
        'caution': {
            requiredKeywords: ['opposite'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'ryan-rogal',
            archive: 3,
            subject: 'Caution',
            body: "If you don't have all the pieces, then it doesn't add up, but you're gathering crumbs that I wasn't intending to be gathered.<br><br>" +
            'Stay out of my way. Meg got in someone\'s way, too. Look what happened to her.<br><br>' +
            'Wouldn\'t want you on the wrong end of someone\'s displeasure, too.<br><br>' +
            '-RR',
        },
        'cause-of-death': {
            requiredKeywords: ['terminal'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'bill-bendo',
            archive: 3,
            subject: 'Cause of Death',
            body: 'This data you\'re sending back, it\'s reflective of the grim reality that Moonrakers faced in the early days.<br><br>' +
            'It wasn\'t the UA harassing us at every turn. It wasn\'t the fear of our ships breaking down. It wasn\'t any of that. It was just food. Or the lack of it, more accurately.<br><br>' +
            'Malnutrition and starvation. A depressing way to go...<br><br>' +
            '-B. Bendo',
        },
        'initiate-stage-1': {
            requiredKeywords: ['011235'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'kary-powalk',
            archive: 3,
            subject: 'Initiate Stage 1',
            body: 'We will not engender the necessary vitriol and outrage with our typical skirmishes and raids.<br><br>' +
            'We must create a shock so counter to our enemy\'s expectations that their hatred is blinding and their response universal.<br><br>' +
            'Even in death, the Moonrakers will be a thorn in the side of the Utopian Alliance.<br><br>' +
            '-KP',
        },
        'mg-intercepted-puppet-master': {
            requiredKeywords: ['shadow'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'meg-gallak',
            archive: 3,
            subject: 'intercepted communique: puppet-master',
            body: 'Moro, there is no doubt that {REDACTED} is sharing secrets with {REDACTED}.<br><br>' +
            "But I think I've got an \"in\" now. I've started to meet with {REDACTED}. I think it will help us uncover what's going on at {REDACTED}.<br><br>" +
            "And don't worry. I'll be careful. If I'm not mistaken, they killed {REDACTED} because he got too close to {REDACTED}.",
        },
        'instigator': {
            requiredKeywords: ['grievances'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'linus-farno',
            archive: 3,
            subject: 'Instigator',
            body: 'The day that I can prop my feet up on Bill Bendo\'s desk when his dull bulk has been fired off into the nearest star, I will drink the finest glass of whiskey in my reserves.<br><br>' +
            'He really is full of himself. If he knew half of what I knew, he\'d be director by now.  He doesn\'t, though. That\'s why he\'s middle management, and that\'s why he\'s so keen to carve me up and serve me on a platter to Armitage.<br><br>' +
            'I can almost taste the whiskey now.<br><br>' +
            'One day soon, Bill. One day soon.'
        },
        'lets-talk-armitage': {
            requiredKeywords: ['encrypted-messages'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'armitage',
            archive: 3,
            subject: 'Let\'s Talk',
            body: 'Good day. I like to keep a close watch on my investigators (if Bill hasn\'t shared that yet). And you\'re starting to uncover some things that are sensitive, embarrassing, damning. All of the above and more.<br><br>' +
            'If we\'re going to do this--and believe me we\'re going to do it--then I want assurances that we\'ve done the job properly.<br><br>' +
            'Bill speaks highly of you. I\'ll evaluate that for myself. When you\'re back at the station, let\'s <h>chat</h> about Linus Farno and what our next steps are.'
        },
        'i-thought-better-of-you': {
            requiredKeywords: ['intelligence'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'bill-bendo',
            archive: 3,
            subject: 'I thought better of you',
            body: 'You\'re really asking if Linus Farno is part of an intelligence agency?<br><br>' +
            'Not only is that man antithetical to the definition of the word "intelligence" but no agency would risk its reputation by recruiting such a odious human.<br><br>' +
            'Move along.<br><br>' +
            '-B. Bendo'
        },
        'public-enemy-number-meg': {
            requiredKeywords: ['veiled'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'linus-farno',
            archive: 3,
            subject: 'Public Enemy Number Meg',
            body: 'Will you please find a way to rid me of this invasive species? It\'s bad enough that she\'s a Sorelian, but this one is particularly motivated to march me in front of my peers and execute me. Figuratively, of course.<br><br>' +
            'Better idea. Could you... you know... deal with her? Send someone her way and remove her from the equation?'
        },
        'wowzer': {
            requiredKeywords: ['unassuming'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'nella-van-daval',
            archive: 3,
            subject: 'Wowzer',
            body: 'That thing is a beauty. If you keep sending me ship images like that, I\'m going to get hot and bothered.<br><br>' +
            'Yeah, that thing will outrun just about anything I\'ve seen flying about these parts. And there\'s some type of coating on the hull that I\'d wager are either reflective stealth panels or adaptive shielding tech.<br><br>' +
            'Either way, that\'s a hell of a ship. Whoever owns that, you should befriend them or kill them.<br><br>' +
            'Just don\'t get in their way.'
        },
        'this-is-not-a-drink': {
            requiredKeywords: ['archaic'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'bartender',
            archive: 3,
            subject: 'This Is Not A Drink',
            body: 'I feel that I\'m functioning outside of my target parameters. I detect no alcohol in this request.<br><br>' +
            'Regardless, I do have access to data that is older than the station personnel for reference purposes.<br><br>' +
            'The VEP H-class probes were in circulation 50-100 years ago, so they\'re no longer valued by Ventus for their telemetry data, but it\'s possible they still receive and transmit scans.<br><br>' +
            'Not sure that helps, but thank you for the diversion from washing glasses. First drink is on me when you get back.'
        },
        'evacuation': {
            requiredKeywords: ['final-transmission'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'lila-al-bindar',
            archive: 3,
            subject: 'Evacuation',
            body: 'Our rendezvous was compromised. Unencrypted open channel communication is not possible.<br><br>' +
            'Our silent partners initiated an assault on us as soon as an HS-7 Sentinel appeared on our scopes.<br><br>' +
            'I\'ve evacuated what crew I can, but we are experiencing a near total loss. The proprietary reactor tech we had onboard has been secured into a shielded pod that will remain nearby our wreckage.<br><br>' +
            'Lila al Bindar, signing off--'
        },
        'rendezvous': {
            requiredKeywords: ['suspicion'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'bill-bendo',
            archive: 3,
            subject: 'Rendezvous?',
            body: 'Without any other details, I would suspect the Komek crew was ambushed, and the Henko ship just happened to be patrolling in that location and intervened.<br><br>' +
            'But given the internal dialogue between the crew, it\'s more likely that whoever the antagonist was fired upon the Komek crew...because the Henko ship arrived?<br><br>' +
            'There\'s more here to discover.<br><br>' +
            'Keep looking.'
        },
        'check-in-bill': {
            requiredKeywords: ['chapter-3-finished'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'bill-bendo',
            archive: 3,
            subject: 'Check In',
            body: 'I think someone just tried to kill me. Either that or the bartender has gotten really sloppy at making drinks.<br><br>' +
            'Whoever it was must have been paying attention to what I drink in the tavern. So I\'ll have to keep my head on a <h>swivel</h> from now on.<br><br>' +
            'This makes now a good time to meet. I need to debrief you and we need to assess where we\'re at.<br><br>' +
            'Come to the admin offices.<br><br>' +
            '-B. Bendo'
        },
        'oleg-ali-meg': {
            requiredKeywords: ['disarmingly'],
            minimumClearanceLevel: 2,
            section: inbox,
            sender: 'meg-gallak',
            archive: 3,
            subject: 'Oleg Ali',
            body: 'Handsome and intimidating. Capable and diminuitive.<br><br>' +
            'I\'m not sure anyone I\'ve met has ever walked the line between two personas so intently.<br><br>' +
            'Maybe this is why he\'s such a feared operator. He\'s mercurial until he\'s not, and when he stops being <h>unpredictable</h> is when you\'re likely... screwed.'
        },
        // CHAPTER 4
        'armitage-urgent': {
            requiredKeywords: [],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'armitage',
            archive: 4,
            subject: '[URGENT]',
            body: 'Report to my office immediately.'
        },
        'armitage-occupied': {
            requiredKeywords: ['occupied'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'armitage',
            archive: 4,
            subject: 'LT - New Findings',
            body: 'If you discover anything of note while you\'re with Bill, please let me know.<br><br>' +
            'We\'ve completely upended Lynna\'s room, to no avail. We didn\'t find anything out of the ordinary, let alone incriminating.<br><br>' +
            'I want results.'
        },
        'armitage-documented': {
            requiredKeywords: ['documented'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'armitage',
            archive: 4,
            subject: 'LT - Old Cases',
            body: 'We\'ve started to review Lynna\'s casework.<br><br>' +
            'There are slight discrepancies in the vast majority of them. Intel logged after action reports dependent on that data. Informants that never resurface after one encounter. Et cetera.<br><br>' +
            'It\'s the kind of thing that you overlook when cases are being closed and the investigator is meeting with a high degree of success as Lynna was.<br><br>' +
            'In hindsight, these are details I should have clued in on. I can\'t change that now, but we\'re going to keep pulling on these threads and see what else unravels.'
        },
        'timeframe': {
            requiredKeywords: ['timeframe'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'bill-bendo',
            archive: 4,
            subject: 'Leppik Station',
            body: 'Our latest intel indicates that Finneal Lee is on Leppik Station. He\'s firmly in Komek space, and we\'re not sure when he intends to visit here next.<br><br>' +
            'When you\'re off-station, you should make an effort to visit him. It will likely help to narrow down our field of suspects.<br><br>' +
            '-B. Bendo'
        },
        'scratching': {
            requiredKeywords: ['scratching'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'armitage',
            archive: 4,
            subject: 'MM',
            body: 'We\'ve continued to decrypt as much of Meg\'s old data as possible.<br><br>' +
            'Moro Mada, the legendary field agent, was Meg\'s handler. And more recent conversations suggest she\'s been skirting the edges of explored space.<br><br>' +
            'If you can locate her, it would serve us well to inform her of Meg\'s demise and press for more information.'
        },
        'assault-carrier': {
            requiredKeywords: ['assault-carrier'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'bill-bendo',
            archive: 4,
            subject: 'UA Incursion',
            body: 'Abandon all hope when you see something like that. How has it come to this?<br><br>' +
            'That\'s a top-of-the-line Utopian Alliance assault ship. It\'s got bells that kill and whistles that also kill.<br><br>' +
            'If that ship is in Moonraker space, then it\'s not the only one. Which means the generals have come to play. And by play I mean hunt with supreme prejudice.<br><br>' +
            'Don\'t make big waves and get out of there as soon as you can.'
        },
        'voluminous': {
            requiredKeywords: ['voluminous'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'bill-bendo',
            archive: 4,
            subject: 'MM-1',
            body: 'I\'m reminded of the term "warrior-scholar" when I think of Moro Mada.<br><br>' +
            'In a world of ships where we are so often soft, fleshy detritus amidst harder, colder metal in the vastness of space, she is a daunting prospect.<br><br>' +
            'I\'ve heard she\'s killed more UA soldiers than most career Magnomi captains. With her hands...'
        },
        'eccentricities': {
            requiredKeywords: ['eccentricities'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'bill-bendo',
            archive: 4,
            subject: 'MM-2',
            body: 'But violence without purpose doesn\'t go down easily. People tend to choke on it.<br><br>' +
            'Moro Mada is someone with purpose. I don\'t know what it is. Sorelia may not even know what it is. Yet it\'s there.<br><br>' +
            'Otherwise she wouldn\'t have been doing this as long as she has.'
        },
        'crumpled': {
            requiredKeywords: ['crumpled'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'ryan-rogal',
            archive: 4,
            subject: 'Hello',
            body: 'Answer these three questions:<br><br>' +
            'Who gains from Moonraker infighting?<br><br>' +
            'What kind of killer leaves a trace?<br><br>' +
            'Is anyone benefiting from you chasing me?<br><br>' +
            'After you dwell on that, know this: If you come after me again, I will not hesitate to kill you. Our plans matter more than appeasing a trite Henko representative for a blundering MIU investigation. Get your heads out of your collective asses.<br><br>' +
            '-RR'
        },
        'napping': {
            requiredKeywords: ['napping'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'nella-van-daval',
            archive: 4,
            subject: 'How\'s it going?',
            body: 'Napping?! He\'s napping?<br><br>' +
            'I\'ll fix up your ship free of charge for the rest of my life if you just carry his cot out of the building.<br><br>' +
            'And I\'ll make it the best ship in the sector if you record while you do it...'
        },
        'polymer': {
            requiredKeywords: ['polymer'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'bill-bendo',
            archive: 4,
            subject: 'Stay Alert',
            body: 'If you\'re at a hideout that no one else knows about, you don\'t obsessively look out the viewport.<br><br>' +
            'You look out the viewport when you\'re waiting for someone else. And Linus sure wasn\'t waiting for you.<br><br>' +
            'Keep an eye out. You want evidence and one-on-one confrontation, not to be outnumbered.'
        },
        'servitors': {
            requiredKeywords: ['servitors'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'bill-bendo',
            archive: 4,
            subject: 'The Director',
            body: 'Armitage must be losing faith in those around him. When you turn to machines to get the job done, you don\'t trust the people next to you.<br><br>' +
            'Those floating orbs of circuitry and wires don\'t have the intuition necessary to find our culprits...<br><br>' +
            'They can make a hell of a drink, though.' +
            '-B. Bendo'
        },
        'blind': {
            requiredKeywords: ['blind'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'meg-gallak',
            archive: 4,
            subject: 'Sleight of Foot',
            body: 'Moving about unseen on Reiner Station is a challenge. <br><br>' +
            'Of course, I could employ ghost tech or backdoor the security feeds, but those are short-term solutions. For long-term subterfuge, how does one become invisible? Even in plain sight. <br><br>' +
            'I think the recipe calls for more brazen personality than one might expect from someone with ulterior motives.'
        },
        'intact': {
            requiredKeywords: ['intact'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'armitage',
            archive: 4,
            subject: 'Hideout',
            body: 'If your scans are accurate, then this building has been repaired just enough to allow for basic life support.<br><br>' +
            'And some of the structure has patches that have to be as recent as the last five years, judging by how decayed the rest of the site is in comparison.<br><br>' +
            'There\'s no way that Linus could have managed this on his own. He doesn\'t have the know-how, and he sure as hell wouldn\'t have done the actual labor required to accomplish it.'
        },
        'hums': {
            requiredKeywords: ['hums'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'linus-farno',
            archive: 4,
            subject: 'Good Riddance',
            body: 'I never liked her much anyway.<br><br>' +
            'I mean, I admire what she was able to accomplish, but attitude and how you conduct yourself is just as important.<br><br>' +
            'I think it\'s why I\'ve done so well.'
        },
        'chapter-4-finished': {
            requiredKeywords: ['chapter-4-finished'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'armitage',
            archive: 4,
            subject: 'Don\'t Worry',
            body: 'You\'ve been out there long enough on your own. Come back to the station.<br><br>' +
            'I want updates from you and Bill about where things are at.<br><br>' +
            'I\'ll be in my office.'    
        },
        'disservice': {
            requiredKeywords: ['disservice'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'bill-bendo',
            archive: 4,
            subject: 'Report for Debriefing',
            body: 'Don\'t take what Armitage said at face value.<br><br>' +
            'Yeah, he caught me up on everything. I know that he\'s fuming right now, but he\'ll calm down.<br><br>' +
            'I don\'t think you handled yourself poorly. Sure, you need to get checked out by medical again because paralyzing headaches is not something you\'ll want to deal with in the field long-term. But, overall, you\'ve tracked down almost all of our leads and helped push this case closer to its natural conclusion.<br><br>' +
            'Some of these individuals might be lying. All of them could be lying. So we\'re not done yet evaluating their motive and possible involvement with Meg, but the search is thinning out.<br><br>' +
            'Crossing out possible suspects is necessary in order to hone in on the one who\'s responsible.<br><br>' +
            'Get some rest for now, but I\'ll be in touch as soon as I\'ve pored over all of the data you\'ve shared. We\'re missing something, and I think I know what, or who, it is.<br><br>' +
            'With Lynna dead and my options limited, this promotion might feel a little forced, but I need you to help me finish this thing.<br><br>' +
            'Clearance Level 4 - <u>NOOSE</u><br><br>' +
            'See you soon, investigator.'    
        },
        'lynna-tragel-lt': {
            requiredKeywords: ['lynna-tragel'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'meg-gallak',
            archive: 4,
            subject: 'LT',
            body: 'Moro, what do you know about Lynna Tragel?<br><br>' +
            'She\'s an investigator here on the station--I don\'t know. She seems... too well put together?<br><br>' +
            'That shouldn\'t be a crime or anything, but no one gets everything right. Well maybe you do, Moro. The rest of us, though...<br><br>' +
            'Just look into her, alright? I\'ve got a weird feeling, but I can\'t quite put a finger on it.'
        },
        'meg-ventus-probe-message': {
            requiredKeywords: ['glyph-a7x9a'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'meg-gallak',
            archive: 4,
            subject: 'Spiders',
            body: 'How do you lure a spider out from the edges of its web?<br><br>' +
            'Why, place yourself at the web\'s center and truss yourself up like dinner, of course!<br><br>' +
            'It sounds way less appealing now that I\'m saying it out loud...' +
            'It\'s the only way to light up the dark corners of this shadowy game, though. So I better get ready for the role of a life.'  
        },
        'meg-magnomi-probe-message': {
            requiredKeywords: ['glyph-9av3n'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'meg-gallak',
            archive: 4,
            subject: 'Bait',
            body: 'Why am I knowingly throwing myself out there as bait? Good question.<br><br>' +
            'These spiders know the difference between a meal and a mirage.<br><br>' +
            'If I approach them like a predator, they\'ll scurry away and make a new web somewhere else.<br><br>' +
            'I want them too busy munching on me to notice what\'s swooping in until it\'s too late.'  
        },
        'meg-henko-probe-message': {
            requiredKeywords: ['glyph-mav831'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'meg-gallak',
            archive: 4,
            subject: 'Webs',
            body: 'With the spiders gone, the web will break apart.<br><br>' +
            'None of these individual threads will hold together after that.<br><br>' +
            'It\'s hard for me to explain it well, but this small spark here should ignite a bigger flame.<br><br>' +
            'And they won\'t see that it\'s all burning down around them. That\'s the hope, at least.'  
        },
        'meg-komek-probe-message': {
            requiredKeywords: ['glyph-76cal1'],
            minimumClearanceLevel: 3,
            section: inbox,
            sender: 'meg-gallak',
            archive: 4,
            subject: 'Collateral',
            body: 'Usually the one pulling the strings doesn\'t yank themselves around so violently, but the ruse has to be perfect.<br><br>' +
            'No one would plan what I\'m planning. Not with the outcome I\'m racing toward.<br><br>' +
            'So if no one would plan it, then that makes it the best plan.<br><br>' +
            'Moro will be proud of me... if it works.'  
        },
        'flash-ship-part-clue': {
            requiredKeywords: ['chlorine'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'unknown',
            archive: 4,
            subject: 'Flash',
            body: 'A Moonraker without a WEAPON<br><br>' +
            'Would be gone in a second.<br><br>' +
            'Lucky for you to be in a GUILD<br><br>' +
            'Upon which foundation you can build<br><br>' +
            'A means to find the PATH<br><br>' +
            'That will bring you to a cache.<br><br>' +
            'Once the pavillion is found,<br><br>' +
            'And you begin looking around,<br><br>' +
            'In the southeast have a seat,<br><br>' +
            'And wonder at your feet.<br><br>' +
            '34.2730556, -88.7622222'
        },
        'shield-lattice-final-unlock': {
            requiredKeywords: ['guardian-13x8mv'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'unknown',
            archive: 4,
            subject: 'COMPLETE: The Shield Lattice',
            body: 'Congratulations. You\'ve fully completed the Shield Lattice Blueprints. Construction will now begin. The Henko thank you for your service.<br><br><br>OMEGA CLEARANCE CODE: <h>VITALS-31BM</h>'
        },
        'ventus-fusion-drive-final-unlock': {
            requiredKeywords: ['horizons-57t9cv'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'unknown',
            archive: 4,
            subject: 'COMPLETE: The Fusion Drive',
            body: 'Congratulations. You\'ve fully completed the Ventus Fusion Drive Blueprints. Construction will now begin. The Ventus thank you for your service.<br><br><br>OMEGA CLEARANCE CODE: <h>CHEETAH-PL6K3</h>'
        },
        'ua-trade-agreement-final-unlock': {
            requiredKeywords: ['victoria-52b9cz'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'unknown',
            archive: 4,
            subject: 'COMPLETE: The UA Trade Agreement',
            body: 'Congratulations. You\'ve fully completed the UA Trade Agreement. This agreement has been sent to all pertinent parties. The Utopian Alliance and Komek thank you for your service.<br><br><br>OMEGA CLEARANCE CODE: <h>FOREST-18BN</h>'
        },
        'ua-warship-final-unlock': {
            requiredKeywords: ['reliance-38q6vy'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'unknown',
            archive: 4,
            subject: 'COMPLETE: The UA Warship Blueprints',
            body: 'Congratulations. You\'ve fully unconvered the blueprints of the UA Warship. These plans have been sent to the Magnomi clan, who thank you for your service.<br><br><br>OMEGA CLEARANCE CODE: <h>GRAVESTONES-381BX</h>'
        },
        // FINAL CHAPTER
        'bill-final-debrief': {
            requiredKeywords: ['more'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'bill-bendo',
            archive: 5,
            subject: 'Final Debrief',
            body: 'I\'ve made some startling discoveries in the last few days.<br><br>' +
            'Let\'s meet up and talk about them.<br><br>' +
            'I\'ll be in the tavern.'
        },
        'vanta-chimes': {
            requiredKeywords: ['chimes'],
            minimumClearanceLevel: 0,
            section: inbox,
            sender: 'vanta-sae',
            archive: 5,
            subject: 'Onward',
            body: 'I\'ve finished my inquiries.<br><br>' +
            'You may continue to Sorelia.'
        }
    }
}

// TO DO: loop through all messages, and send them back to the user.

function createMessageObject(key, section, subject, sender, body, archiveLevel, clearanceLevel) {

    let updatedSection = section;

    if (clearanceLevel >= archiveLevel) {
        updatedSection = 'archive';
    }

    const messageObject = {
        key: key,
        section: updatedSection,
        subject: subject,
        sender: sender,
        body: body
    }

    return messageObject;
}

/*
function createMessagesObject(messages) {

    const returnObject = {
        type: 'messages',
        messages: messages,
    }

    return returnObject;
}
*/

module.exports = Messages;