# Mobilepoly - The Virtual Monopoly Bank

Are you a fan of Monopoly but tired of carrying around cash and keeping track of who owes what? Look no further than mobilepoly! This app simulates the Monopoly banking experience using NFC cards as virtual debit cards for each player. 

With mobilepoly, you can:
- Keep track of each player's balance and transactions
- Easily transfer money between players
- Use the app as a digital bank during the game
- Keep the game moving with quick and easy transactions

<p align="center">
  <video src="https://user-images.githubusercontent.com/71894332/214652171-af0e21cc-8fdd-45c4-85e9-a700c42f0583.mp4"  controls> </video>
  <video src="https://user-images.githubusercontent.com/71894332/214652703-61d19fde-356c-4967-9f9e-ce3ce15aa652.mp4"  controls> </video>
</p>

## How it works
1. Each player select its favorite NFC card, which they can use to connect to the app
2. Players can then use the app to check their balance, make transactions with other players, and keep track of the game's progress
3. The app acts as a virtual bank, allowing for seamless and efficient transactions

## Requirements
- NFC-enabled device
- NFC cards for each player

## How to use
1. Each player must have an NFC card to use as their virtual debit card
3. Connect to the app using the NFC card and start playing!

## Project Structure
```
mobilepoly/
├── assets/              # App assets (images, sounds, etc.)
├── components/          # Reusable React components
│   ├── Animation.js     # Animation components
│   ├── BottomPopUp.js   # Bottom popup modal
│   ├── PlayerAdder.js   # Player creation component
│   ├── PlayerSelector.js # Player selection modal
│   └── TransactionPopUp.js # Transaction feedback modal
├── screens/             # App screens/pages
│   ├── Home.js         # Home screen
│   ├── PlayersConfig.js # Player configuration screen
│   ├── BankMenu.js     # Banking operations screen
│   └── Balance.js      # Balance checking screen
├── src/
│   └── translations/   # i18n translations (English/Spanish)
├── App.js              # Main app component
└── package.json        # Project dependencies
```

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/igorriti/mobilepoly.git
cd mobilepoly
```

2. Install dependencies:
```bash
npm install
```

3. Install EAS CLI:
```bash
npm install -g eas-cli
```

4. Login to your Expo account:
```bash
eas login
```

5. Create a development build:
```bash
eas build --profile development --platform android
```

6. Once the build is complete, install it on your device and start playing!

Note: Make sure you have an NFC-enabled device and NFC cards before running the app.

## Acknowledgments
Thanks to the Monopoly community for inspiring us to create mobilepoly.



