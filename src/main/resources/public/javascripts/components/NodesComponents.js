// this file contains all the logic related to the inner components of a game
const {Layer, Rect, Stage, Group, Circle, Text, Line} = ReactKonva;


/**
 * A class that automatically generates a debate tree given the nodes in the database
 */
class Conversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { nodes: [], currGame: null, interval: null };
        this.getDataFromServer = this.getDataFromServer.bind(this);
        this.nodeWasClicked = this.nodeWasClicked.bind(this);
        console.log("Generating conversation.");
    }

    async getDataFromServer() {
        // get all nodes from server and find the right game if we haven't already
        let nodesList = await (await fetch("/nodes")).json();
        let currGame = this.state.currGame;
        if (currGame == null) {
            let currPlayer = await (await fetch("/players")).json();
            currGame = await findUserGame(currPlayer);
            this.setState({currGame: currGame});
        }

        // check if the node is part of the player's current game
        let gameNodes = [];
        nodesList.forEach(function (node) {
            // check if node belongs to the game
            let nodeId = getStatusValue(node.status,"gameid");
            if (nodeId === currGame.identifier.toString()) {
                gameNodes.push(node);
            }
        });

        // save the game's nodes to the state for rendering- render new nodes about every second to avoid lag
        this.setState({ nodes: gameNodes });
    }

    componentDidMount() {
        let interval = window.setInterval(() => { this.getDataFromServer(); }, 1000);
        this.setState({interval: interval});
    }

    componentWillUnmount() {
        window.clearInterval(this.state.interval);
    }

    // handle the click at the application level
   nodeWasClicked(nodeX, nodeY, nodeStatus) {
        this.props.onClick(nodeX, nodeY, nodeStatus);
   }

    render() {
        // map each node to render using the React-Konva class below
        return <Group>{this.state.nodes.map(node => <Node key={node.identifier} node={node} onClick={(nodeX, nodeY, nodeStatus) => this.nodeWasClicked(nodeX, nodeY, nodeStatus)} game={this.state.currGame}/>)}</Group>;
    }
}


/**
 * Class for rendering one bubble in the debate tree to the screen. Called by Conversation for each node in the database.
 */
class Node extends React.Component {
    // setup the state
    constructor(props) {
        super(props);
        this.state = { null: true };
        this.onLikeClicked = this.onLikeClicked.bind(this);
    }

    // post a new rebuttal node to the server
    async onClick() {
        // prevent clicking by the same user
        let currPlayer = await (await fetch("/players")).json();
        let nodeOwner = getStatusValue(this.props.node.status, "user");
        if (currPlayer == nodeOwner) {
            alert("You can't refute your own argument!");
            return;
        }

        // send the click back to the parent to handle rebuttal popup
        let x = this.props.node.x;
        let y = this.props.node.y;
        console.log(this.props.node.status);
        this.props.onClick(x, y, this.props.node.status);
    }

    // if currPlayer: error- no liking yourself
    // if otherPlayer: append username to likers status and increment like status
    async onLikeClicked() {
        let currPlayer = await (await fetch("/players")).json();
        let nodeOwner = getStatusValue(this.props.node.status, "user");
        // parse current player click
        if (currPlayer.username == nodeOwner) {
            alert("Nice try, but you can't like your own arguments 😏");
            return;
        }

        //parse duplicate player clicks
        let reactors = getStatusValue(this.props.node.status, "likers") + getStatusValue(this.props.node.status, "skeptics");
        if (reactors.includes(currPlayer.username)) {
            alert("You already reacted to this message.");
            return;
        }

        console.log("Like clicked");
        // increment likes
        let numLikes = getStatusValue(this.props.node.status, "love");
        numLikes = parseInt(numLikes) + 1;
        let updatedStatus = updateStatusValue(this.props.node.status, "love", numLikes.toString());
        // add username to set of likers
        let likers = getStatusValue(this.props.node.status, "likers") + currPlayer.username;
        updatedStatus = updateStatusValue(updatedStatus, "likers", likers);

        // send to server
        const formData = new FormData();
        formData.append("status", updatedStatus);
        await fetch(`/nodes/${this.props.node.identifier}`, { method: "PUT", body: formData });
    }

    // if currPlayer: error- no disliking yourself
    // if otherPlayer: append clicked status and increment dislike status
    // if opponent: append clicked status and increment dislike status + process rebuttal
    async onDislikeClicked() {
        let currPlayer = await (await fetch("/players")).json();
        let nodeOwner = getStatusValue(this.props.node.status, "user");
        let currGame = this.props.game;

        // parse current player click
        if (currPlayer.username == nodeOwner) {
            alert("You can't dislike yourself!");
            return;
        }

        //parse duplicate player clicks
        let reactors = getStatusValue(this.props.node.status, "likers") + getStatusValue(this.props.node.status, "skeptics");
        if (reactors.includes(currPlayer.username)) {
            alert("You already reacted to this message.");
            return;
        }

        // if the user is a new spectator or wants to add a new rebuttal
        // increment dislikes
        let numHates = getStatusValue(this.props.node.status, "hate");
        numHates = parseInt(numHates) + 1;
        let updatedStatus = updateStatusValue(this.props.node.status, "hate", numHates.toString());
        // add username to set of skeptics
        let skeptics = getStatusValue(this.props.node.status, "skeptics") + currPlayer.username;
        updatedStatus = updateStatusValue(updatedStatus, "skeptics", skeptics);
        // send to server
        const formData = new FormData();
        formData.append("status", updatedStatus);
        await fetch(`/nodes/${this.props.node.identifier}`, { method: "PUT", body: formData });

        //don't allow spectators to make rebuttals
        if (currPlayer.username != currGame.proPlayer && currPlayer.username != currGame.conPlayer) {
            console.log("Spectator disliked.");
            return;
        }

        // if the code reaches here, the opponent is making a rebuttal
        console.log("Processing opponent rebuttal.");
        this.onClick();
    }

    // show the node on screen
    render() {
        //set x and y locations
        let x = this.props.node.x;
        let y = this.props.node.y;
        let parentx = this.props.node.parentx;
        let parenty = this.props.node.parenty;

        // fix bubble sizing
        let height = (this.props.node.description.length / 19) * 25;
        if (this.props.node.description.length < 19) {
            height = 40;
        }
        if (this.props.node.description.length > 200) {
            height = (this.props.node.description.length / 19) * 15;
        }

        // find the Node's color
        let color = '#b0e0e6';
        if (this.props.node.status.includes('#ffcccb')) {
            color = '#ffcccb';
        }

        // decide button position
        let likeX = x;
        let likeY = y;
        let dislikeX = x;
        let dislikeY = y;
        let offset = 50;
        let status = this.props.node.status;

        // up
        if (status.includes("up") || status.includes("down")) {
            likeY = likeY - 30;
            dislikeY = likeY;
            dislikeX = dislikeX + offset;
        }
        // left
        if (status.includes("left")) {
            likeX = likeX - offset;
            dislikeX = likeX;
            dislikeY = likeY + offset;
        }
        //right
        if (status.includes("right")) {
            likeX = likeX + 400;
            dislikeX = likeX;
            dislikeY = likeY + offset;
        }

        let likevis = true;
        let dislikevis = true;

        return (
            <Group>
                {/*Draw a line between child and parent.*/}
                <Line
                    points={[x + 150, y, parentx + 150, parenty]}
                    fill={'#555'}
                    stroke={'#555'}
                    strokewidth={15}
                />
                {/*Create text bubble*/}
                <Rect
                    x={x}
                    y={y}
                    width={400}
                    height={height}
                    fill={color}
                    stroke={'#555'}
                    strokewidth={5}
                    shadowBlur={10}
                    shadowOffset={[10, 10]}
                    shadowOpacity={0.2}
                    cornerRadius={10}
                />
                <Text
                    x={x}
                    y={y + 5}
                    fontSize={20}
                    width={400}
                    fontFamily='Raleway'
                    fill='black'
                    align='center'
                    text={this.props.node.description}
                />
                <Text
                    x={likeX}
                    y={likeY}
                    fontSize={30}
                    width={40}
                    fontFamily='Raleway'
                    shadowColor={'#ddd'}
                    align='center'
                    text={"👍"}
                    visible={likevis}
                    onClick={() => {this.onLikeClicked();}}
                />
                <Text
                    x={dislikeX}
                    y={dislikeY}
                    fontSize={30}
                    width={40}
                    fontFamily='Raleway'
                    shadowColor={'#ddd'}
                    align='center'
                    text={"👎"}
                    visible={dislikevis}
                    onClick={() => {this.onDislikeClicked();}}
                />
            </Group>
        );
    }
}
