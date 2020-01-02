# Project Proposal

# Debate Night

# Elevator Pitch

While there are places available to debate ideas online, most are lengthy forum-based discussions- this app is meant to emulate the circumstances you may be in as part of a school/college debate team. The user can start a quick 5-15 minute match to debate a topic of their choice with other users. The debate is moderated by bots or other trusted users, and each debate a user contributes to raises their "debate score".

# Problem

There are few to no websites or mobile apps dedicated to quick debates on a wide variety of topics. Debate forums tend to be lengthy and fact driven, but lack the space to allow users to come up with arguments quickly/ under time pressure.

## Introduction to Domain

# Solution

The Debate Night app will allow users to practice their debate skills by joining short matches to discuss a topic of their choice. The user earns points for making a significant contribution (determined by a bot or a moderator) to their side of the argument.

## Architecture Overview

- Can be written as either a mobile app (I have access to an Android device) or a Windows desktop app.
- Requires a web server to host matches between users.

## Features

- Text-based debate matches of various lengths
- User profile with basic information about the person (topics they enjoy debating, age, debate experience, etc) and their debate score
- Bots or moderators that can keep debates from getting out of hand and detect significant contributions to an argument made by a user.

## Wireframes

**Home Pages**
![Home Pages](https://github.com/jhu-oose/2019-student-Firecrackle/blob/master/pictures/home_page.jpg)

**User Profile**
![User Profile](https://github.com/jhu-oose/2019-student-Firecrackle/blob/master/pictures/user_profile.jpg)

**Create a Debate Match**
![Create Match](https://github.com/jhu-oose/2019-student-Firecrackle/blob/master/pictures/match_setup.jpg)

**Ongoing Debate**
![Match in Progress](https://github.com/jhu-oose/2019-student-Firecrackle/blob/master/pictures/match_page.jpg)

## User Stories

A user logs into their account on the home page and navigates to the "create a match" screen. From there, they create a 5 minute "1 vs. 1" match about "Pepsi vs. Coke". Another user and a moderator join the open match and the match begins. The users type out arguments supporting their sides, and at the end of the match, the moderator determines how many significant arguments each user made. Each user gains debate points based on the arguments they made.

# Viability

## Hardware

If the app is for Windows or Android only, I have the necessary hardware. If the app needs to support Apple products, a team member with an iPhone or Mac is needed.

## APIs

- I am not sure what APIs this project would require. Linking users from debate.org, a large forum for online debates/discussions, to the Debate Night app would be interesting.
- Using Facebook connect or a user's Google account to help a user signup for the app would also be helpful.

## Tools

- Programming in Java would make forming a Android app easier (other tools in the class toolbox also support Java).
- Javalin and SQLite for the web server and its database.
- Java Swing for the UI.

## Proof of Concept

- The match-based concept is very similar to how an online chess game on chess.com operates. Users can create a custom chess game and wait for other users to join. At the end, points are awarded/lost based on who won/lost.
- This concept is also applied to different games to form tournaments between users on pogo.com.

# Difficulty

The project will be difficult/ interesting because it involves creating a text-filtering bot, which can correctly identify "good" arguments and bad language, and/or designating certain users as moderators by saving their debate score and language used over time. The debate match lengths must be customizeable and allow real-time sending/recieving of texts between multiple users. Additional features, such as designation of a winning side of the debate (which could give extra points) or matching similar users to a debate on a pre-set topic automatically could also be added for additional complexity.

# Market Research

## Users

- People interested in fast-pace debates with others.
- People who want to practice arguing their side of an issue (or who just like arguing).

## Competition

- The website "debate.org" is a forum for slower-paced discussions, but it lacks fast-paced debates.
- The "Debate Wars" Android app is somewhat similar to this idea, but it is limited by number of characters in a debate rather than time. This makes arguments shorter and it loses the fast-paced component that "Debate Night" would focus on.

# Roadmap

https://github.com/jhu-oose/2019-student-Firecrackle/projects/1
