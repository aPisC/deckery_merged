# Custom scripting

The game area uses AdderScript as scripting language, extended with custom modules and functions

## Functions
- `try(action: function, catch: function)`: calls the action, and wraps it in a try-catch block. calls the catch function is an error occures.
- throw(message: string): throws an exception with the given message
- `log(...params: any)`: logging to console
- `setInterval, setTimeout, clearInterval, clearTimeout`

## Modules
### Player
The player module provides the following functions:
- `selectTargetPlayer(playerId: number): void`
- `getPlayer(playerId: number): dict`
- `getOwnPlayer(): dict`
- `getTargetPlayer(): dict`
- `getPlayers(): list(dict)`

### Card
The card module provides the following functions
- `updateCard(cardId: number, data: dict)`: updates the given card with the fields of data
- `getCard(cardId: number): dict`
- `getContainerCards(containerId: number): list(dict)`

### Container
The container module provides the following functions
- `moveCard(cards: list(dict /*CardRef*/), from: number, to: number)`
- `setTopCard(card: dict /*CardRef*/, containerId)`
- `removedCard(card: dict /*CardRef*/, containerId)`
- `insertedCard(card: dict /*CardRef*/, containerId)`
- `getContainer(containerId: number|null = null): dict`: return the current container, or the container identified by id (The current container is determined by containerId field in privateEnv)
- `getContainerByTag(tag: string, playerId: number|null = null): dict`: returns a container with the given tag from the given player, or from the board if the playerId is null
