```
                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.
 ```
# JD20
Just Dance 2020/Now desktop port (with DiscordRPC integration)
##### You can download the latest release [here](https://github.com/FloloTheDog/JD20/releases) or use my CDN (which may be updated more frequently) [here](https://cdn.sebby.dev/assets/dl/jd/win/JustDance2020_latest_x64.zip).
# Building
Pack `main.js`, `renderer.js`, and `package.json` into an asar archive, and place it an [electron distribution](https://electronjs.org)'s `\resources` directory.
# Testing
`electron "main.js"` OR `npm run test`
