User Story #11:
As a user, I would like to be able to visualize instructor posts differently so that I can make sure that I don't miss any important announcements from the instructor.

To test the flagging instructor posts feature, run nodebb with the frontend changes, any signed in account should work. When opening a post or a list of posts, you should be able to see "! instructor" next to all instructor posts. Unfortunately, this feature did not work as we expected, and we could not run our backend functions that check if a post was created by an instructor in the frontend. Meaning, all posts and post lists show the flag regardless of whether or not they were created by an instructor.

We also created tests for the isInstructor function (which checks if a user is an instructor) in tests/user.js.

