import React, {CSSProperties, useState} from 'react';
import Flexbox from 'flexbox-react';
import * as R from "ramda";

const buttonStyles: CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none"
}

const resetButtonStyles: CSSProperties = {
    textAlign: "center",
    backgroundColor: "#ccc",
    lineHeight: "5rem",
    alignContent: "center",
    fontSize: "2rem",
    fontWeight: "bold"
}


type CounterProps = {
    colour: string
    value: number
    update: (lens: any) => void
    lens: R.Lens,
    title?: string
}

const factions = {
    guild: {
        colour: "#628BC4"
    },
    necros: {
        colour: "#CE4740"
    },
    imperial: {
        colour: "#F4DB78"
    },
    wild: {
        colour: "#6B9F52"
    }
}

function Counter({colour, value, update, lens, title}: CounterProps) {
    return (
        <Flexbox flexDirection="row" flexGrow={1} style={{backgroundColor: colour}}>
            <Flexbox flexDirection="row" flexGrow={1} style={{position: "relative"}}>
                <Flexbox flexGrow={1} alignItems={"stretch"}>
                    <div style={{flexGrow: 1}} onClick={() => update(R.over(lens, R.dec))}>&nbsp;</div>
                </Flexbox>
                <Flexbox flexGrow={1}>
                    <div style={{flexGrow: 1}} onClick={() => update(R.over(lens, R.inc))}>&nbsp;</div>
                </Flexbox>
                <div style={buttonStyles}>
                    {!!title && <>
                        <h1 style={{marginBottom: "-5rem", fontSize: "3rem"}}>{title}</h1>
                        <h1 style={{fontSize: "8rem"}}>{value}</h1>
                    </>}
                    {!title && <>
                        <h1 style={{fontSize: "8rem", color: "white"}}>{value}</h1>
                    </>}

                </div>
            </Flexbox>
        </Flexbox>
    )
}


type FactionButtonProps = {
    colour: string,
    onClick: (colour: string) => void
}

function FactionButton({colour, onClick}: FactionButtonProps) {
    return (
        <Flexbox style={{backgroundColor: colour, position: "relative"}} flexGrow={1}>
            <div style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}
                 onClick={() => onClick(colour)}>&nbsp;</div>
        </Flexbox>
    )
}

type FactionSelectorProps = {
    player: number,
    update: (lens: any) => void,
    lens: R.Lens
}

function FactionSelector({player, update, lens}: FactionSelectorProps) {
    const select = (colour: string) => update(R.set(lens, colour))
    return (<Flexbox flexGrow={1} flexDirection={"row"} style={{position: "relative"}}>
        <FactionButton colour={factions.imperial.colour} onClick={select}/>
        <FactionButton colour={factions.guild.colour} onClick={select}/>
        <FactionButton colour={factions.necros.colour} onClick={select}/>
        <FactionButton colour={factions.wild.colour} onClick={select}/>
        <div style={buttonStyles}>
            <h1 style={{
                fontSize: "1.5rem",
                margin: 0,
                backgroundColor: "black",
                opacity: 0.5,
                color: "white",
                padding: "0.5rem",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0
            }}>Player {player} Faction</h1>
        </div>
    </Flexbox>)
}


type Player = {
    health: number
    colour: string
}
type AppState = {
    player1: Player
    player2: Player
    gold: number
    combat: number
}

function App() {

    const [state, setState] = useState<AppState>({
        player1: {
            health: 50,
            colour: "white"
        },
        player2: {
            health: 50,
            colour: "white"
        },
        gold: 0,
        combat: 0
    })

    return (
        <Flexbox flexDirection="row" minHeight="100vh">
            <Flexbox flexGrow={2} flexDirection={"column"} style={{borderRight: "2px solid #555"}}>
                <Counter colour={state.player1.colour} value={state.player1.health} update={setState}
                         lens={R.lensPath(['player1', 'health'])}/>
                <Counter colour={state.player2.colour} value={state.player2.health} update={setState}
                         lens={R.lensPath(['player2', 'health'])}/>
            </Flexbox>
            <Flexbox flexGrow={1} flexDirection={"column"} style={{borderLeft: "2px solid #888"}}>
                <Flexbox flexGrow={2} flexDirection={"column"}>
                    <Counter colour={"white"} value={state.gold} update={setState} lens={R.lensProp('gold')}
                             title={"Gold"}/>
                    <Counter colour={"white"} value={state.combat} update={setState} lens={R.lensProp('combat')}
                             title={"Combat"}/>
                </Flexbox>
                <Flexbox flexGrow={1} flexDirection={"column"}>
                    <div style={resetButtonStyles}
                         onClick={() => setState(R.pipe(R.set(R.lensProp('gold'), 0), R.over(R.lensProp('combat'), () => 0)))}>
                        END TURN
                    </div>
                    <FactionSelector player={1} update={setState} lens={R.lensPath(['player1', 'colour'])}/>
                    <FactionSelector player={2} update={setState} lens={R.lensPath(['player2', 'colour'])}/>
                </Flexbox>
            </Flexbox>
        </Flexbox>
    );
}

export default App;
