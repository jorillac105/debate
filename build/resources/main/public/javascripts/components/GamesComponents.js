// this file contains all the logic related to switching stages of a game
const {Layer, Rect, Stage, Group, Circle, Text, Line} = ReactKonva;


/**
 Defines a class to provide the player an area to wait for other players to join.
 */
class WaitingRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {foundPlayer: false, goBack: false};
    }

    render() {
        let display =
            <div>
                <h1>Waiting for players...</h1>
                <br/>
                {/*<p>Taking too long? Try joining a game instead.</p>*/}
                {/*<br/>*/}
                {/*<button>Go Back Home</button>*/}
            </div>;
        return (display);
    }
}

/**
 Defines a class to provide the player an area to enter their opening arguments for the debate.
 */
class DebateSetUp extends React.Component {
    constructor(props) {
        super(props);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.state = {
            debateSetUp: false
        }
    }

    async handleConfirm() {
        // get text from the opening arguments
        let text1 = document.getElementById("argument-1").value;
        let text2 = document.getElementById("argument-2").value;
        let text3 = document.getElementById("argument-3").value;
        // prevent user from sending more responses
        document.getElementById('argument-1').readOnly = true;
        document.getElementById('argument-2').readOnly = true;
        document.getElementById('argument-3').readOnly = true;
        document.getElementById('lock-button').style.visibility = "hidden";

        // get the current player and assign opening arguments to nodes at "time's up"
        // get the current player from the server and set the node's user to be the player
        let currPlayer = await (await fetch("/players")).json();
        let currGame = await findUserGame(currPlayer);
        let allstatus = "user:" + currPlayer.username + ";gameid:" + currGame.identifier + ";hate:0;love:0";
        let status = "";
        // create node with correct direction, player info, and game info
        if (currGame.proPlayer === currPlayer.username) {
            // render pro player nodes
            // up
            status = allstatus + ";direction:up;color:#b0e0e6;";
            sendNodetoServer(text1, "600", "100", "600", "300", status);
            // down
            status = allstatus + ";direction:down;color:#b0e0e6;";
            sendNodetoServer(text2, "600", "500", "600", "300", status);
            // left
            status = allstatus + ";direction:left;color:#b0e0e6;";
            sendNodetoServer(text3, "100", "300", "600", "300", status);
        }
        else {
            // render con player nodes
            // up
            status = allstatus + ";direction:up;color:#ffcccb;";
            sendNodetoServer(text1, "1300", "100", "1300", "300", status);
            // down
            status = allstatus + ";direction:down;color:#ffcccb;";
            sendNodetoServer(text2, "1300", "500", "1300", "300", status);
            // right
            status = allstatus + ";direction:right;color:#ffcccb;";
            sendNodetoServer(text3, "1800", "300", "1300", "300", status);
        }

        // move to the next debate stage- sync with server side
        console.log("Sent nodes to server.");
        this.setState({debateSetUp: true});
    }

    render() {
            let currentTime = Date();
            currentTime = Date.parse(currentTime);
            let displayNum = this.props.startTime - currentTime;
            let displayTime = displayNum.toString();
            displayTime = displayTime.substring(0, displayTime.length - 3);
           let display =
                <div className={"debate-set-up-div"}>
                    <span className={"Timer"}>{displayTime + " secs left"}</span>
                    <textarea rows={"8"} cols={"60"} id={"argument-1"} placeholder={"Type your first evidence point here!"}></textarea>
                    <br/>
                    <textarea rows={"8"} cols={"60"} id={"argument-2"} placeholder={"Type your second evidence point!"}></textarea>
                    <br/>
                    <textarea rows={"8"} cols={"60"} id={"argument-3"} placeholder={"Type your third evidence point!"}></textarea>
                    <br/>
                    <button id={"lock-button"} onClick={this.handleConfirm}>Lock in answers!</button>
                </div>;
        // return the type in arguments screen- until time runs out or the player presses confirm
        return (display);
    }
}

/**
 * Defines a class that generates the interactive debate tree on the client side.
 */
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            waiting: true,
            opening: false,
            gameEnded: false,
            editingNode: false,
            nodeX: 0,
            nodeY: 0,
            nodeStatus: "",
            currGame: null,
            endTime: null,
            startTime: null,
            interval: null
        };
        this.nodeWasClicked = this.nodeWasClicked.bind(this);
        this.postNode = this.postNode.bind(this);
        this.calculateGameStage = this.calculateGameStage.bind(this);
        this.resetScroll = this.resetScroll.bind(this);
    }

    // stores the position and status of a node that was clicked on
    // note that this position will become the parent position for a new node
    nodeWasClicked(nodeX, nodeY, nodeStatus) {
        this.setState({editingNode: true});
        this.setState({nodeX: nodeX});
        this.setState({nodeY: nodeY});
        this.setState({nodeStatus: nodeStatus});
        console.log("Entering text area.");
    }

    // use the start time and the timer in a game's status to calculate the game stage
    // opening should take 1/3 of total time
    // rebuttal takes the rest
    async calculateGameStage() {
        // get the player's current game if we haven't already
        let currGame = this.state.currGame;
        if (currGame == null) {
            let currPlayer = await (await fetch("/players")).json();
            currGame = await findUserGame(currPlayer);
            this.setState({currGame: currGame});
        }

        // missing a player- render the waiting screen; fetch a new game instance while waiting
        if (currGame.proPlayer == "null" || currGame.conPlayer == "null") {
            let currPlayer = await (await fetch("/players")).json();
            currGame = await findUserGame(currPlayer);
            this.setState({currGame: currGame});
            this.setState({waiting: true});
            return;
        }
        // both players have joined- waiting is over
        this.setState({waiting: false});

        // the game was ended early by a player
        if (currGame.proPlayer == "finished" || currGame.conPlayer == "finished") {
            this.setState({gameEnded: true});
            return;
        }

        // get the current time- convert to milliseconds using Date.parse()
        let currentTime = Date();
        currentTime = Date.parse(currentTime);
        // get the start time
        let status = currGame.status;
        let startTime = Date.parse(getStatusValue(status, "start"));
        // get the end time
        let duration = parseInt(getStatusValue(status, "timer")) * 60000;
        let openingTime = startTime + (duration/3);
        let endTime = startTime + duration;
        this.setState({endTime: endTime});
        this.setState({startTime: openingTime});

        // figure out the player's screen
        // opening
        if (currentTime < openingTime) {
            this.setState({opening: true});
            return;
        }
        // rebuttal
        this.setState({opening: false});
        // scoring
        if (currentTime > endTime) {
            this.setState({gameEnded: true});
            return;
        }
    }

    componentDidMount() {
        let interval = window.setInterval(() => { this.calculateGameStage(); }, 2000);
        this.setState({interval: interval});
    }

    componentWillUnmount() {
        window.clearInterval(this.state.interval);
    }

    // game end text was clicked- take the player to the scoring page
    endClicked() {
        this.setState({gameEnded: true});
        console.log("Game ended.");
    }

    //post the correct child node to the server after a click event
    async postNode() {
        // get the node's description from the popup text area
        let text = document.getElementById("rebuttal").value;

        // get the node's new position given the parent position stored in the state
        let coord = calcNodePosition(this.state.nodeX, this.state.nodeY, this.state.nodeStatus);
        let x = coord[0];
        let y = coord[1];
        let parentX = this.state.nodeX.toString();
        let parentY = this.state.nodeY.toString();

        // edit the parent status to include the correct player and color
        // get current player
        let currPlayer = await (await fetch("/players")).json();
        let newStatus = updateStatusValue(this.state.nodeStatus, "user", currPlayer.username);

        // swap color because a rebuttal will always be the opposite color of the current player
        let newColor = "#b0e0e6";
        let currColor = getStatusValue(this.state.nodeStatus, "color");
        if (currColor == newColor) {
            newColor = "#ffcccb"
        }
        newStatus = updateStatusValue(newStatus, "color", newColor);

        // reset likes and dislikes
        newStatus = updateStatusValue(newStatus, "love", "0");
        newStatus = updateStatusValue(newStatus, "hate", "0");
        newStatus = updateStatusValue(newStatus, "likers", "");
        newStatus = updateStatusValue(newStatus, "skeptics", "");

        // send the node to the server and end the text area pop up
        sendNodetoServer(text, x, y, parentX, parentY, newStatus);
        this.setState({editingNode: false});
    }

    resetScroll() {
        let width = document.width;
        window.scrollTo(0, width/2);
    }

    render() {
        //this.componentCalculation();
        let display = null;

        // the player opened the game URL page without actually having a game- send them home :)
        if (this.state.currGame == -1) {
            window.location.href = "./home.html";
            alert("You have no open games! Redirecting you home.");
            display = <WaitingRoom/>;
        }

        // render the waiting room
        else if (this.state.waiting == true || this.state.currGame == null) {
            display = <WaitingRoom/>;
        }

        // render the opening phase
        else if (this.state.opening == true) {
            display = <DebateSetUp startTime={this.state.startTime}/>;
        }

        // render a text area if creating a rebuttal
        else if (this.state.editingNode == true) {
            display =
                <div>
                    <textarea rows={"8"} cols={"60"} id={"rebuttal"} placeholder={"Type in a rebuttal!"}></textarea>
                    <br/>
                    <button className={"play-button"} onClick={this.postNode}>Add rebuttal!</button>
                </div>;
        }

        // render the scoring page
        else if (this.state.gameEnded == true) {
            console.log("Redirecting to score page.");
            window.location.href = "./scorer.html";
        }

        else {
            // if no other statuses, render the main game stage
            let currentTime = Date();
            currentTime = Date.parse(currentTime);
            let displayNum = this.state.endTime - currentTime;
            let displayTime = displayNum.toString();
            displayTime = displayTime.substring(0, displayTime.length - 3);

            display =
            <div onLoad={this.resetScroll}>
                <span className={"Timer"}>{displayTime + " secs left"}</span>
                <Stage width={3000} height={3000} draggable={true}>
                    <Layer>
                        {/*Renders all nodes posted to the server*/}
                        <Conversation onClick={(nodeX, nodeY, nodeStatus) => this.nodeWasClicked(nodeX, nodeY, nodeStatus)}/>
                        {/*Renders player one's tree*/}
                        <Rect
                            x={600}
                            y={300}
                            width={400}
                            height={100}
                            fill={'#b0e0e6'}
                            stroke={'#555'}
                            strokewidth={5}
                            shadowBlur={10}
                            shadowOffset={[10, 10]}
                            shadowOpacity={0.2}
                            cornerRadius={10}
                        />
                        <Text x={600} y={330} fontSize={30} width={400} fontFamily='Raleway' fill='black'
                              align='center' text={getStatusValue(this.state.currGame.status, "proStance")}/>
                        {/*Renders player two's tree*/}
                        <Rect
                            x={1300}
                            y={300}
                            width={400}
                            height={100}
                            fill={'#ffcccb'}
                            stroke={'#555'}
                            strokewidth={5}
                            shadowBlur={10}
                            shadowOffset={[10, 10]}
                            shadowOpacity={0.2}
                            cornerRadius={10}
                        />
                        <Text x={1300} y={330} fontSize={30} width={400} fontFamily='Raleway' fill='black'
                              align='center' text={getStatusValue(this.state.currGame.status, "conStance")}/>
                        <Text x={1050} y={330} fontSize={20} width={200} fontFamily='Raleway' fill='black'
                              align='center' stroke='black' text='LEAVE GAME' onClick={() => this.endClicked()}/>
                    </Layer>
                </Stage>
            </div>;
        }
        return (display);
    }
}

ReactDOM.render(<Game/>, document.querySelector("#game"));
