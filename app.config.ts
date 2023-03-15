import * as env from "dotenv";
env.config({ path: __dirname + "/.env" })

export default {
  "expo": {
    "name": "SuluAssistant",
    "slug": "SuluAssistant",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./client/assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./client/assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./client/assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.marksmersh.SuluAssistant"
    },
    "web": {
      "favicon": "./client/assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "5a9edc45-97a2-4bed-b922-ec81cefc5414",
        "GOOGLE_API_TOKEN": process.env.GOOGLE_API_TOKEN,
        "OPENAI_API_TOKEN": process.env.OPENAI_API_TOKEN
      }
    }
  }
}
