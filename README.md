# BookingLayer notification bot is based on [grammY](https://grammy.dev) and [telegram-bot-starter](https://github.com/Borodutch/telegram-bot-starter)

# User facing features

- [x] Users can set their language
- [x] Users can view a list of available products
- [x] Users can subscribe to notifications for individual products
- [x] Users receive one notification with bookable timeslots per subscribed product
- [x] Users can set notification interval
- [x] Users do not receive notification with duplicated information. If product availability is the same as before, no notification is sent
- [x] Users are informed about the timezone business operates in
- [ ] Bot does not send notifications between 22:00 and 7:00 - Ruhezeit 💤
- [x] Users can see the menu with all the available commands
- [x] Users see pleasant number of emojis in the messages
- [ ] Users see decent pluralization in the messages
- [x] Bot has an icon and a description

# Technical features

- [x] Continuous deployment to Heroku
- [x] Jest tests
- [x] Continuous integration with GitHub Actions
- [ ] All TS issues are fixed
- [ ] Add post deployment smoke test for `/notify` endpoint   

# Installation and local launch

1. Clone this repo: `git clone https://github.com/olexiyk/telegram-bot-bookinglayer-checker`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` with the environment variables listed below
4. Run `yarn` in the root folder
5. Run `yarn develop`

And you should be good to go! Feel free to fork and submit pull requests. Thanks!

# Environment variables

- `TOKEN` — Telegram bot token
- `MONGO` — URL of the mongo database
- `BUSINESS_DOMAIN` - api's business_domain parameter
- `PORT` - port for the web api to listen on
- `TIMEZONE` - timezone of the bot

Also, please, consider looking at `.env.sample`.

# License

MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!
