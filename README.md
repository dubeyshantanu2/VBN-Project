
![Logo](https://play-lh.googleusercontent.com/CmxdoCY_Rqimt7VE1gkmcGKYFeIEt355QitUfI2P5LTsxCOD-IXrh59iyP4-UZYkS6g=w240-h480-rw)


# VBN
A business network platform catering for small businesses to give and receive leads. Users shall create leads for other businesses in the network and also receive leads for their business in the network. Users can see stats of the in-person fortnight meetings held by their network.


## Tech Stack

**Client:** React Native, Expo, Navigation, Redux, CSS

**Notification:** expo-notifications

**Server:** Node, Axios


## Installation
Clone the project

```bash
  git clone https://github.com/navtech-io/biz-networking 
```
Go to the project directory

```bash
  cd src
  cd mobile
```

To install all the project dependency

```bash
  npm install 
```
And open the project in VS code.
After insatlling all the required packages, goto the following path.
**node_modules-> invariant-> browser.js** 
remove the codes from line number **28 to 46**. 
This is to avoid the error 
"Invariant Violation: "main" has not been registered." which is due a bug to the material top tab navigation package.



    
## Run Locally


Start the server

```bash
  expo start
```
Using **Expo Go** tool for android and Ios you can run the application by scanning the qr code from node metro bundler.


## Environment Variables

To run this project, you need to edit the following environment variables to .env file. The env file is present at **app->config->env.js**
with 2 different endpoints URL which nseeds to be changed at the time of making builds.



## API Reference Examples

Axios is used for every API Promise based HTTP requests. 
Default URL end points are used from env.js file. In place of headers token are sent for authentication purpose, which are extracted from Asynchronous storage. 
#### Get items examples

```http
  GET https://zg7qzp43uf.execute-api.ap-south-1.amazonaws.com/dev/users/${user_id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| 'Cookie' | `string` | **Required**.`jwt=${token}` |

#### Post items examples

```http
  POST https://zg7qzp43uf.execute-api.ap-south-1.amazonaws.com/dev/asksgives
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| 'Cookie'  | `string` | **Required**.`jwt=${token}`       |




## Documentation

Following will be the short explanation about important files and packages which are used in frontend development of this project.
The starting point of the application is app.js. At the starting point the fonts are loaded. A check in asynchronous storage to fetch user token. If the token is fetch the user will be navigated to the Home screen else will lead to authentication steps. The entire process is happeneing with help of Redux. 

Redux is used for state management. The token generated at the time of verification is stored in action.js file. Currently only 1 reducer is used which checks when presence of token to pass the user through authentication process.

Custom fonts, ie. Mulish is used which are being loaded at the initial render of the application in app.js file. Expo-fonts is used for loading fonts. To use the font, in Text just pass the style prop, fontFamily, and mention the type of font which are Regular, SemiBold, Bold, Medium, Light and ExtraBold. The fonts will pick up the fontWeight and type from expo fonts. 

React Navigation is used for routing. AuthNavigator.js and AppNavigator.js. Each files contain 
routing options ie, TabNavigation, StackNavigation and MaterialTopTabNavigation. Four tabs are nesting inside App navigator and each have various screens defined with StackNavigation.  

Notifications are handled using expo notification. https://docs.expo.dev/versions/latest/sdk/notifications/ Currently for Leads and thankyou notes the notifications are being pushed to other users.

Formik and Yup is used for all input form validations.



## Screenshots

![App Screenshot](https://play-lh.googleusercontent.com/kxLPxE9qAudN5NWN6fv-n6eAx0AhlWmeO8F1qvLu_SrUIQmyiNmaRN_TU3cOt12ZHu8=w2560-h1440-rw)
![App Screenshot](https://play-lh.googleusercontent.com/KVOj142z2lKWLAE6pBp5saPMFI7fHwpZZnUulK0aJFW8KcjfCkwHj66EDufAK9elvVgd=w2560-h1440-rw)
![App Screenshot](https://play-lh.googleusercontent.com/pGSUljj699CE7UFYxTBNFMo8dsQhiL-dLaFbcR9NlU9f97uBcgR0A50zAseWDat02w=w2560-h1440-rw)


## Deployment

To deploy this project for android you need an expo account
run

```bash
  expo build:android
```

Select apk 
then select generate new keystore
The build process will take about 20 -25 min to build .apk file 



To deploy this project for Ios you need an expo account and 
run

```bash
  expo build:ios
```
 


## Support

For support, email developer.india@navtech.io

