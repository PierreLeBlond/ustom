# ustom

This is a wordle clone, based on sverdle implementation.

Credits to https://framagit.org/JonathanMM/sutom for the french dictionary.

It features custom word creation and top 10 leaderboard per word !

Attention ! It only uses a french dictionnary. You can create a game with any string of length 4-10, but guesses will be verified against the dictionnary.

## Developing

```bash
npm install

# start the server
npm run dev
```

### Secrets

You'll need to set environment variables in `.env.local`

```
ENCRYPTING_KEY="<your encryption key>"

UPSTASH_REDIS_REST_URL="<your (probably) local redis rest url>"
UPSTASH_REDIS_REST_TOKEN="<your (probably) local redis rest token>"
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Roadmap

- Layout on very small screens
- Server-side validation and error handling
- Extend dictionary to english words
- Sounds on submit
