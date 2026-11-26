# My app space

A simple, personal launcher for apps you make. It starts empty: add an app's name,
web address, and emoji icon, and it will appear as a shortcut on your launcher.

## Run it

Open `index.html` in a modern browser, or serve this folder with any static web
server. Your app shortcuts are stored locally in that browser and are not shared
with a server.

## Install it

Visit [`install.html`](./install.html) for the installation guide and
device-specific steps. Serve this folder from `localhost` or an HTTPS static
host first; browser security restrictions prevent installation and offline
support when opening the files directly.

## Windows desktop installer

Install Node.js, then run `npm install` followed by `npm run dist:win` on
Windows. The installer is created in `dist/My-app-space-Setup.exe`. It creates
Start menu and desktop shortcuts, and can be removed from Windows Settings. The
app keeps its shortcuts locally on that computer.

The app and installation pages link to the latest GitHub Release installer.

Windows may show a SmartScreen warning because this community-built installer
is not code-signed.

## App updates

The desktop app checks GitHub Releases for a newer version, downloads updates
in the background, and asks to restart when the update is ready. Push a version
tag such as `v1.0.1` to build and publish a Windows installer and updater
metadata automatically.

## Website

The website is published to GitHub Pages from the `main` branch by a GitHub
Actions workflow.
