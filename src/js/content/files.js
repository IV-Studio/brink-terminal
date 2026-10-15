import Keywords from './keywords.js';
import getSMInstance from '../statemanager.js';
const SM = getSMInstance();

const Files = {
    fileList: {
        Sorelia: {
            command: ['sorelia', 'Sorelia'],
            // Database Details
            name: () => 'Sorelia_Faction-Brief_01b.pdx',
            filetype: () => 'Document"',
            showInDatabase: () => Keywords.checkForKeyword('sorelia'),
            img: 'https://ucarecdn.com/51583e85-03f6-4616-8c4f-17c8b859eb7c/Sorelia4x.png',
            bodyText: function () {
                return 'A secretive group who some would label as isolationist while others might claim they were intrusive. Sorelians always seem to operative individually when outside of their mine-laden asteroid field, but they maintain ambassadorial postings at almost every location of significance within the Moonraker collective.'
            }
        },
        Henko: {
            command: ['henko', 'Henko'],
            // Database Details
            name: () => 'Henko_Faction-Brief_91n.pdx',
            filetype: () => 'Document"',
            showInDatabase: () => Keywords.checkForKeyword('henko'),
            img: 'https://ucarecdn.com/31d03541-2c85-41d5-bc7f-9113a4cabafd/Henko4x.png',
            bodyText: function () {
                return 'Out of all of the Moonraker factions, Henko is the most devoted to the collective. With a robust trade network established and an emphasis placed on defensive measures, Henko focuses on protecting ships, planets, and people.<br><br>The five moons of Korath are as hazardous as they come, but the Henko have endured adversity to make a home there.';
            }
        },
        Komek: {
            command: ['Komek', 'komek'],
            // Database Details
            name: () => 'Komek_Faction-Brief_NB3.pdx',
            filetype: () => 'Document"',
            showInDatabase: () => Keywords.checkForKeyword('komek'),
            img: 'https://ucarecdn.com/cd63f954-978d-426b-ac46-f66ea227fdd7/Komek4x.png',
            bodyText: function () {
                return 'The Komek are known for their reactor technology, close proximity to UA space, and secondary market for power reserves. They are believed to maintain an unofficial cease-fire with the UA.<br><br>Residing on Primis Minor, a moon orbiting the second innermost planet in the solar system, the Komek harvests solar power and rely on all other factions needing their power reserves.';
            }
        },
        Magnomi: {
            command: ['Magnomi', 'magnomi'],
            // Database Details
            name: () => 'Magnomi_Faction-Brief_72X.pdx',
            filetype: () => 'Document"',
            showInDatabase: () => Keywords.checkForKeyword('magnomi'),
            img: 'https://ucarecdn.com/f3d4fa9e-a8a7-48b2-8cc2-ec63635df89a/Magnomi4x.png',
            bodyText: function () {
                return 'The Magnomi are a militaristic group. They specialize in developing weapons technology and attack UA ships on sight. Easily the most aggressive faction of the Moonrakers.<br><br>They reside in the Sartoc asteroid belt. While it is resource-scarce, only smaller ships and highly skilled pilots can navigate the Sartoc belt without being battered into a thousand pieces, making it a safe haven from the UA.';
            }
        },
        Ventus: {
            command: ['Ventus', 'ventus'],
            // Database Details
            name: () => 'Ventus_Faction-Brief_8Va.pdx',
            filetype: () => 'Document"',
            showInDatabase: () => Keywords.checkForKeyword('ventus'),
            img: 'https://ucarecdn.com/8fdeead8-6b78-47f9-89c7-7fbc86dc1409/Ventus4x.png',
            bodyText: function () {
                return 'The Ventus dedicate all of their resources to advancing thruster technology and research. Their ship engines are second to none, which helps them to steer clear of UA patrols as well as other Moonraker factions.<br><br>The small city of Queens Port and the repurposed UA mining vessel parked next to it contain the majority of the Ventus population, but few traders are granted access. The moon where they live remains unnamed as the Ventus claim they are waiting for a new home in the stars when their exploratory probes return.';
            }
        },
        UA: {
            command: ['UA', 'ua', 'Utopian Alliance', 'utopian alliance'],
            // Database Details
            name: () => 'Utopian-Alliance-Brief_71Nb.pdx',
            filetype: () => 'Document"',
            showInDatabase: () => Keywords.checkForKeyword('ua'),
            img: 'https://ucarecdn.com/8b1ab58d-29fe-492b-a1ea-993100e212ee/UA4x.png',
            bodyText: function () {
                return 'Error: This entry has been corrupted';
            }
        },
    },
    getFileInfo: function (file) {
        const info = "<h2>File Contents</h2><br>"
            + file.bodyText;

        return info;
    }
}

export default Files;