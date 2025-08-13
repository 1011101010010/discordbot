1.Make a folder named: discord-bot

2.Download the files from GitHub: https://github.com/1011101010010/discordbot

3. download this too: https://nodejs.org/fr/download

4. add an .env file with the information BOT_TOKEN=(the bot token) and USER_TOKEN=(the user token)

to get the bot token, just copy the link bla bla
to get the user token, follow this tutorial: https://www.youtube.com/watch?v=LnBnm_tZlyU

5. change the usernames in the index.js that says yourname to your username (not display name)

6. to get the emojis, make copies of the emojis from the discord server or just use custom ones, and copy they id and replace them in the index.js place that said youremojiid

7. put the channel id you want the bot to type in

8. invite the actual bot with an invite link with admin perms (or less if you know what the bot does) to your server

9. To run the actual code, you will need to use a cloud vm or your local machine, to do so: run PowerShell and do these inputs


this one is might not be necessary since its only used for the node.js stuff
1. Set-ExecutionPolicy Bypass -Scope Process -Force 

this one just tells the PowerShell where to execute the cmd

2. cd C:whereyourfolderis\discord-bot

this activates the file

3. node index.js


extra: if you want logs of every msg being sent from both channels, remove the // from the parts that does that
