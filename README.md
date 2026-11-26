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

Install Node.js and the NSIS compiler, then run `npm install` followed by
`npm run dist:win`. On Ubuntu or Debian, install NSIS with `sudo apt install
nsis`. The Windows installer is created in the repository root as
`My-app-space-Setup-1.0.0-x64.exe`, where it is easy to find. It creates Start
menu and desktop shortcuts, and can be removed from Windows Settings. The app
keeps its shortcuts locally on that computer.

The app and installation pages link to this generated file. To offer the
download from a published website, upload the generated `.exe` alongside the
website files.

Windows may show a SmartScreen warning because this community-built installer
is not code-signed.
