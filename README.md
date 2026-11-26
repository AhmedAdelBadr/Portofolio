# Ahmed Adel Badr — Portfolio

Live: **https://ahmedadelbadr.github.io/Portofolio/**

A single-page, storytelling portfolio in plain HTML, CSS and JavaScript (no build step), hosted on GitHub Pages.

## Sections

| # | Section | What it covers |
|---|---|---|
| — | Hero | Positioning, headline numbers, CV download |
| — | Story | Timeline from civil engineering to PMO, data and AI |
| 01 | Leadership & management | Dar Al-Handasah national program (10,000+ projects, 200+ engineers, Cabinet & Presidency reporting), Arweqah PMO |
| 02 | PMP® & PMO governance | Standards, earned value, risk, executive one-pagers |
| 03 | Data architecture & engineering | Government databases, integrations, data quality, GitHub projects, Power BI 4D video |
| 04 | AI engineering | Pulse AI assistant video, LLM / RAG / agents, models and tools |
| 05 | Education & credentials | Degree, certifications, experience letters, skills |
| — | Request a demo | Form that writes to a Google Sheet |

Each chapter ends with the courses and credentials that belong to it.

## Files

```
index.html               page content (semantic HTML + JSON-LD for search engines and ATS parsers)
assets/css/style.css     styles
assets/js/main.js        menu, scroll reveal, counters, demo form
assets/video/            demo videos and their poster frames
assets/img/              client logos, project images, social preview image
assets/cv/               CV (PDF)
apps-script/Code.gs      Google Apps Script that receives demo requests
```

## Demo form

The form posts to a Google Apps Script web app (`SCRIPT_URL` in `assets/js/main.js`), which appends each request to the **Demo Requests** tab of a Google Sheet. To set it up again: paste `apps-script/Code.gs` into the sheet's Apps Script editor, deploy it as a web app (execute as *Me*, access *Anyone*) and put the URL in `SCRIPT_URL`.

## Updating

- **CV:** replace `assets/cv/Ahmed_Adel_Badr_CV.pdf`.
- **Videos:** keep MP4s under ~10 MB (H.264, 720p) so they load quickly on GitHub Pages.
- **Courses:** edit the `.learned` list at the end of each chapter in `index.html`.
