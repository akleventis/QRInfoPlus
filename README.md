# Qr+ 
<img src='https://user-images.githubusercontent.com/64287087/161136864-c150d2c0-b825-4791-9825-3fa6616eb49f.PNG' align="right" width='320px'/>

Super secret hack week project for QR Info+ page
---

- Adding a '+' to the end of any bitly shows a preview of the redirect link

- ***This mobile application renders an info+ page for Qr codes***

Features
---
- OAuth2 for users to connect their Bitly account
- Scanner support for multiple types of QR codes
 	- 👽 Contact Card 
	- 🔗 Link 
 	- 📧 Email
	- 📱 SMS
	- 📞 Phone Number
	- 📶 WiFi
  	- 📝 Text

Default Router
---
  - Decodes QR codes client-side (in React app)
  - If sign in and qr code points to a bitly link, a request to /expand is made
	- Returns additional data (Bitlink, Expanded URL, Created Date)

Bitly Router 
---
  - User must be authenticated
  - Routes to bitly.net (staging environment) and decodes QR codes using v4_public_api's `POST /v4/qrcodes/decode`
	- Returns additional data (Bitlink, Expanded URL, Created Date)	along with:
      - Brand GUID & Redirect link to open details in bitly.com if the current user owns the bitlink `https://app.bitly.com/default/bitlinks/{hash}` 

Scope
---
- Support for both iOS and Android from one shared codebase
- Secure storage for user API access token
	- Keychain service on iOS
	- Encrypted SharedPreferences on Androi
- Global state management with Redux


Run Locally
---
### preconfig
- [ ] `git clone https://github.com/akleventis/QRInfoPlus.git`
- [ ] Register an OAuth application https://app.bitly.com/settings/api/oauth/
  - Application name: `QRInfo+`
  - Application link: https://github.com/akleventis/QRInfoPlus
  - Redirect URIs: `exp://127.0.0.1:19000/`
  - Application description: `Mobile QR Code Decoder`
- [ ] Copy the generated `Client ID` and `Client Secret` values
- [ ] Open terminal in projects home directory '/QRInfoPlus' => `npm run client:config`
- [ ] This will create the .env file
- [ ] Add these two variables to the file
```
EXPO_PUBLIC_ENV = "staging" // staging || prod
EXPO_PUBLIC_CLIENT_ID = ""
EXPO_PUBLIC_CLIENT_SECRET = ""
EXPO_PUBLIC_REDIRECT_URI = "exp://127.0.0.1:19000/"
```

### Run
- [ ] Install Expo CLI `npm install --global expo-cli`
- [ ] Download [Expo Go](https://apps.apple.com/us/app/expo-go/id982107779) in the App Store
- [ ] `sudo npm i` 
- [ ] `npm run start`
- [ ] Scan QR code displayed in terminal
