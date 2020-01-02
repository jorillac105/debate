// this file includes functions that area referenced throughout the codebase

/**
 * Function for linking client side node generation to the database.
 */
function sendNodetoServer(desc, x, y, parentX, parentY, status) {
    // create a form containing all the node parameters
    let formData = new FormData();
    formData.append("description", desc);
    formData.append("x", x);
    formData.append("y", y);
    formData.append("parentx", parentX);
    formData.append("parenty", parentY);
    formData.append("status", status);
    // send the form to the server-side controller
    fetch(`/nodes`, { method: "POST", body: formData });
}


/**
 * Function for sending a new game to the database.
 */
function sendGametoServer(status, proPlayer, conPlayer) {
    // create a new form to hold game data
    let formData = new FormData();
    formData.append("status", status);
    formData.append("proPlayer", proPlayer);
    formData.append("conPlayer", conPlayer);
    // send the form to the server-side controller
    fetch(`/games`, { method: "POST", body: formData });
}


/**
 * Function for calculating a child node's render position the parent's status and position.
 * Returns a list containing the x and y child position as a String
 */
function calcNodePosition(parentX, parentY, status) {
    // note that the server's controller expects a string position
    let newX = parentX;
    let newY = parentY;
    // up
    if (status.includes("up")) {
        newY = parentY - 300;
    }
    // down
    if (status.includes("down")) {
        console.log(parentY);
        newY = parentY + 300;
    }
    // left
    if (status.includes("left")) {
        newX = parentX - 500;
    }
    //right
    if (status.includes("right")) {
        newX = parentX + 500;
    }
    return [newX.toString(), newY.toString()];
}


/**
 * Find a specific game object from the server given a username.
 * Return game object or -1 if the player is not found.
 */
async function findUserGame(player) {
    // fetch all games from the server
    let gamesList = await (await fetch("/games")).json();
    // search for the player in a game (players can only belong to one game at a time)
    let playerGame = -1;
    gamesList.forEach(function (game) {
        // check if user is an active player or spectator
        let spectators = getStatusValue(game.status, "spectators");
        if ((game.proPlayer == player.username) || (game.conPlayer == player.username) || (spectators.includes(player.username))) {
            playerGame = game;
        }
    });
    return playerGame;
}


/**
 * Parse a given status in one of the models for the app.
 * Return the value of the status or null if the status does not exist.
 */
function getStatusValue(status, query) {
    // statuses are semicolon separated- break up string into components
    let statusList = status.split(";");

    // figure out if a specific status is in the status
    let specificStatus = null;
    statusList.forEach(function (element) {
        if (element.includes(query)) {
            // status found
            specificStatus = element;
        }
    });

    // parse the string to get the value of the specific status
    if (specificStatus === null) {
        return "";
    }
    let index = specificStatus.indexOf(":") + 1;
    let statusValue = specificStatus.substring(index);
    return statusValue;
}


/**
 * Given a status string, query to update, and a new value, update the queried status with certain value.
 * Return the edited string.
 */
function updateStatusValue(status, query, newValue) {
    // statuses are semicolon separated- break up string into components
    let statusList = status.split(";");

    // create a new array without the status of interest
    let newStatus = [];
    statusList.forEach(function (element) {
        if (element.includes(query)) {
            // do nothing
            console.log("Updated status.");
        }
        else {
            newStatus.push(element);
        }
    });

    // parse the string to get the value of the specific status
    // add a new value to the status
    let updatedStatus = newStatus.join(";") + query + ":" + newValue + ";";
    return updatedStatus;
}


/**
 * Give the user several options for what their debate topic should be.
 * Returns an array of potential strings for the user to choose from.
 */
function specificStrings(username, topic, pro_con) {
    let ra=[];
    //pro
    if(pro_con == 1) {
        ra.push(username+" is in support of "+topic);
        ra.push(username+" agrees with "+topic);
        ra.push(username+" likes "+topic);
        ra.push(username+" loves "+topic);
        ra.push(username+" is pro "+topic);
        ra.push(username+" is for "+topic);
    }
    else { //con
        ra.push(username+" is not in support of "+topic);
        ra.push(username+" disagrees with "+topic);
        ra.push(username+" dislikes "+topic);
        ra.push(username+" hates "+topic);
        ra.push(username+" is con "+topic);
        ra.push(username+" is against "+topic);
    }
    return ra;
}


/**
 *  Uses NLP to assign a score to the player. First, we tokenize the input and count the number of symbols. Symbols
 *  decrease your score since they are associated with bad words and spam. We then remove stopwords and punctuation
 *  and count the number of unique words, which increase your score. Bonuses/penalties are added to your score
 *  based on number of likes/dislikes; it is possible to get a negative score.
 */
function endGameScore(currPlayer, currGame, nodesList) {
    // iterate through all nodes belonging to this game and this player
    let symbolCount = 0;
    let uniqueWords = 0;
    let loveCount = 0;
    let hateCount = 0;

    // array of common English stopwords from NLTK's library
    let stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now'];
    // array of symbols used to symbolize bad words (also tend to be overused/spam)
    let badSymbols = ['!', '#', '$', '&', '?', '@'];
    nodesList.forEach(
        function (element) {
            // check if node belongs to the user and the current game
            let nodeOwner = getStatusValue(element.status, "user");
            let gameOwner = getStatusValue(element.status, "gameid");
            if ((nodeOwner == currPlayer) && (gameOwner == currGame.identifier)) {
                // count symbols associated with typical bad words/ spam
                for(var i = 0; i < element.description.length; i++) {
                    if (badSymbols.includes(element.description[i])) {
                        symbolCount++;
                    }
                }
                // tokenize input by separating on any punctuation mark or space
                let reg = new RegExp("[\\]!\"#\$%&'\(\)\*\+,\.\/:;<=>\?@\[\^_`{\|}~\ ]+");
                let words = element.description.split(reg);

                // remove stopwords
                let goodWords = [];
                for (var i = 0; i < words.length; i++) {
                    if (stopwords.includes(words[i])) {
                        continue;
                    }
                    goodWords.push(words[i]);
                }

                // count unique words
                let wordsSet = new Set(goodWords);
                uniqueWords += wordsSet.size;

                // count likes
                let likes = getStatusValue(element.status, "love");
                loveCount += parseInt(likes);

                // count dislikes
                let dislikes = getStatusValue(element.status, "hate");
                hateCount += parseInt(dislikes);
            }
        }
    );
    // give unique words a positive multiplier and give bad words a negative multiplier
    // increment multiplier by 1 to avoid having 0 as the multiplier
    // offset by 100 to avoid negatives and give users points for playing
    let score = (uniqueWords * (loveCount+1)) - (symbolCount * (hateCount+1)) + 100;
    return [score, uniqueWords, hateCount, loveCount];
}
