import {world} from "./content/Map/world.ts";

import RiveCanvas, {
    File,
    Artboard,
    SMIInput,
    StateMachineInstance,
    RiveCanvas as RiveCanvasType,
    TextValueRun
} from "@rive-app/canvas-advanced";
import { playerShip } from "./content/Ship/ships.ts";

interface TileInstanceData {
    x: number;
    y: number;
    enabled: SMIInput;
    artboard: Artboard;
    machine: StateMachineInstance;
    tileID: SMIInput;
    discovered: SMIInput;
    shipDirection: SMIInput;
    health: SMIInput;
    damageTaken: SMIInput;
    placeOfInterest: SMIInput;
    distance: SMIInput;
}

const mapTiles = new Set<TileInstanceData>();

let globalMapActive: SMIInput;
let globalMapX: SMIInput;
let globalMapY: SMIInput;

let combatActive: SMIInput;

export let riveCombatPlayerAttack: SMIInput;
export let riveCombatEnemyAttack: SMIInput;

export let rivePlayerHealthValue: SMIInput;
export let riveEnemyHealthValue: SMIInput;

export let rivePlayerSheildValue: SMIInput;
export let riveEnemySheildValue: SMIInput;

export let rivePlayerShieldOn: SMIInput;
export let riveEnemyShieldOn: SMIInput;

export let rivePlayerTurn: SMIInput;
export let riveEnemyTurn: SMIInput;

export let rivePlayerDamaged: SMIInput;
export let riveEnemyDamaged: SMIInput;

export let riveEnemyText: TextValueRun;
export let rivePlayerText: TextValueRun;

let rive: RiveCanvasType;


export function updateRiveMapTiles() {
    const currentLocation = world.map.currentLocation;

    let shipDirectionValue = world.map.shipDirection; 

    combatActive.value = false;

    for (let mapTileInstance of Array.from(mapTiles)) {

        const mapTile = world.map.getTile(mapTileInstance.y, mapTileInstance.x);

        
        // PLAYER SHIP
        if (currentLocation.row == mapTileInstance.y && currentLocation.col == mapTileInstance.x) {
            mapTileInstance.tileID.value = 0;
            mapTileInstance.shipDirection.value = shipDirectionValue;
            mapTileInstance.health.value = playerShip.currentHealth;
        } else {
            // MAP TILES
            mapTileInstance.tileID.value = mapTile?.riveTile;
        }

        mapTileInstance.distance.value = customDistance(currentLocation.row, currentLocation.col, mapTileInstance.y, mapTileInstance.x);
        
        if (mapTile?.explored == 0) {
            mapTileInstance.discovered.value = false;
            mapTileInstance.placeOfInterest.value = false;
        } else {
            mapTileInstance.discovered.value = true;
            
            if (mapTile?.attributes.placeOfInterest == true) {
                mapTileInstance.placeOfInterest.value = true;
            } else {
                mapTileInstance.placeOfInterest.value = false;
            }
        }

        mapTileInstance.enabled.value = true;
        globalMapActive.value = true;
        globalMapX.value = world.map.currentTileSet.row;
        globalMapY.value = world.map.currentTileSet.col;
        
    }
}

export function enterCombat () {
    combatActive.value = true;
    turnOffMap();
}

export function exitCombat () {
    combatActive.value = false;
}

export function playerDamageTaken() {

    const currentLocation = world.map.currentLocation;

    for (let mapTileInstance of Array.from(mapTiles)) {

        if (currentLocation.row == mapTileInstance.y && currentLocation.col == mapTileInstance.x) {
            mapTileInstance.damageTaken.fire();
            return;
        }
    }
}


export function turnOffMap() {
    for (let mapTileInstance of Array.from(mapTiles)) {
        mapTileInstance.enabled.value = false;
        globalMapActive.value = false;
    }

}


//test();

let initialization: Promise<void>;
export function initializeRiveMap() {
    return initialization ??= loadRiveMap();
}

async function loadRiveMap() {
    rive = await RiveCanvas({
        // Loads Wasm bundle
        locateFile: (_) =>
            `https://unpkg.com/@rive-app/canvas-advanced@2.19.0/rive.wasm`
    });

    const canvas = document.getElementById("riveMap") as HTMLCanvasElement;

    const divContainer = document.getElementById('map') as HTMLDivElement;

    function computeSize() {

        var divWidth = divContainer.offsetWidth;
        var divheight = divContainer.offsetHeight;
        canvas.width = divWidth;
        canvas.height = divheight;
    }

    window.addEventListener('resize', computeSize);
    computeSize();

    const renderer = rive.makeRenderer(canvas);

    const bytes = await (
        await fetch(new Request("https://ucarecdn.com/29ac514e-ac3e-4917-ac6a-6143dca3fc7d/brinkterminal_v21.riv"))
    ).arrayBuffer();
    const file = (await rive.load(new Uint8Array(bytes))) as File;

    const mapTileArtboard = file.artboardByName("Brink Map Tile");

    const mapTileBounds = mapTileArtboard.bounds;

    const mapBGArtboard = file.artboardByName("Brink Map BG");
    const mapBGBounds = mapBGArtboard.bounds;


    const bgStateMachine = new rive.StateMachineInstance(
        mapBGArtboard.stateMachineByName('State Machine 1'),
        mapBGArtboard
    );
    // COMBAT VARIABLES
    combatActive = mapBGArtboard.inputByPath("Combat Active", "Combat").asBool();
    
    riveCombatPlayerAttack = mapBGArtboard.inputByPath("Attack Enemy", "Combat").asTrigger();
    riveCombatEnemyAttack = mapBGArtboard.inputByPath("Attack Player", "Combat").asTrigger();

    rivePlayerHealthValue = mapBGArtboard.inputByPath("Bar Value", "Combat/Player Health Bar").asNumber();
    riveEnemyHealthValue = mapBGArtboard.inputByPath("Bar Value", "Combat/Enemy Health Bar").asNumber();

    rivePlayerSheildValue = mapBGArtboard.inputByPath("Bar Value", "Combat/Player Shield Bar").asNumber();
    riveEnemySheildValue = mapBGArtboard.inputByPath("Bar Value", "Combat/Enemy Shield Bar").asNumber();

    rivePlayerShieldOn = mapBGArtboard.inputByPath("Bar On", "Combat/Player Shield Bar").asBool();
    riveEnemyShieldOn = mapBGArtboard.inputByPath("Bar On", "Combat/Enemy Shield Bar").asBool();

    rivePlayerTurn = mapBGArtboard.inputByPath("Place of Interest", "Combat/Player").asBool();
    riveEnemyTurn = mapBGArtboard.inputByPath("Place of Interest", "Combat/Enemy").asBool();

    rivePlayerDamaged = mapBGArtboard.inputByPath("Damage Taken", "Combat/Player").asTrigger();
    riveEnemyDamaged = mapBGArtboard.inputByPath("Damage Taken", "Combat/Enemy").asTrigger();

    riveEnemyText = mapBGArtboard.textRun("Enemy Title Text");
    rivePlayerText = mapBGArtboard.textRun("Player Title Text");
    rivePlayerText.text = '';
    riveEnemyText.text = '';

    // MAP VARIABLES
    for (let i = 0, l = bgStateMachine.inputCount(); i < l; i++) {
        const input = bgStateMachine.input(i);
        switch (input.name) {
            case "BackgroundOn":
                globalMapActive = input.asBool();
                break;
            case "xCoord":
                globalMapX = input.asNumber();
                break;
            case "yCoord":
                globalMapY = input.asNumber();
                break;
            default:
                break;
        }
    }


    let lastTime = 0;

    // CREATE MAP TILE

    function spawnMapTiles(row, column) {

        const mapTile = file.artboardByName("Brink Map Tile");

        const mapTileMachine = new rive.StateMachineInstance(
            mapTileArtboard.stateMachineByName("State Machine"),
            mapTile
        );

        let tileID;
        let discovered;
        let shipDirection;
        let health;
        let damageTaken;
        let placeOfInterest;
        let distance;
        let tileOn;

        for (let i = 0, l = mapTileMachine.inputCount(); i < l; i++) {
            const input = mapTileMachine.input(i);
            switch (input.name) {
                case "TileID":
                    tileID = input.asNumber();
                    break;
                case "Ship Direction":
                    shipDirection = input.asNumber();
                    break;
                case "Discovered":
                    discovered = input.asBool();
                    break;
                case "Health":
                    health = input.asNumber();
                    break;
                case "Damage Taken":
                    damageTaken = input.asTrigger();
                    break;
                case "Place of Interest":
                    placeOfInterest = input.asBool();
                    break;
                case "Distance":
                    distance = input.asNumber();
                    break;
                case "Tile On":
                    tileOn = input.asBool();
                    break;

                default:
                    break;
            }
        }

        const mapTileInstance = {
            x: row,
            y: column,
            artboard: mapTile,
            enabled: tileOn,
            machine: mapTileMachine,
            tileID: tileID,
            discovered: discovered,
            shipDirection: shipDirection,
            health: health,
            damageTaken: damageTaken,
            placeOfInterest: placeOfInterest,
            distance: distance
        };

        mapTileMachine.advance(0);
        mapTileInstance.artboard.advance(0);

        mapTiles.add(mapTileInstance);
    }

    for (let i = 0, l = 11; i < l; i++) {
        for (let j = 0, k = 11; j < k; j++) {
            spawnMapTiles(i, j);
        }
    }

    function renderLoop(time) {
        if (!lastTime) {
            lastTime = time;
        }
        const elapsedTimeMs = time - lastTime;
        const elapsedTimeSec = elapsedTimeMs / 1000;
        lastTime = time;

        renderer.clear();

        let align = rive.Fit.fitHeight;

        var divWidth = divContainer.offsetWidth;
        var divheight = divContainer.offsetHeight;

        if (divContainer.offsetHeight > divContainer.offsetWidth) {
            align = rive.Fit.fitWidth;
        }

        if (mapBGArtboard) {
            bgStateMachine.advance(elapsedTimeSec);
            mapBGArtboard.advance(elapsedTimeSec);
            renderer.save();
            renderer.align(
                align,
                rive.Alignment.center,
                {
                    minX: 0,
                    minY: 0,
                    maxX: canvas.width,
                    maxY: canvas.height
                },
                mapBGArtboard.bounds
            );
            mapBGArtboard.draw(renderer);
            renderer.restore();
        }

        for (let mapTileInstance of Array.from(mapTiles)) {
            const { artboard, machine, x, y } = mapTileInstance;

            var spacing = Math.min(divContainer.offsetWidth, divContainer.offsetHeight) / 11;

            renderer.save();
            renderer.translate(x * spacing, y * spacing);
            machine.advance(elapsedTimeSec);
            artboard.advance(elapsedTimeSec);

            renderer.align(
                align,
                rive.Alignment.center,
                {
                    minX: 0,
                    minY: 0,
                    maxX: canvas.width,
                    maxY: canvas.height
                },
                mapBGArtboard.bounds,
            );
            artboard.draw(renderer);
            renderer.restore();
        }

        rive.requestAnimationFrame(renderLoop);
    }
    rive.requestAnimationFrame(renderLoop);
    turnOffMap();
}

function customDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    // Calculate the total distance based on the individual x and y distances
    return dx + dy;
}
