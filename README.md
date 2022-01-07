# Telegram bot starter based on [grammY](https://grammy.dev) and [telegram-bot-starter](https://github.com/Borodutch/telegram-bot-starter)

# User facing features

- [x] Display a list of available products
- [x] Subscription to notifications
- [x] Each product sends one notification to the subscribed users with timeslots
- [x] Notification interval user setting
- [x] Language user setting
- [x] Notification deduplication - if product availability is the same as before, no notification is sent
- [ ] Let users know about the timezone business operates in
- [ ] Pause bot notifications between 22:00 and 7:00 - Ruhezeit 💤
- [ ] Menu for all the available commands

# Technical features todo

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
