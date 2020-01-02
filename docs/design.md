# Design

# How to Run
The project is runnable in the same way as TODOOSE. Download the source code from Github, import it as an IntelliJ project, and run the project. Alternatively, navigate to the /src/main/java/com/debateNight/Server.java file, and run the Server class. The project should launch a webpage locally, which can be used to view the code. Note that the project requires Java 12 in order to compile correctly. In future iterations, the project will be deployed to Heroku and the URL will be provided.

# Status Report
## Iteration 0:
The basic project proposal was made, and the app was originally slated to be a heavily text-based Android app. Potential APIs, wireframes, and features were documented.

## Iteration 1:
As specifics of the app were discussed, we decided to expand upon the original idea by making a full web application with a complex GUI backed by a chat application made from scratch. New wireframes and class diagrams were created for the new idea, and the starting codebase was formed from TODOOSE.

## Iteration 2:
Several classes from the class diagram were implemented using the MVC model. The implemented classes were used to form the first feature: rendering custom text boxes for the user. On the backend, the text boxes use the Node object, NodesReposity class, and NodesController class to post and get items to/from an SQL database. On the front end, CSS styling and Javascript were used to render the Nodes as text boxes on the screen. Currently, the post method generates a random Node description to prove that unique Nodes were being stored in the database. There were issues in fully implementing the TwoJS classes and allowing the user to specify the description; however, the required methods were still added to the codebase for debugging later on. Additional classes, such as a GamesController, which provides the framework for the rest of a debate game, were also implemented for use in Iteration 3.

## Iteration 3:
This iteration, we focused on creating the front end of the app. First, we explored what was possible in Konva, which was shown during our class presentation. In the NodesComponents.js file, there are ParentNode, Node, and BubbleArrow classes. We originally created a ParentNode, which had a welcome message for the game, with a BubbleArrow attached to it. On click, a BubbleArrow could render a Node, which the user could use to enter some text, which would then be stored in the server. However, due to issues upon refreshing the page, we are in the middle of refactoring the front end to be more stable. The plan for iteration 4 is to include another webpage where the user first enters their arguments before rendering the Nodes. The HTML for this page has been written, although it is not yet integrated into the app. You can open input_text.html in a browser to see a working concept for this webpage. Right now, the app can be opened to view 3 Nodes-attached to a ParentNode via Line objects- with sample data on the backend (note that if your DebateNight.db file is empty, nothing will show up in the Nodes). There are open issues assigned to each team member on Github describing what we hope to finish next.

## Iteration 4:
This iteration, we finished refactoring the front end so that a single player can fully complete a debate game. The app can now render anything on the back end automatically upon loading the Conversation class. The user can now complete a full game by pressing play on the home screen, entering their opening arguments, and seeing them appear in the app. Nodes can be "liked" (click the thumbs up button) to increase a debate score or "disliked" (click the thumbs down button) to add a rebuttal to the node and decrease the debate score. When the "END GAME" text is pressed, the player is taken to a scoring screen, which calculates total likes and dislikes. On the backend, more refactoring was done to allow the server to update Node statuses. To help test the new features, tests were also added in Postman (see the docs folder to import Postman tests) and in Java (see the src/test/java/com/debateNight folder for runnable tests). Basic documentation was also added to each class on the front end to make future collaboration easier. For the next iteration, a second player should be added using the Player object with login information for each player, along with ease of use features- such as a timer to automatically switch between debate screens and an auto-moderator to filter bad words. Deployment to Heroku should also be completed by the next iteration.

## Iteration 5:
This iteration, we added the features necessary for players to fully use the app. A summary of the major ones are below:
- The Player object was fully developed so that new players can signup or login on the home screen. If you check the database, you will see that passwords are also properly encrypted and the same user cannot sign up twice. Once signed in, if the player is part of a game, the user will either be redirected to their current game or they will be taken to the home screen, where they can create a new custom game or join a preexisting game in the new Lobby screen. 
- On the game customization screen, we added the ability to set a timer, choose any debate topic of your choice, and set your stance as pro (labeled player 1 in blue) or con (labeled player 2 in red). After game creation, the user will be sent to a waiting screen until another player joins from the lobby. Both players will then be automatically sent to the opening phase of the game, where they can type in opening statements as before. During the main phase of the game, players can only like or dislike the opponent's arguments (not their own) to respond to them. When the timer runs out, players are taken to the end game screen, where their scores are calculated as before. 
- After developing 2 player games, we integrated asynchronous matches; this means that multiple games can occur at the same time on the Server, so players can pick from any open game on the server. In the future, spectators will also be able to join closed games.
- CSS styling was added to the GUI to make it look better to the user. Headers and p text now appear differently and text is now centered on the screen, along with minor changes to font type, table rendering, etc.


Other Notes:
- The app is now deployed to Heroku for easy testing! https://debate-night.herokuapp.com/. 
- The majority of our testing is in Postman, not Java, since most of the new features are on the client side.
- Note that testing the game with 2 players now requires either 2 computers or running 2 instances of the game on the same computer with different browsers. Running multiple instances causes noticable lag because some of game's calculations are run on the user end- if you need to do this, we recommend either using Edge or Safari browsers; Chrome browsers tend to freeze. Testing async matches or running 2 games at the same time would require 4 players.
- Note that the timer will automatically transition the player to the next phase of the debate- we are still rendering the timer's GUI, so we recommend setting a game for 2 min. and waiting to see the screen changes, which should happen very quickly. Make sure at the opening phase that you lock in your answers, or no arguments will render on the next screen.
- Some usernames can currently break some of our code's logic (ex: setting your name to "null" or "user"). For now, you can use names such as: asdf, qwerty, foo, bar. We will properly reserve some usernames in the next iteration.
- Note in the game creation screen, you cannot currently select one of the features from the provided list- this is a work in progress feature for next iteration, so you can ignore it for now.

Up Next:
We will work on getting a user profile page running as well as work out bugs/lag from the new features. We will also work on a better scoring funtion based on a bit of NLP, a moderator bot to convert "bad words" to a string of symbols, and spectator mode, which will allow a player to like or dislike arguments without modifying the game. 

## Iteration 6:
For this iteration, we finished the app by implementing the last few features and resolving known bugs and issues. Despite a few setbacks, all of the features from our proposal have been implemented. Here is a brief changelog of our features for this iteration:

- There is now an auto-moderator which filters out common swear words and turns them into symbols before rendering a sentence to the screen.
- At the end of a debate, a player can get a score based on natural language processing (which counts the number of unique words after stopword and punctuation removal and weights scores based on likes, dislikes, and number of swear words)
- Users can now spectate a debate. They can contribute to a player's score by liking or disliking a player's arguments, and they recieve bonus points for participation to encourage users to spectate.
- There is a user profile page to permanently keep track of a user's wins and losses as well as their overall score.
- The app's appearance has been updated in CSS so that it looks cleaner and so that more text can functionally fit into each Node in a conversation.

Other Notes:
- Lag has been mitigated by properly unmounting components and decreasing calls to the database- the app should now work for most browsers. It seems to work best in Edge and Chrome browsers.
- Additional documentation has been added and tests have been updated to work for this iteration.

# Architecture

The main components of the app will be built using the class toolbox because DebateNight is a web application that is focused on getting and posting text to/from a database, which TODOOSE managed to do using only the toolbox. An additional 
JavaScript graphics library (React-Konva) will also be leveraged in order to help create a "web of debates"- a graph-like web of chat bubbles that keeps track of the players' conversations throughout the debate. As part of the finished app, the client will be able to debate with another player online. Within a certain time limit, the players must post arguments back and forth, expanding the web of conversations. Starting from just one chat bubble on the screen, as the debate continues, more and more text gets posted to the database, which is made with the underlying Node class on the server-side. Multiple databases will likely be used to keep track of different "lobbies", each holding their own debate and their own web of conversations.

## Tools Outside the Toolbox

<s> We decided to use Two.js because we will be able to utilize its geometry, canvas structure, cameras, zooming, and other GUI-building tools to help make the user experience a "web of debate." The web will be made up of chat bubbles and lines 
connecting ideas together as well as movements/animations that help the user to follow the flow of the debate. More information about Two.js is available here: (https://two.js.org/). Originally, Three.js was going to be used, but there was no need for the Three.js (x,y,z) coordinate system; the app just needs an (x,y) coordinate system, which Two.js can provide. </s>

We have finalized the front end using a combination of HTML, native React and React-Konva, a library that allows the usage of native Konva elements in React. This has allowed us to render complex figures on the front end while maintaining React's ease of use for getting/setting/updating items on the backend.

# Class Diagram

![Class Diagram](https://github.com/jhu-oose/2019-group-DebateNight/blob/master/docs/debateNightUML.png)

# Wireframes

<object data="https://github.com/jhu-oose/2019-group-DebateNight/blob/master/docs/debateNight.pdf" type="application/pdf" width="700px" height="700px">
    <embed src="https://github.com/jhu-oose/2019-group-DebateNight/blob/master/docs/debateNight.pdf">
        <p>This browser does not support embedded PDFs. Please click the link to view the wireframes: <a href="https://github.com/jhu-oose/2019-group-DebateNight/blob/master/docs/debateNight.pdf">View PDF</a>.</p>
    </embed>
</object>
