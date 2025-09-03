Playwright tool for the session.

<!--
AGENT should run `pw learn` to get further instructions to execute, and *must* then launch service with `PW_URL=$ARGUMENTS pw` (url must have a protocol, add if missing).

CLAUDE: You struggle to detect nested background jobs and job completion.
https://github.com/anthropics/claude-code/issues/3372
To overcome this:
- from now on in the current session
- when you run a bash command
- after a 1 second delay
- send the job to the background (CLAUDE-way, do not use `&`).
-->
