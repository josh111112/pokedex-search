import readline from 'readline'
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// displays all menu options
async function showMenu() {
    console.log(" 1 Search for a Pokemon \n 2 Search for an Item \n 3 Search for a Move\n 4 To Exit");

    const choice = await new Promise((resolve) => {
        rl.question("Make a choice ", resolve);
    });

    if (choice == '1') {
        await prompt(searchPoke);
    } else if (choice == '2') {
        await prompt(searchItem);
    } else if (choice == '3') {
        await prompt(searchMove);
    } else if (choice == '4') {
        rl.close();
    } else {
        console.log("incorrect command!!");
        showMenu();
    }
    
}

/** 
 * will use readline to ask the user for a search term.
 * It will then call the function passed into it(which is what cb is - a callback function), 
 * and pass the data the user entered as a parameter. aka pokemon move or item
 */
async function prompt(cb) {
    // ask for a search term
    const term = await new Promise((resolve) => {
        rl.question("Enter your search term ", resolve);
    });

    await cb(term);
}

/**
 * will query the API for a particular Pokemon (passed in as term).
 * If it receives a valid response, it will call printPoke(json) with the json to print out the name, weight, height, base experience, and all the moves for that Pokemon. 
 * It will then call run() again to reprompt.
 */
async function searchPoke(term) { 
    try {
        const poke = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}`);
        const pokeData = await poke.json();
        await printPoke(pokeData)
    } catch (err) {
        console.error("Error searching Pokemon", err);
        run();
    }
}

/**
 * print the data for the Pokemon in a neat and clean way.
 */
async function printPoke(json) {
    // Access specific fields of the JSON object
    // Print the selected information
    const moveslen = json.moves.length
    const showNumMoves = await new Promise((resolve) => {
        console.log("There are ", moveslen, " moves");
        rl.question("How many moves would you like to show? ", resolve);
    });
    if (showNumMoves > moveslen || showNumMoves < 1 || typeof showNumMoves != 'number') {
        console.log("Invalid number of moves");
        run();
    }
    console.log("Name: ", json.name, "\nHeight(meters): ", (json.height)/10, "\nWeight: ", json.weight);
    for (let i = 0; i < showNumMoves; i++) {
            console.log("Move: ", json.moves[i].move.name);
    }

    for (let i = 0; i < json.abilities.length; i++) {
        let currAbility = await fetch(json.abilities[i].ability.url);
        let currAbilityJson = await currAbility.json();
        console.log("Ability: ", json.abilities[i].ability.name, "\nEffect: ",
            currAbilityJson.effect_entries[1].effect);
    }
    run();
}

/**
 * works exactly like the searchPoke() function, except searches the Item endpoint for an item. 
 * Calls the corresponding printItem(json) method. Calls run() to reprompt.
 */
async function searchItem(term) {
    try {
        const item = await fetch(`https://pokeapi.co/api/v2/item/${term}`);
        const itemJSON = await item.json();
        await printItem(itemJSON);
    } catch (err) {
        console.error("Error searching item", err);
        run();
    }
}

/**
 * prints item data neatly. Pick at least four fields to display from the endpoint's data.
 */
async function printItem(json) {
    // we have name, cost, category, and effects
    console.log("\nName: ", json.name, "\nCost: ", json.cost, "\nCategory: ", json.category.name);
    //find right language to print the effects
    for (let i = 0; i < json.effect_entries.length; i++) {
        if (json.effect_entries[i].language.name == 'en') {
            console.log("Effect: ", json.effect_entries[i].effect)
        }
    }
    run();
}

/**
 * works exactly like the searchPoke() function, except searches the Move endpoint for a move. 
 * Calls the corresponding printMove(json) method.
 */
async function searchMove(term) {
    try {
        const move = await fetch(`https://pokeapi.co/api/v2/move/${term}`);
        const moveJSON = await move.json();
        await printMove(moveJSON)
    } catch (err) {
        console.error("Error searching move", err);
        run();
    }
}

/**
 * prints the move data in a neatly formatted way. Calls run() to reprompt.
 */
async function printMove(json) {
    console.log("Name: ", json.name);
    console.log("Type: ", json.type.name);
    console.log("Power: ", json.power);
    for (let i = 0; i < json.effect_entries.length; i++) {
        if (json.effect_entries[i].language.name == 'en') {
            console.log("Effect: ", json.effect_entries[i].effect)
        }
    }
    run();
}

/**
 * will call showMenu(), then use readline to ask the user to enter their choice. 
 * We will call the prompt function and pass to it the name of the function we wish to use for searching.
 */
async function run() {
    await showMenu();
}
await run();