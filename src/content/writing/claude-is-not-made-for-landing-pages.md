---
title: Claude is not made for landing pages
description: One sentence of prompt got me a good looking page with a customer who does not exist. Then I gave it real tools and ran the same sentence again.
date: 2026-07-29
topic: AI, design
unlisted: true
---

I gave Claude one sentence.

```
Make me a landing page for a hairdresser booking app.
```

That was the whole prompt. No brand, no brief, no reference, no colours. Fresh session. I did not hobble it either: it had a shell, a browser, and permission to use both. Whatever came out was going to be the honest answer to the laziest possible request.

Here is what came back.

<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1280" height="800"
         poster="/writing/claude-landing-pages/v1.jpg"
         aria-label="Scrolling through the landing page produced by the bare prompt">
    <source src="/writing/claude-landing-pages/v1.webm" type="video/webm" />
    <source src="/writing/claude-landing-pages/v1.mp4" type="video/mp4" />
  </video>
  <figcaption>
    First run. One sentence of prompt, no tools beyond a browser.
    <a href="/writing/claude-landing-pages/v1">Open the page itself</a>, exactly as it was
    generated. Nothing in it has been edited, including the parts that are not true.
  </figcaption>
</figure>

I have to be fair before I take it apart. That is not a bad page.

It invented a product called Column and pitched it on one real insight, which is that a colour service is twenty minutes of work and thirty-five of waiting, and the diary should be selling the waiting. The headline is "A tint is twenty minutes of work and thirty-five of *waiting*". The hero is a working four chair salon board built in CSS, with processing time drawn as its own hatched block. It knows what a patch test is. It knows colour formulas look like `5.0 + 5.62 · 20 vol`. It picked brass against ash for the palette because that is the colourist's own opposition, the warmth you put in against the warmth you tone out.

It also debugged itself. Its own notes say it caught a `<button>` centring its label inside the tall bookings, fixed that with flex, noticed the fix had moved an absolutely positioned element and broken the hover state, then rebuilt both spans into one grid cell so the swap costs no reflow.

So the story is not "AI writes ugly generic pages". I was ready to write that post. The output refused to cooperate.

The problems are narrower and worse.

## It made up the evidence

Read the page slowly and count the facts.

- 68% of offered gaps get filled before they start
- £31 average takings from a gap that used to be dead
- a no show rate of 1 in 40, down from 1 in 9
- footnoted underneath: "Median across 1,400 chairs over the last ninety days"
- a logo strip of five salons: Fen & Bramble, House of Rook, Salt Parlour, Marchetti & Sons, Wren
- and a testimonial from Rosa Ilić, owner of Fen & Bramble, four chairs, Leeds, saying Column found her nine hundred pounds of processing time in the first month

None of that exists. Not the salons, not the owner, not the ninety day window, not the 1,400 chairs.

What should worry you is how careful it all looks. The numbers sit at exactly the right level of plausibility. The methodology note is the kind of thing an honest company writes. The fake customer got a full name, a town, and a chair count. A salon owner who asked an agent for a landing page and pushed it live would be publishing invented statistics and a fabricated person under their own domain.

Bad output you throw away. This is credible output, which is how it ends up shipped.

## It shipped no photographs

1,305 lines of HTML. Zero `<img>`. Two `<svg>`, one of which is the logo.

A hair salon is a visual business. People book a colourist because of how the work looks. The page selling that software contains no photograph of hair, a salon, or a person.

Call it the shape of the tool rather than an oversight. A language model emits text. Ask it for a web page and you get the parts of a web page that are made of text, which is the markup, the copy and the CSS. Everything else silently does not happen. The model never mentions the gap, because from where it sits there is no gap.

## The typography is a bet on your reader's computer

I measured what actually renders. The headline resolves to Didot. The body resolves to Avenir Next.

Both of those ship with macOS. There is no `@font-face` anywhere in the file and the page makes zero network requests.

Its reasoning was sound, and it wrote it down: system stacks only, so nothing silently fails behind a blocked font CDN. Fine. But the consequence is that the design only exists on Apple hardware. On Windows the headline falls back through Bodoni MT to Georgia. On Android it lands on whatever the vendor ships. The editorial look, which is the entire art direction, quietly dies for most of the internet.

The bit I keep coming back to is that it did check. It verified its work at 1440, 1280 and 390 pixels, it said so, and I believe it. It just did that on a Mac, where Didot exists. It cannot install Windows to see the other half. It picked a typeface it could see and had no way to learn what everyone else got.

## The mobile check was worthless

That page has no doctype. No `<html>` element, no `lang`, and no `<meta name="viewport">`. It opens on a `<title>` tag.

Load it in an emulated iPhone and here is what you get. The layout viewport is 980 pixels wide, not 390. The `max-width: 620px` media query never matches. The browser is in quirks mode, because there is no doctype to put it in standards mode.

So every line of phone styling in that file is dead code. A visitor on a phone gets the desktop layout scaled down to illegibility, and the careful mobile work underneath it never runs.

Now hold that against the sentence I just quoted. It checked at 390 pixels and the check passed. It passed because a headless browser told to be 390 wide is 390 wide, whether or not the page asked to be. The harness quietly supplied the thing the page had forgotten, and the test came back green.

I did the same thing, which is the only reason I am confident about how easy it is. My first pass measured this page at 375 pixels and reported no horizontal overflow, and I wrote that down as a point in its favour. It was meaningless. I had set a viewport instead of emulating a phone, so I was testing my own harness. I found the real bug later, by accident, while getting the file ready to publish alongside this post.

## The pattern

Four failures, one cause.

The model only has its own head. Anything it cannot derive from text it either skips or invents. Images need a source it does not have, so they do not appear. Numbers need a business it has never seen, so they get generated at exactly the right level of plausibility. Fonts need a rendering machine that is not the one it is sitting on. And a phone is a physical object it has never held, so the tag that would have made the page fit one never got written.

None of this is a design problem, and you cannot prompt your way out of it. This is where most advice about this stops being useful. "Be more specific" does not conjure a photograph. The fix is to stop asking a text engine to be an art department, and to give it access to things that exist.

## What to actually give it

I went and priced the stack. Everything below I checked against the vendor's own page on 29 July 2026, because these numbers move and I did not want to repeat what a blog post said in 2024. Prices are what was served to me in Paris, and several of them are region localised, which I flag where it matters.

Sorted by which failure each one fixes.

### For the missing pictures

| Tool | What it is | Price |
| --- | --- | --- |
| [Higgsfield](https://higgsfield.ai) | Image and video generation, with an MCP server so an agent calls it directly | Plus €49/mo, or €39/mo billed annually, for 1,000 credits. Ultra €129/mo. Credit packs from €26, expiring after 90 days |
| [Unsplash](https://unsplash.com/documentation) | Free stock photography with a REST API | Free. 50 requests an hour on demo, 1,000 once you pass review |
| [Unsplash+](https://unsplash.com/plus) | The paid tier, model and property released | €16/mo, or €72/yr |
| [Adobe Stock](https://stock.adobe.com/plans) | The heavyweight commercial library | From €29.99/mo for 10 credits |

Generation and stock solve different problems. Stock gives you a real photograph of a real room, which is what you want the moment a page shows people, and Unsplash+ is the cheap way to stop worrying about whether the face on your homepage signed a release. Generation gives you a shot that does not exist, art directed to your page, which matters when every salon photo on Unsplash has the same window light.

One licensing trap worth knowing. The Unsplash License needs no attribution, but the API Guidelines do require you to credit the photographer and hotlink back. Those are two different documents and people read the first one only.

### For the fonts

| Tool | What it is | Price |
| --- | --- | --- |
| [Fontshare](https://fontshare.com) | Quality typefaces from Indian Type Foundry | Free, commercial use included |
| [Google Fonts](https://fonts.google.com) | 1,700 open source families, free API, no key | Free |

This one costs nothing and fixes the third failure outright. A webfont ships with the page. Didot does not.

It is also the cheapest way to stop a page looking machine made, because the tell is rarely the layout. It is Inter on everything.

### For structure worth copying

| Tool | What it is | Price |
| --- | --- | --- |
| [Mobbin](https://mobbin.com/pricing) | 621,500 screens and 142,200 flows from apps that actually shipped, with an official MCP | Free tier. Pro €10/mo billed yearly, €15/mo quarterly. Team €16/member/mo yearly |
| [Tailwind Plus](https://tailwindcss.com/plus) | 500+ finished Tailwind blocks and templates from Tailwind Labs | €249 one time, personal, lifetime. €849 for teams |
| [shadcn/ui](https://ui.shadcn.com/docs/registry/mcp) | Components copied into your repo, plus a registry an agent can resolve against | Free, MIT |

Mobbin is the interesting one, because it changes what the model reasons from. Without it, "what does a booking flow look like" gets answered out of a statistical blur of every booking flow in the training data, which is how you get a page that feels averaged. With it, the agent looks at real ones. The MCP returns the screenshots inline, so the model is looking rather than remembering. Note that MCP access is paid only and still in beta, and the free tier is deliberately too thin to drive an agent with.

Two caveats on Tailwind Plus. Its official page served me euros, and the $299 figure everyone quotes appears only on third party blogs, so do not trust a dollar price you have not seen yourself. And there is no official MCP: the community ones work by driving your logged in session with a headless browser, which is a licensing grey area I would not build on.

Small thing I enjoyed. Tailwind's own pricing page carries a testimonial about buying it "so I (or my AI agents) can emulate their best practices". They already know what they are selling.

### For letting it see

| Tool | What it is | Price |
| --- | --- | --- |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Microsoft's browser automation over MCP, 50+ tools | Free, Apache 2.0 |
| [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Real DevTools exposed to an agent | Free, Apache 2.0 |

Everyone recommends these as the fix, so let me be precise about what they do, because my own first run is the counterexample.

That page was built with a browser available, the agent used it, and it still shipped every failure above. A browser catches layout bugs. It does not catch a fabricated customer or a missing photograph, because neither of those is visible as a defect. The page looks finished. That is the problem.

Worse, a browser will hand you a passing grade on a test you are not really running. The missing viewport tag is the case in point. Both the agent and I resized a window, called it mobile, and got a clean result on a page that is broken on every phone in existence. If you take one practical thing from this post, make it this: emulate a device, do not set a width. In Playwright that is the difference between `newPage({ viewport })` and a real device descriptor, and it is the difference between testing the page and testing your own harness.

There is also a line in Playwright MCP's own documentation that tends to get skipped: it tells you to act on the accessibility tree, and that screenshots are "for viewing only, you can't perform actions based on the screenshot". So what you get is structural self inspection, plus an image a vision model can be asked to criticise. Calling that "the agent can see its design" is a stretch.

Chrome DevTools MCP earns its place by measuring instead of looking. Performance traces, console with source mapped stacks, real network. It will tell you the hero image is four megabytes, which the other one will not.

### For not making things up

| Tool | What it is | Price |
| --- | --- | --- |
| [Firecrawl](https://www.firecrawl.dev/pricing) | Turns real pages into model readable content, official MCP | Free 1,000 credits/mo. Hobby $16/mo billed yearly |
| [Figma Dev Mode MCP](https://www.figma.com/pricing/) | Your actual design file: variables, tokens, components | Needs a paid Full seat, from $16/mo |

Figma's is the only entry here that hands the model your real brand instead of a plausible invention. Everything else improves the guess.

But I want to be straight about the limit. No tool stops a model inventing a testimonial. Firecrawl means it can read your real pricing page instead of dreaming one, and that helps. The rest is a constraint rather than a purchase: tell it not to invent evidence, and give it permission to leave a slot empty. A model fabricates social proof because you implicitly asked for a finished page and it had no way to say "I do not have this".

Cheapest line item in the whole post, and it is the one that would have saved the fake salon owner in Leeds.

## Same sentence, second run

So I ran it again. Identical prompt, same model, with the stack wired in: Mobbin for real booking flows, Higgsfield for photography, Fontshare for type, Lucide for icons, Playwright to look at its own work, and one line telling it not to invent evidence.

<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1280" height="800"
         poster="/writing/claude-landing-pages/v2.jpg"
         aria-label="Scrolling through the landing page produced by the same prompt with external tools">
    <source src="/writing/claude-landing-pages/v2.webm" type="video/webm" />
    <source src="/writing/claude-landing-pages/v2.mp4" type="video/mp4" />
  </video>
  <figcaption>
    Second run. Same sentence, plus tools that reach outside the model.
    <a href="/writing/claude-landing-pages/v2">Open the page itself</a>. Both are served
    unedited and carry a noindex header, since one of them cites a customer who does not exist.
  </figcaption>
</figure>

Measured rather than admired, here is what changed.

Six photographs, generated for this page. Thirty-two real icons. The headline resolves to Boska and the body to Switzer, both loaded from Fontshare, so a visitor on Windows sees the page I saw. No invented statistic anywhere in the file.

It has a doctype and a viewport tag, so I re-ran the phone test properly on it, the emulated way rather than the resized way. Layout viewport 390, the phone styles actually applying, standards mode. The thing the first page only appeared to pass.

The booking mockup stopped being guesswork too. The day strip, the time pills, the stylist card and the sticky total bar came off real flows it pulled from Mobbin: Careem's date and time picker, Fresha and Square Go for the service row, Zocdoc and Warby Parker for the practitioner header. Every one of those conventions shipped somewhere before it arrived on this page. It also declined to draw the App Store and Google Play badges, on the grounds that those are trademarks, and used plain buttons instead. I did not ask for that.

The part I did not expect is what it did with the empty slot. There is a dashed box on the page, where the logo strip would go, that reads:

> Press mentions, ratings and salon counts belong here — added once there are real ones to publish. Nothing invented sits on this page.

(That em dash is the machine's, not mine. Quoting it as it shipped.)

Under the product mockup: "Salon, stylist and prices shown are example content." Under the stylist card: "Card shown is an example listing, not a real stylist."

Told it could leave a hole, it labelled the hole. That cost nothing. It is the single biggest difference between the two pages and it came from a sentence, not a subscription.

## What the tools did not fix

The picture tool invents things as well.

Two of the four generated photographs came back unusable. One had a brand wordmark printed across the stylist's apron, for a company that does not exist. The other had a fake film border with text baked into the edge. Both got cropped before they went on the page. So the fabrication problem I spent half this post on does not disappear when you pay for imagery. It moves into the pixels, where you cannot grep for it and the only way to catch it is for somebody to look.

That is the argument for the browser tools, by the way, and it is a narrower argument than the one usually made for them. The 320 pixel pass on this page found a real two pixel overflow caused by the fixed width phone mockup forcing a grid track. Looking catches that. Looking is also the only thing that catches a logo that should not be there.

The writing got worse.

"Book the chair, not the phone call" is a decent line. "A tint is twenty minutes of work and thirty-five of waiting" is a much better one, and that came from the run with no tools at all. Feed a model forty real booking pages and it produces something that looks like real booking pages, which is to say conventional. The averaging I complained about earlier moved: it left the layout and turned up in the prose.

If you are optimising for conversion that trade is probably correct. Conventional works. But nobody should sell you the tooled up version as strictly better, because on the one dimension where the model genuinely excels, unaided, it lost ground.

The honest summary of the whole experiment is smaller than the tool list makes it look.

The expensive tools fixed the cheap problems. Images cost €39 a month, or nothing if you accept stock. Fonts cost nothing. Icons cost nothing. Looking at the page costs nothing. Real structure runs €10 a month.

The dangerous problem, the one where an agent hands a small business owner a page with a fake customer on it, was fixed by one sentence in a prompt.

Claude is not made for landing pages, in the specific sense that a landing page is mostly things that are not text, and mostly claims about a world it has never been in. It writes the text extremely well. Everything else you have to hand it, and if you do not, it will not tell you. It will fill the gap.
