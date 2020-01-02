# Final Report

**⚠️  Remember to also fill in the individual final reports for each group member at `https://github.com/jhu-oose/2019-student-<identifier>/blob/master/final-report.md`.**

**⚠️  You don’t need to do anything special to submit this final report—it’ll be collected along with Iteration 6.**

# Revisiting the Project Proposal & Design

<!--
How did the Project Proposal & Design documents help you develop your project?

What changed in your project since you wrote the initial version of those documents?
-->
The project proposal and design documents helped us by giving us a foundation of ideas to start the framework of our application before we realized what we might have to change. The documents were helpful in making sure that the process of starting to build our application was not overwhelming because we had a somewhat fleshed out idea of what we were going to do. For example, it was easier to establish how we wanted users to be able to interact with each other from our wireframes and class diagrams. One of the most significant things we changed was moving our concept from being a chat-style Android based app to a web application with a "web of debate" interface. We also changed what graphics library we planned/tried to use a few times. We started with Three.js and then tried to use its 2D version, Two,js, but we had troubles integrating that with React so we ended up finding a library called Konva that had a specific library designed to be used with React called React Konva. We also made some changes to our class diagram and wireframes such as not having separate classes for players and spectators, but rather having a spectator "mode" for any user to use.

# Challenges & Victories

<!--
In software engineering things rarely go as planned: tools don’t work as we expect, deadlines aren’t met, debugging sessions run longer than we hoped for, and so forth.

What were some of the biggest challenges you found when developing your project? How did you overcome them?
-->

**Finding a good graphics library and refactoring the user interface accordingly**

None of us were particularly familiar with JS libraries for rendering shapes. As mentioned above, we tried 3 different graphics libraries to render the user interface. Although three.js and two.js could produce the result we were looking for, it did not integrate well with the Server, and it became very difficult to get and send data back and forth from the Server quickly. As a result, we had to completely refactor the front end of the app multiple times, pushing us behind in our goals for the iterations. We searched for a way to combine the shape-generating features of a JS library, Konva, with the great rendering/ data syncing abilities of React, and we finally found and stuck with the React-Konva library.

**Losing two group members**

Two of our group members did not have time to commit substantial time to the project, so they left during the 3rd and 4th iterations. This was particularly tricky to deal with because we relied on them to complete front end features for these iterations. The remaining group members had to pick up the tasks left behind, and it was more difficult to complete all of the original features proposed (although we still got it done 🙃).

**Dealing with React-Konva's lag**

When using the Konva library, rendering shapes and the draggable canvas takes substantial processing power. The first couple iterations of the app were not lightweight and had "setState" errors that we were not sure how to fix. During the previous iteration, we ran through the app multiple times to hunt for potential issues. We discovered that the app was running multiple instances of a debate game in the background, and we fixed the lag by properly unmounting components. We also reduced the number of times that the app updates information from the server from 200 miliseconds to 2 seconds, allowing browsers with less memory to play the app.

**Having too many variables to store on the server**

The app uses 8 different game statuses, 8 different node statuses, and 2 different player statuses to keep track of information. The SQL database would have to store 18 different variables on the server, and we would have to update each of these individually on the server. Adding one new status would require constant refactoring as new variables were added to the class. However, because we often use these statuses together, we opted to put them together in a string with helper functions to parse individual statuses. This way, anyone in our group could add a new status as a substring without breaking the app.

# Experience with Tools

<!--
Which tools did you learn to like? Why?

Which tools did you learn to dislike? Why? And what other tools would you have replaced them with if you were to start all over again?
-->
- We spent a lot of time searching for a good JS graphics library. After meddling with libraries ranging from 3.JS, 2.JS to another thing called P5.JS. After three weeks, we stumbled onto Konva which seemed like the best option amongst numerous mediocre choices. Konva is great for displaying shapes in a static environment, and has a difficult to comprehend package linking it with React. This led to a lot of frustration and heartache as we continually hit roadblocks as to what were best practices when creating graphics. Overall, we found a decent solution, but the graphics portion of the application was much more difficult to master than we initially thought.
- Aside from Konva, we used all the toolbox tools to have the most coverage for how to to build the app. Even though React was in the toolbox, we had absolutely no luck finding any help with React issues. This was very aggravating, but we eventually managed to make it work for our group. Aside from those early hiccups with react, we managed to work well with the toolbox. 
# Iteration 7 & Beyond

<!--
Where would you take your project from here? What features would you add to make your application even more awesome? How would you prioritize that work?

Update the project board with tasks for a hypothetical Iteration 7.
-->
- Way for spectators on a game to communicate with other spectators
- Less lag and standard performance amongst browsers
- Move from SQLite to PostgreSQL. We need to save the usernames and passwords so they don't get lost.

# A Final Message to Your Advisor

<!--
What did you like in working with them?

What do you think they need to improve?

And anything else you’d like to say.
-->
We liked that we recieved honest feedback from Anuraag. This is not necessarily his fault, but we wish we had slightly clearer instructions on what was expected from our final project in the first couple iterations.
