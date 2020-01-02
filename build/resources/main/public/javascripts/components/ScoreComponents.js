// this file contains components related to scoring the game

/**
 * A alternative scoring view meant for spectators!
 */
class SpecEnd extends React.Component {
    constructor(props) {
        super(props);
        this.homeClick = this.homeClick.bind(this);
    }

    homeClick() {
        this.props.onClick();
    }

    render() {
        let display =
            <div>
                <h1>End of Debate!</h1>
                <p>The winner was</p>
                <h1>{this.props.winner}</h1>
                <p>Thanks for participating! Enjoy 15 free participation points!</p>
                <p>{"Your new score is: " + this.props.score}</p>
                <button onClick={() => this.homeClick()}>Home</button>
            </div>;
        return (display);
    }
}

/**
 * Defines a class that renders the scoring screen and provides an exit back to the home page.
 */
class EndGame extends React.Component {
    constructor(props) {
        super(props);
        this.handleHomeClick = this.handleHomeClick.bind(this);
        this.endGameScore = this.endGameScore.bind(this);
        this.state = {
            returnHome: false,
            score: 0,
            currGame: null,
            currPlayer: null,
            nodes: [],
            dislikes: 0,
            likes: 0,
            uniques: 0,
            winStatus: "",
            spectator: false
        }
    }

    async handleHomeClick() {
        // remove player from game on the server
        let currPlayer = this.state.currPlayer;
        let currGame = this.state.currGame;
        let formData = new FormData();
        if (currPlayer.username == currGame.proPlayer) {
            formData.append("proPlayer", "finished");
            await fetch(`/games/${currGame.identifier}/proPlayer`, { method: "PUT", body: formData });
        }
        else if (currPlayer.username == currGame.conPlayer) {
            formData.append("conPlayer", "finished");
            await fetch(`/games/${currGame.identifier}/conPlayer`, {method: "PUT", body: formData});
        }
        // remove spectator
        else {
            let spectators = getStatusValue(currGame.status, "spectators");
            let newSpec = spectators.replace(currPlayer.username, "");
            let newStatus = updateStatusValue(currGame.status, "spectators", newSpec);
            formData.append("status", newStatus);
            await fetch(`/games/${currGame.identifier}/status`, {method: "PUT", body: formData});
        }

        // save the player's score to the server
        formData = new FormData();
        let newScore = currPlayer.score + this.state.score;
        formData.append("score", newScore);
        await fetch(`/players/${currPlayer.username}/score`, {method: "PUT", body: formData});

        // increment losses or wins in player status on the server; ties don't count
        if (this.state.spectator == false) {
            if (this.state.winStatus.includes("WON")) {
                let numWins = parseInt(getStatusValue(currPlayer.status, "wins"));
                if (isNaN(numWins)) {
                    numWins = 0;
                }
                numWins = numWins + 1;
                let updatedStatus = updateStatusValue(currPlayer.status, "wins", numWins.toString());
                let formData = new FormData();
                formData.append("status", updatedStatus);
                await fetch(`/players/${currPlayer.username}/status`, {method: "PUT", body: formData});
            }
            if (this.state.winStatus.includes("LOST")) {
                let numLosses = parseInt(getStatusValue(currPlayer.status, "losses"));
                if (isNaN(numLosses)) {
                    numLosses = 0;
                }
                numLosses = numLosses + 1;
                let updatedStatus = updateStatusValue(currPlayer.status, "losses", numLosses.toString());
                let formData = new FormData();
                formData.append("status", updatedStatus);
                await fetch(`/players/${currPlayer.username}/status`, {method: "PUT", body: formData});
            }
        }

        // send the player home
        this.setState({returnHome: true});
    }

    /**
     *  Uses NLP to assign a score to the player. First, we tokenize the input and count the number of symbols. Symbols
     *  decrease your score since they are associated with bad words and spam. We then remove stopwords and punctuation
     *  and count the number of unique words, which increase your score. Bonuses/penalties are added to your score
     *  based on number of likes/dislikes; it is possible to get a negative score.
     */
    async endGameScore() {
        // set up state
        let currGame = this.state.currGame;
        let currPlayer = this.state.currPlayer;
        let nodesList = this.state.nodes;
        if (currGame == null) {
            currPlayer = await (await fetch("/players")).json();
            currGame = await findUserGame(currPlayer);
            nodesList = await (await fetch("/nodes")).json();
            this.setState({currGame: currGame});
            this.setState({currPlayer: currPlayer});
            this.setState({nodes: nodesList});
        }

        // check if the player was just spectating
        if (currPlayer.username != currGame.proPlayer && currPlayer.username != currGame.conPlayer) {
            let proInfo = endGameScore(currGame.proPlayer, currGame, nodesList);
            let conInfo = endGameScore(currGame.conPlayer, currGame, nodesList);
            let winStatus = currGame.conPlayer;
            if (proInfo[0] > conInfo[0]) {
                winStatus = currGame.proPlayer;
            }
            if (proInfo[0] == conInfo[0]) {
                winStatus = "IT'S A TIE!";
            }
            this.setState({score: 15, winStatus: winStatus, spectator: true});
            return;
        }

        // find the current player's score
        let scoreInfo = endGameScore(currPlayer.username, currGame, nodesList);
        // save the score to the state and update the player's score on the server
        this.setState({score: scoreInfo[0], uniques: scoreInfo[1], dislikes: scoreInfo[2], likes: scoreInfo[3]});

        // find the opponent's score and set who won
        let opponent = currGame.proPlayer;
        if (currPlayer.username == currGame.proPlayer) {
            opponent = currGame.conPlayer;
        }
        let oppInfo = endGameScore(opponent, currGame, nodesList);
        let winStatus = "YOU WON!";
        if (oppInfo[0] > scoreInfo[0]) {
            winStatus = "YOU LOST!";
        }
        if (oppInfo[0] == scoreInfo[0]) {
            winStatus = "IT'S A TIE!";
        }
        this.setState({winStatus: winStatus});
    }

    componentDidMount() {
        console.log("Calculating player score.");
        this.endGameScore();
    }

    render () {
        // show the player's score and provide a button to loop back home
        let display =
            <div className={"scoring-div"}>
                <h1>End of Debate!</h1>
                <p>{"Total Unique Words: " + this.state.uniques}</p>
                <p>{"Total Dislikes: " + this.state.dislikes}</p>
                <p>{"Total Likes: " + this.state.likes}</p>
                <p>Your final score is: {this.state.score}</p>
                <h1>{this.state.winStatus}</h1>
                <button className={"home-button"} onClick={this.handleHomeClick}>Home</button>
            </div>;

        // spectator view
        if (this.state.spectator == true) {
            display = <SpecEnd score={parseInt(this.state.currPlayer.score) + this.state.score} winner={this.state.winStatus} onClick={() => this.handleHomeClick()}/>;
        }

        // go home
        if (this.state.returnHome == true) {
            window.location.href = "./home.html";
        }
        return (display);
    }
}

ReactDOM.render(<EndGame/>, document.querySelector("#scorer"));
