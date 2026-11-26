# Ahmed Adel Badr — Portfolio

Live: **https://ahmedadelbadr.github.io/Portofolio/**

A single-page, storytelling portfolio in plain HTML, CSS and JavaScript (no build step), hosted on GitHub Pages.

## Sections

Present-first order, reachable from the sticky tab bar and from the four tiles at the top:

| # | Section | What it covers | Credentials shown beside it |
|---|---|---|---|
| 01 | AI Engineering | Pulse AI assistant video, LLM apps, RAG, agents, models and tools | AI / LLM courses |
| 02 | PMO × AI | How AI runs across the project lifecycle: capture, monitor, alert, summarise, ask | PMP, Power Platform |
| 03 | PMO Leadership · PMP | Dar Al-Handasah national program and the Arweqah PMO | PMP, ISO 21500, experience letter |
| 04 | Data Architecture | Government databases, integrations, data quality, Power BI 4D video, GitHub projects | Data / BI courses |
| 05 | Story | Career timeline and core skills | Degree, Revit, BIM letters |
| — | Contact | Request-a-demo form | — |

## Files

```
index.html               page content (semantic HTML + JSON-LD for search engines and ATS parsers)
assets/css/style.css     styles
assets/js/main.js        tab navigation, progress bar, reveal, counters, video tiles, demo form
assets/video/            demo videos, poster frames and the short loops used in the tiles
assets/img/              client logos, project images, social preview image
assets/cv/               CV (PDF)
apps-script/Code.gs      Google Apps Script that receives demo requests
```

## Demo form

The form posts to a Google Apps Script web app (`SCRIPT_URL` in `assets/js/main.js`), which appends each request to the **Demo Requests** tab of a Google Sheet. To set it up again: paste `apps-script/Code.gs` into the sheet's Apps Script editor, deploy it as a web app (execute as *Me*, access *Anyone*) and put the URL in `SCRIPT_URL`.

## Updating

- **CV:** replace `assets/cv/Ahmed_Adel_Badr_CV.pdf`.
- **Videos:** keep MP4s under ~10 MB (H.264, 720p) so they load quickly on GitHub Pages.
- **Courses and certificates:** edit the `.creds` list in each section's side panel in `index.html`.
