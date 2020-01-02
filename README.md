# Debate Night

# How to Run
The project is runnable in the same way as TODOOSE. Download the source code from Github, import it as an IntelliJ project, and run the project. Alternatively, navigate to the /src/main/java/com/debateNight/Server.java file, and run the Server class. The project should launch a webpage locally, which can be used to view the code. Note that the project requires Java 12 in order to compile correctly. In future iterations, the project will be deployed to Heroku and the URL will be provided.

# Elevator Pitch

While there are places available to debate ideas online, most are lengthy forum-based discussions, whereas the Debate Night 
app is meant to emulate the structure of a debate competition. The user can start a quick 5-15 minute match to debate a topic 
of their choice against other users. The debate is moderated by other spectating users who help determine the winner, and 
each debate contributes to a user’s total "debate score".

# Problem

There are few to no websites or mobile apps dedicated to quick debates on a wide variety of topics. Debate forums tend to be lengthy and fact driven, but lack the space to allow users to come up with arguments quickly under time pressure. Those who are part of debate teams or who would like to improve their abilities to argue quickly and effectively can often only practice in person or by watching live debates. 

## Introduction to Domain

Debate has long been a peaceful, venerable and controlled form of expression, communication and argument. However, the formalities and rules
of debate often restricted this form of expression to academics, politicians and magistrates. Customarily in person, exclusive and prepped,
we propose that an informal, technological solution could allow more people the chance to debate without the bulwarks of history.

# Solution

We will offer a semi-fast-paced debate format that allows users to face off 1v1, which will allow players to focus on the main points of their arguments in order to try and convince their opponent. Getting ratings from spectators or opponents will contribute towards a player's debate reputation, which will help motivate players to do well in debates and not "troll." Furthermore, the debates will take place not in a typical chat box, but in a more novel "web of debate."

## Architecture Overview

Debate Night will be built as a Web Application using all the toolbox tools as well as a graphics library for JavaScript to ensure our design works on different browsers and screen sizes (Two.js).

## Features

* 1 v 1 matches (group matches if time)
* Spectator in each match (bot or human)
* Voting and scoring
* Timer (and ability to set debate time)
* Asynchronous matches to accommodate multiple lobbies
* User profile
  - Debate score
  - Interests
  - Username/password
* Trending topics recommended by dev team
  - User curated topics
* Moderator bot capable of automatically censoring negative language and spam
* We are going to have a novel visualization of debates, which will resemble a "web of argument" to better represent the non-linearity of in-person debates.

## Wireframes

**<!-- Description, for example, “Events Map” -->**

![Wireframe](https://github.com/jhu-oose/2019-group-DebateNight/blob/master/docs/debateNight.pdf)

## User Stories

-As a debater, I want to be able to create a match about my own topic, so that I can debate with someone and perhaps gain new 
insight on the topic. I open the app, click play and then create a custom lobby. Then, I enter my topic name and add it to a 
preset category. Then, I choose whether I want to be for or against my topic statement and set how long I want the debate to be. After creating a topic, I wait for an opponent and spectator(s) to join the lobby. Once people join, I can then give an opening statement and 
read my opponent’s opening statement. After this, we can start asking each other questions about our stances until it is time for the 
closing statements. Then, the spectator(s) will help determine who the winner of the debate was and each user can gain points 
based on how their arguments were perceived.

-As a spectator, I want to be able to vote and give some sort of feedback during the debates, so that I can contribute to the 
winner of the debate. I can choose to enter a debate as spectator and react to the arguments of each debater and eventually 
vote on who I think deserves to win.

# Viability

## Hardware

As it's going to be a web app, we won't need any extra hardware for this project.

## APIs

- (maybe) Twitter API to grab current events
- Two.js for a javascript graphics library

## Tools

The toolbox will encapsulate almost all of our needs except for using two.js for graphics in association with React.js.

## Proof of Concept

The technology to create fast, responsive, and elegant chat rooms exists. APIs like Pusher Chatkit, SendBird, and the Facebook messenger all support the relatively simple functionality required for an app like Debate Night to be feasible.

The existence of sites like [Debate.org](https://www.debate.org/) show that there exists an arena market for online verbal sparring. Niche-category trivia games populated with thousands of committed users (ex: QuizUp) show that people will come out to play their interests if given the chance / space  to.

# Difficulty

The project should be sufficiently difficult and interesting. It will involve setting up the server such that multiple lobbies and debates can exist at any moment. A moderating bot will have to be implemented to automatically censor inflammatory language, and similar spam. Handling the logic of a formal debate in a concise, efficient chat room will lead to much testing to ensure that it feels fun, yet gives ample room for discussion. The most difficult part will likely be the custom chat system where there will be multiple chains of conversations happening simultaneously.

# Market Research

## Users

Our users will encompass both debate aficionados, as well as casual users looking for a quick thrill. For the former, this app will provide a very structured style of debate that will allow for serious conversation without anybody resorting to gas-lighting, spam, or hate speech as is seen on many public forum websites such as Facebook or Reddit. For the more casual user, this app will provide a great entry point to structured arguments. Furthermore, they will be able to hone their skills on a huge set of topics either refining an area of interest, or exploring a new subject.

## Competition

- The website debate.org is a forum for slower-paced discussions, but it lacks fast-paced debates. It is only possible to challenge others to a 1v1 debate that takes place over a couple days; similar to Words with Friends, the user could then check back on their match later to make their argument. Because Debate Night would offer fast "on the fly" debates, it is likely that users on debate.org would actually be interested in the app.
- The "Debate Wars" Android app is somewhat similar to our app idea, but debate arguments are limited by number of characters typed rather than by time. This makes arguments shorter, but the debate loses the time pressure component that Debate Night would focus on.

# Roadmap

https://github.com/jhu-oose/2019-group-DebateNight/projects/2
