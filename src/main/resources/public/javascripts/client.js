// this file includes the logic for switching between views outside of a game


/**
 Defines a class to render the homepage of the app before a game. From here, the app can send a user to the lobby,
 new game customization screen, or to their current ongoing game.
 */
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.newPlayClick = this.newPlayClick.bind(this);
        this.lobbyClick = this.lobbyClick.bind(this);
        this.getCurrentPlayer = this.getCurrentPlayer.bind(this);
        this.profileClick = this.profileClick.bind(this);
        this.state = {
            newGame: false,
            lobby: false,
            currGame: null,
            profile: false
        }
    }

    // send player to game customization
    newPlayClick() {
        this.setState({newGame: true});
    }

    //send player to profile page
    profileClick() {
        this.setState({profile: true});
        return;
    }

    // put player in lobby
    lobbyClick() {
        this.setState({lobby: true});
    }
    // functions needed for async to work
    // get the current player
    async getCurrentPlayer() {
        return await (await fetch("/players")).json();
    }
    // get the current game
    async getCurrentGame() {
        // get the player's current game if we haven't already
        let currGame = this.state.currGame;
        if (currGame == null) {
            let currPlayer = await (await fetch("/players")).json();
            currGame = await findUserGame(currPlayer);
            this.setState({currGame: currGame});
        }
    }

    componentDidMount() {
        this.getCurrentGame();
    }

    render() {
        // if the player is already in a game, let them finish it
        let currGame = this.state.currGame;
        if (currGame != -1 && currGame != null) {
            console.log("Redirecting to game.");
            window.location.href = "./game.html";
        }

        let display =
            <div className={"title-div"}>
                <h1>Welcome to Debate Night!</h1>
                <button className={"userProfile-button"} onClick={this.profileClick}>User Profile</button>
                <div>You can either create your own game or join existing games below.</div>
                <br/>
                <button className={"newGame-button"} onClick={this.newPlayClick}>New Custom Game</button>
                <button className={"lobby-button"} onClick={this.lobbyClick}>View Lobby</button>
                <br/>
                <br/>
                <p>
                    Debate Night is a fun, 1v1 online debate application
                    where you choose a topic of your choice. To play the game, enter 3 opening arguments within the
                    allotted time frame. During the rebuttal stage, like or dislike your opponents arguments. If you
                    dislike an argument, be prepared to give a good reason why! Remember, low quality rebuttals give
                    less points; if you can't think of a good rebuttal, like the argument and move on. Rack up points
                    by giving good rebuttals or getting likes from your opponent. Good luck!
                </p>
            </div>;

        if (this.state.newGame) {
            display = <GameCreation/>;
        }
        if (this.state.lobby) {
            // return the home screen, unless the player presses the button
            display = <Lobby/>;
        }
        if (this.state.profile) {
            display = <Profile/>
        }
        return (display);
    }
}


/**
 * Class for rendering saved player information.
 */
class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.backClick = this.backClick.bind(this);
        this.getProfileData = this.getProfileData.bind(this);
        this.state = {
            wins: 0,
            losses: 0,
            score: 0,
            username: null
        }
    }

    backClick() {
        this.setState({profile: false});
    }

    // get the current player
    async getProfileData() {
        let player =  await (await fetch("/players")).json();
        this.setState({
            wins: getStatusValue(player.status, "wins"),
            losses: getStatusValue(player.status, "losses"),
            score: player.score,
            username: player.username
        });
    }

    // get the user's data on load
    componentDidMount() {
        this.getProfileData();
    }

    render() {
        let display =
            <div>
                <h1>User Profile</h1>
                <br/>
                <p>Username: {this.state.username} </p>
                <p>Wins: {this.state.wins}</p>
                <p>Losses: {this.state.losses}</p>
                <p>Debate Score: {this.state.score} </p>
                <button className={"back-button"} onClick={this.backClick}>Back Home</button>
            </div>;

        // go back home
        if(this.state.profile == false) {
            display = <Home/>;
        }
        return (display);
    }
}


/**
 * Helps create a new game. Dropdown lists to choose your time, topic and stance on a topic.
 */
class GameCreation extends React.Component {
    constructor(props) {
        super(props);
        this.handleContinue = this.handleContinue.bind(this);
        this.lobbyClick = this.lobbyClick.bind(this);
        this.backClick = this.backClick.bind(this);
        this.changeText=this.changeText.bind(this);
        this.state = {specificButtons: false, lobby: false, username: null, timer: 0, topic: null, pro_con: 0}
    }

    //when the user clicks the Continue button, want to show some stuff
    async handleContinue() {
        // find the player's username
        let currPlayer = await (await fetch("/players")).json(); //gets current user name from database
        let currPlayerUN = currPlayer.username;

        // save the states of the game settings
        let timer = document.getElementById("time-dropdown").value;
        if (timer == "") {
            alert("You forgot to set a time!");
            return;
        }
        let topic = document.getElementById("topic").value;
        if(topic=="") {
            alert("You forgot to set a topic!");
            return;
        }
        let pro_con = document.getElementById("pro-con-dropdown").value;
        if (pro_con == "") {
            alert("You forgot to set your stance on the topic (pro/con)!");
            return;
        }
        this.setState({specificButtons:true, username:currPlayerUN, timer:timer, topic:topic, pro_con: pro_con});
    }

    //when user is ready to go to the lobby, create the game object and exit game creation
    async lobbyClick(buttonString, stanceId) {
        // set the pro/con player correctly
        let proPlayer = "null";
        let conPlayer = "null";
        let stance = "proStance:";
        if (this.state.pro_con == 1) {
            proPlayer = this.state.username;
        }
        else {
            conPlayer = this.state.username;
            stance = "conStance:"
        }

        // set the status
        let status = "timer:" + this.state.timer.toString() + ";" + "topic:" + this.state.topic + ";"
            + stance + buttonString + ";" + "stanceId:" + stanceId + ";" + "stage:waiting;";

        // create new game on the server
        sendGametoServer(status, proPlayer, conPlayer);
        this.setState({lobby:true})
    }

    //back button
    async backClick() {
        this.setState({specificButtons: false, lobby: false});
    }

    //change the text in currval
    changeText() {
        let currVal=document.getElementById("topic-dropdown").value;
        document.getElementById("topic").value=currVal;
    }

    render() {
        let display;

        if (!this.state.lobby && !this.state.specificButtons) {
            display =
                <div>
                    <div>
                        <p>How long would you like your debate?</p>
                        <select id="time-dropdown">
                            <option value={""} disabled={true} selected={true}>Select a debate time</option>
                            <option value={2}>2 Minute</option>
                            <option value={4}>4 Minutes</option>
                            <option value={6}>6 Minutes</option>
                            <option value={8}>8 Minutes</option>
                            <option value={10}>10 Minutes</option>
                        </select></div>
                    <p>
                        What do you want to debate? Try to keep things broad so that you can indicate yourself as either
                        for (pro) or against (con) your topic.
                    </p>

                        <textarea id="topic" placeholder="ie) Gun control in schools"></textarea>
                        <h1>OR</h1>
                        <p>Choose an existing topic</p>
                    <div>
                        <select id="topic-dropdown" defaultValue={""} onChange={this.changeText}>
                            <option value={""} disabled={true} selected={true}>Select a preset topic</option>
                            <option value="The UK Royal Family">The UK Royal Family</option>
                            <option value="The Democratic Party">The Democratic Party</option>
                            <option value="The Republican Party">The Republican Party</option>
                            <option value="The Current President">The Current President</option>
                            <option value="Coca-Cola">Coca-Cola</option>
                            <option value="PepsiCo">PepsiCo</option>
                            <option value="The Death Penalty">The Death Penalty</option>
                            <option value="Prison Reform">Prison Reform</option>
                            <option value="Abortion">Abortion</option>
                            <option value="Gun Control">Gun Control</option>
                            <option value="Planned Parenthood">Planned Parenthood</option>
                            <option value="Confederate monuments">Confederate monuments</option>
                            <option value="Brexit">Brexit</option>
                            <option value="Hong Kong">Hong Kong independence</option>
                            <option value="Edward Snowden">Edward Snowden</option>
                            <option value="Paying college athletes">Paying college athletes</option>
                            <option value="Climate change">Climate change</option>
                            <option value="Affirmative Action">Affirmative Action</option>
                            <option value="Apollo Moon landing (real or hoax?)">Apollo Moon landing (real or hoax?)</option>
                            <option value="Is Tupac alive?">Is Tupac alive?</option>
                            <option value="The electoral college">The electoral college</option>
                            <option value="Gender neutral bathrooms">Gender neutral bathrooms</option>
                            <option value="Same Sex marriage">Same Sex marriage</option>
                            <option value="Internet censorship">Internet censorship</option>
                        </select></div>
                    <div>
                        <p>Are you for this topic or against this topic?</p>
                        <select id="pro-con-dropdown">
                            <option value={""} disabled={true} selected={true}>Select Pro or Con</option>
                            <option value={1}>Pro</option>
                            <option value={0}>Con</option>
                        </select></div>
                    <button onClick={this.handleContinue}>Continue</button>
                    </div>

        } else if (this.state.specificButtons && !this.state.lobby) {
            let buttonStringRA = specificStrings(this.state.username, this.state.topic, this.state.pro_con);
            display=
                <div>
                    <h2>How would you like your debate to appear to potential opponents in the lobby?</h2>
                    <button onClick={() => this.lobbyClick(buttonStringRA[0], 0)}>{buttonStringRA[0]}</button>
                    <br/>
                    <button onClick={() => this.lobbyClick(buttonStringRA[1], 1)}>{buttonStringRA[1]}</button>
                    <br/>
                    <button onClick={() => this.lobbyClick(buttonStringRA[2], 2)}>{buttonStringRA[2]}</button>
                    <br/>
                    <button onClick={() => this.lobbyClick(buttonStringRA[3], 3)}>{buttonStringRA[3]}</button>
                    <br/>
                    <button onClick={() => this.lobbyClick(buttonStringRA[4], 4)}>{buttonStringRA[4]}</button>
                    <br/>
                    <button onClick={() => this.lobbyClick(buttonStringRA[5], 5)}>{buttonStringRA[5]}</button>
                    <br/>
                    <button onClick={this.backClick}>I would like to modify my topic.</button>
                </div>
        }

        // send player to game after it is created
        else if(this.state.lobby) {
            window.location.href = "./game.html";
        }
        return (display);
    }
}


/**
 * Lobby class used to render a list of open games on the server. From here, players can join open games made by other
 * players.
 */
class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = { openGames: [], specGames: [], gamePicked: false, goBack: false, interval: null };
        this.getDataFromServer = this.getDataFromServer.bind(this);
        console.log("Finding open games.");
    }

    async getDataFromServer() {
        // get all games from server
        let gamesList = await (await fetch("/games")).json();

        // find the games with missing players
        let openGames = [];
        let specGames = [];
        gamesList.forEach(function (game) {
            // check if game is open
            if ((game.proPlayer == "null") || (game.conPlayer == "null") ) {
                openGames.push(game);
            }
            else {
                // check if game is in the rebuttals stage
                // get the current time- convert to milliseconds using Date.parse()
                let currentTime = Date();
                currentTime = Date.parse(currentTime);
                // get the start time
                let status = game.status;
                let startTime = Date.parse(getStatusValue(status, "start"));
                // get the end time
                let duration = parseInt(getStatusValue(status, "timer")) * 60000;
                let openingTime = startTime + (duration/3);
                let endTime = startTime + duration;
                // if the game is in the rebuttals stage, add it to the spectatable games list
                if ((currentTime > openingTime) && (currentTime < endTime) && (game.proPlayer != "finished") && (game.conPlayer != "finished")) {
                    specGames.push(game);
                }
            }
        });

        // save the game's nodes to the state for rendering
        this.setState({ openGames: openGames, specGames: specGames });
    }

    componentDidMount() {
        let interval = window.setInterval(() => { this.getDataFromServer(); }, 300);
        this.setState({interval: interval});
    }

    componentWillUnmount() {
        window.clearInterval(this.state.interval);
    }

    gameWasClicked() {
        this.setState({gamePicked: true});
    }

    backClick() {
        this.setState({goBack: true});
    }

    render () {
        // render all open games while in the lobby
        let display =
            <div>
                <h1>Game Lobby</h1>
                <table>
                    <tr>
                        <th>Opponents</th>
                        <th>Topic</th>
                        <th>Your Stance Will Be</th>
                        <th>Time</th>
                        <th>{" "}</th>
                    </tr>
                    <tbody> {this.state.openGames.map(game => <OpenGame key={game.identifier} game={game} onClick={() => this.gameWasClicked()} />)} </tbody>
                    <tbody> {this.state.specGames.map(game => <SpecGame key={game.identifier} game={game} onClick={() => this.gameWasClicked()} />)} </tbody>
                </table>
                <br/>
                <button onClick={() => {this.backClick();}}>Back Home</button>
            </div>;

        if (this.state.goBack == true) {
            window.location.href = "./home.html";
        }
        if (this.state.gamePicked == true) {
            window.location.href = "./game.html";
        }
        return (display);
    }
}


/**
 * Used to render open games on the server to the lobby.
 */
class OpenGame extends React.Component {
    constructor(props) {
        super(props);
        this.joinGameClick = this.joinGameClick.bind(this);
        this.setNewStance = this.setNewStance.bind(this);
        this.state = { gameSelected: false, stance: "" };
    }

    // add player to an open game on click
    async joinGameClick(pro_con) {
        // update proPlayer/conPlayer for game
        let currPlayer = await (await fetch("/players")).json();
        let currPlayerUN = currPlayer.username;
        let formData = new FormData();
        let newStatus = "";
        if (pro_con == 1) {
            formData.append("proPlayer", currPlayerUN);
            await fetch(`/games/${this.props.game.identifier}/proPlayer`, { method: "PUT", body: formData });
            newStatus = updateStatusValue(this.props.game.status, "proStance", this.state.stance);
        }
        else {
            formData.append("conPlayer", currPlayerUN);
            await fetch(`/games/${this.props.game.identifier}/conPlayer`, {method: "PUT", body: formData});
            newStatus = updateStatusValue(this.props.game.status, "conStance", this.state.stance);
        }

        // initialize the debate stage
        formData = new FormData();
        newStatus = updateStatusValue(newStatus, "stage", "opening");
        // get and add the current server time to status
        let current_time = Date();
        newStatus = updateStatusValue(newStatus, "start", current_time.toString());
        formData.append("status", newStatus);
        await fetch(`/games/${this.props.game.identifier}/status`, {method: "PUT", body: formData});

        // leave the lobby- start the game!
        this.setState({gameSelected: true });
        console.log("Game selected.");
        this.props.onClick();
    }

    // helper to generate the player's proposed stance on the table
    async setNewStance(topic, pro_con) {
        // get current player's name
        let currPlayer = await (await fetch("/players")).json();
        let currPlayerUN = currPlayer.username;

        // get which type of stance to generate
        let potentialStances = specificStrings(currPlayerUN, topic, pro_con);
        let stanceId = parseInt(getStatusValue(this.props.game.status, "stanceId"));
        let stance = potentialStances[stanceId];
        this.setState({stance: stance});
    }

    render() {
        // get the data to render
        status = this.props.game.status;
        let topic = getStatusValue(status, "topic");
        let opponent = this.props.game.proPlayer;
        let pro_con = 0;
        if (opponent == "null") {
            opponent = this.props.game.conPlayer;
            pro_con = 1;
        }
        let timer = getStatusValue(status, "timer");

        // set the new player's stance
        this.setNewStance(topic, pro_con);
        let stance = this.state.stance;

        // add game to the lobby's table
        let display =
            <tr>
                <td>{opponent}</td>
                <td>{topic}</td>
                <td>{stance}</td>
                <td>{timer + " min."}</td>
                <td><button className={"lobby-button"} onClick={() => {this.joinGameClick(pro_con);}}>Join Game!</button></td>
            </tr>;
        return (display);
    }
}

/**
 * Used to render games that are in progress so that others can spectate.
 */
class SpecGame extends React.Component {
    constructor(props) {
        super(props);
        this.spectateGameClick = this.spectateGameClick.bind(this);
        this.state = { gameSelected: false };
    }

    // add player as a spectator to a game in the rebuttal stage
    async spectateGameClick() {
        // add the player as a spectator
        let currPlayer = await (await fetch("/players")).json();
        let currPlayerUN = currPlayer.username;
        let spectators = getStatusValue(this.props.game.status, "spectators");
        let newStatus = updateStatusValue(this.props.game.status, "spectators", spectators+currPlayerUN);

        //send status to server
        let formData = new FormData();
        formData.append("status", newStatus);
        await fetch(`/games/${this.props.game.identifier}/status`, {method: "PUT", body: formData});

        // leave the lobby- start the game!
        this.setState({gameSelected: true });
        console.log("Game selected.");
        this.props.onClick();
    }

    render() {
        // get the data to render
        status = this.props.game.status;
        let topic = getStatusValue(status, "topic");
        let opponent = this.props.game.proPlayer + " vs. " + this.props.game.conPlayer;
        let timer = getStatusValue(status, "timer");

        // add game to the lobby's table
        let display =
            <tr>
                <td>{opponent}</td>
                <td>{topic}</td>
                <td>{"Like or dislike anyone!"}</td>
                <td>{timer + " min."}</td>
                <td><button className={"spec-button"} onClick={() => {this.spectateGameClick();}}>Spectate Game!</button></td>
            </tr>;
        return (display);
    }
}

ReactDOM.render(<Home/>, document.querySelector("#home"));
