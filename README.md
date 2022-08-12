
# TiX-app
This repository contains the React-Native source code for the Tix mobile application.

## Application

If your goal is just installing the application, you can find an APK file under the **release** folder which you can download and manually install on yout Android mobile device.
  
## Running the application

 You can also launch the application on a development environment using an emulator or your own device, for this you'll need the following tools:

 - Android SDK ([here](https://developer.android.com/studio))
 - Node ([here](https://nodejs.org/es/))

Then execute the following commands to set up the environment:

```

npm install

npm run android

```
This should compile and run the application on either your emulator or local device depending on what's connected at the moment you run this.

## Generating APK

To generate the apk based on the code:

```

cd android

./gradlew assembleRelease

```