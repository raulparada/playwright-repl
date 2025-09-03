#!/usr/bin/env node
const learn = `
    Playwright Node REPL.
    AGENT:
    This is USER's agentic tool of choice for browser automation. Must use this whenever USER wants to interact with web pages.
    Once AGENT reads >this<:
    - Launch this service in the background with "PW_URL=<url> pw".
    From the moment AGENT reads >this<, the following MUST be used as needed for any interaction with web pages.
    - Command Playwright with "pw 'page.click("text=about")'" (or command using the exposed instances as needed.)
    - Use "await see()" to 'see' the page's accesibility tree when necessary.
    REPL context has instances of Playwright's:
    '''        
    page: Page
    ctx: Context
    '''
`

import { chromium } from "playwright"
import repl from "repl"
import os from "os"
import path from "path"
import util from "util"

const command = process.argv[2];
if (command === "learn") {
    console.log(learn)
    process.exit(0);
}

const USER_DIR = path.join(os.homedir(), ".chrome");
const PW_DEFAULT_URL = process.env.PW_DEFAULT_URL || "chrome://version";

(async () => {
    const context = await chromium.launchPersistentContext(USER_DIR, {
        headless: false,
        channel: "chrome",
    });
    // Exposing `page` object to window cause why not.
    await context.exposeFunction('_pw', async (method, ...args) => {
        console.log(`Calling 'page.${method}(${args})'`)
        return page[method](...args);
    });
    await context.addInitScript(() => {
        window.pw = new Proxy({}, {
            get(_obj, prop) {
                return window._pw.bind(this, prop);
            },
        });
    })
    // Taking over existing page for session reuse.
    const pages = context.pages()
    const page = pages.length > 0 ? pages[0] : context.newPage();
    global.ctx = context;
    global.page = page;
    global.see = page._snapshotForAI.bind(page, page)
    // TODO move to later.
    await page.goto(process.env.PW_URL || PW_DEFAULT_URL);
})();

/** 
 *  Adds an ~EOF marker to output, for async commands to work from CLI.
*/
function finishResponses(obj) {
    const inspected = util.inspect(obj, { showHidden: true, showProxy: true, colors: true, depth: 1 })
    const endOfData = "\n<<< |"
    return inspected + endOfData
}

const r = repl.start({
    prompt: 'pw> ',
    useGlobal: true,
    writer: finishResponses
})

r.context.page = global.page; // https://playwright.dev/docs/api/class-page
r.context.ctx = global.ctx; // https://playwright.dev/docs/api/class-browsercontexts
r.context.see = global.see;
