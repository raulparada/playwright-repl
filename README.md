# playwright-repl

Playwright Node REPL + tmux conveniences

```sh
# Install globally.
npm install -g .
# Launch repl in background.
pw
# If called again brings tmux session to foreground.
pw
# This is a node repo with `page` and (browser)`ctx` context.
pw> await page.goto("https://google.com")
# (...send tmux session to background at any point)
# [ctrl+b] + [d]
```

## ClaudeCode

```sh
# Add Claude command.
pw claude
# Call command (w/o starting URL).
# > /pw https://x.com
# < ...Learning how to use pw
# > navigate to the other page
# < pw 'page.click("text=other page")'
# # Using accessibility tree.
# > what's on screen?
# < ...using `await see()`
# < This page displays...
```
