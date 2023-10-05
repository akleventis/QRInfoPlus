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
- Options to follow (and retain click metrics)
- Open in Bitly to view link in web app if you own the link

Scope
---
- Support for both iOS and Android from one shared codebase
- Typescript for strict typing
- Secure storage for user API access token
	- Keychain service on iOS
	- Encrypted SharedPreferences on Androi
- Global state management with Redux
- Navigation and routing between multiple screens
- Error Overlay

Run Locally
---
### preconfig
- [ ] Open terminal in projects home directory '/QRInfoPlus' => `npm run client:config`
- [ ] This will create the config/secrets.ts file
- [ ] Add these two variables to the file and supply with your client id and secret which can be found here https://bitly.com/_admin/user_detail?username={yourusername}
```
export const ENV = "prod"; // prod || dev
export const CLIENT_ID_PROD = "";
export const CLIENT_SECRET_PROD = "";
export const CLIENT_ID_DEV = "";
export const CLIENT_SECRET_DEV = "";
```

### Run
- [ ] Install Expo CLI `npm install --global expo-cli`
- [ ] Download [Expo Go](https://apps.apple.com/us/app/expo-go/id982107779) in the App Store
- [ ] `npm i` 
- [ ] `expo start`
- [ ] Scan QR code displayed in terminal

