# Chami Demo Code readme



This folder cointain a light version of the react-native app which I have been working on during the last six months after working during two years on the iOS native version of the app. I have put in this project only the passive trcaking functionalities and the overview screens. 

- iOS app store app: https://cara.app.link/vbvd3bev6y
- Android react native app: https://cara.app.link/play

## React native

**Important:** Because of the requirements of my company, this react native app is not compatible with iOS, everything is implemented to work only on Android devices. This is due to the fact that we implemented the first version of the app only for iOS user in swift and needed at some point because of our new business model to have as quick as possible an Andoird version of the app with all main features. Thats why for instance there are no fancy animations in react native as in the iOS app. Also in react native it's nice to implement UI placeholder while the rendering is lodaing to give a better feedback to the user which was not done due to lack of time.

Quick explanation of the app: the app start on a screen where you have to put your email address (do not use a gmail address it is not working with the version I have sent you) then you receive a confirmation email to be able to use the app. Now you can tap the plus button to track data and see your data in the overviews screen. 

### Environement

- React-native 0.52.1
- Typescript 2.8.1 with strong typing
- Node 8.0.0
- npm 6.1.0

### Main libraries used for the project 

- Framework: redux
- Side effects: redux observable 
- Navigation: react navigation
- Persistency: realm 
- Ui element: native base, native elements
- Camera: react-native-camera
- User behavior tracking: Mixpanel 
- Drawing: react native svg
- Internationalisation: react intl

### Getting strated

To be able to open and run the project follow those instructions: 

- Install react native https://facebook.github.io/react-native/docs/getting-started.html
- Install typscript running this command: npm install -g typescript (more info about typscript https://github.com/Microsoft/TypeScript-React-Native-Starter)
- Download Visual studio code and open the project folder with it 
- Open a terminal in the project root folder 
- Execute npm install
- Launch an android simulator 
- Execute this command line: react-native run-android 





