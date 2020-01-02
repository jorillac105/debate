// this file includes logic for logging the player in


/**
 * Login page to add users to the app.
 * Uses the SAME state (returnHome) as the EndGame method. They both jump to the Home class, just easier to reuse
 * than to create a new state.
 */
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.loginClick = this.loginClick.bind(this);
        this.signUpClick = this.signUpClick.bind(this);
        this.handleErrors= this.handleErrors.bind(this);
        this.showPass = this.showPass.bind(this);
        this.state = { returnHome: false, signup: false, badUser: false };
    }

    // log the user in using the method on the server (requires username and password)
    async loginClick() {
        //reset error condition
        this.setState({badUser: false});

        // get the form data
        let username = document.getElementById("login").value;
        let password = document.getElementById("password").value;


        let formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        // send the form to the server-side controller; check for server errors
        await fetch(`/players/username`, {method: "POST", body: formData})
            .then(this.handleErrors)
            .then(response => console.log("User checked.") )
            .catch(error => console.log(error) );

        // if login is good, go to the next page
        if (this.state.badUser == false) {
            this.setState({returnHome: true});
        }
    }

    handleErrors(response) {
        if (!response.ok) {
            alert("Bad username or password. Try again.");
            this.setState({badUser: true});
        }
    }

    signUpClick() {
        this.setState({signup: true});
    }

    showPass() {
        let curr = document.getElementById("password");
        if (curr.type === "password") {
            curr.type = "text";
        } else {
            curr.type = "password";
        }
    }

    render() {
        // show the player's score and provide a button to loop back home
        let display =
            <div className={"scoring-div"}>
                <h1>Welcome to Debate Night!</h1>
                <br/>
                <input id={"login"} placeholder="Username"></input>
                <br/>
                <input type={"password"} id={"password"} placeholder="Password"></input>
                <br/>
                <input type={"checkbox"} onClick={this.showPass}></input>
                <small>Show Password</small>
                <br/>
                <button className={"sign-in-button"} onClick={this.loginClick}>Log in</button>
                <button className={"sign-up-button"} onClick={this.signUpClick}>Sign up</button>
            </div>;
        if (this.state.returnHome === true) {
            window.location.href = "./home.html";
        }
        if (this.state.signup === true) {
            display = <Signup/>
        }
        return (display);
    }
}


/**
 * Signup page for new users. Adds a user to the database.
 */
class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.handleErrors= this.handleErrors.bind(this);
        this.state = { returnHome: false, badUser: false };
    }

    // log the user in using the method on the server
    async onClick() {
        this.setState({badUser: false});

        // get the text area strings
        let username = document.getElementById("new-login").value;
        let password = document.getElementById("new-password").value;

        // create the user
        let formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("score", 0);
        formData.append("status", "");

        // send the form to the server-side controller
        await fetch(`/players`, { method: "POST", body: formData })
            .then(this.handleErrors)
            .then(response => console.log("User checked.") )
            .catch(error => console.log(error) );

        // if login is good, go to the next page
        if (this.state.badUser == false) {
            this.setState({returnHome: true});
        }

    }

    handleErrors(response) {
        if (!response.ok) {
            alert("Username is already in use.");
            this.setState({badUser: true});
        }
    }

    showPass() {
        let curr = document.getElementById("new-password");
        if (curr.type === "password") {
            curr.type = "text";
        } else {
            curr.type = "password";
        }
    }

    render() {
        let display =
            <div className={"scoring-div"}>
                <div>Type in your new username and password below:</div>
                <input id={"new-login"} placeholder="Username"></input>
                <br/>
                <input type={"password"} id={"new-password"} placeholder="Password"></input>
                <br/>
                <input type={"checkbox"} onClick={this.showPass}></input>
                <small>Show Password</small>
                <br/>
                <button onClick={this.onClick}>Sign up</button>
            </div>;
        if (this.state.returnHome === true) {
            window.location.href = "./home.html";
        }
        return (display);
    }
}

ReactDOM.render(<Login/>, document.querySelector("#application"));
