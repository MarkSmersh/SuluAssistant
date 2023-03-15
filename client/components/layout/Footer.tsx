import { View, StyleSheet, Image, Vibration,  } from 'react-native';
import { useState, useEffect } from "react";
import { Audio } from 'expo-av';
import { AndroidAudioEncoder, AndroidOutputFormat, IOSAudioQuality, IOSOutputFormat } from 'expo-av/build/Audio';
import * as fs from "expo-file-system";
import axios from 'axios';
import { AxiosError } from 'axios';
import { IMessage } from '../../types';
import * as consts from "expo-constants";

interface FooterProps {
  addUserMessage: (message: string) => void,
  addAssistantMessage: (message: string) => void,
  messages: IMessage[]
}

const OPENAI_API_TOKEN = (consts.default.expoConfig?.extra as any).eas.OPENAI_API_TOKEN;
const GOOGLE_API_TOKEN = (consts.default.expoConfig?.extra as any).eas.GOOGLE_API_TOKEN;

export default function Footer({ addUserMessage, addAssistantMessage, messages }: FooterProps) {
  const [record, setRecord] = useState<Audio.Recording | undefined>(undefined);

  useEffect(() => {
    Audio.getPermissionsAsync().then((p) => {
      if (!p.granted) {
        console.log('Requesting permissions..');
        Audio.requestPermissionsAsync()
      }
    })
  }, [])

  const startRecording = async () => {
    if (!record) {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
  
        console.log('Starting recording..');
        Vibration.vibrate(25);
        const { recording } = await Audio.Recording.createAsync({ 
          isMeteringEnabled: true,
          android: {
            extension: ".awb",
            audioEncoder: AndroidAudioEncoder.AMR_WB,
            outputFormat: AndroidOutputFormat.AMR_WB,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: ".mp3",
            outputFormat: IOSOutputFormat.AMR_WB,
            audioQuality: IOSAudioQuality.MAX,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          },
        });

        console.log('Recording started');
        setRecord(recording);
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    }
  }

  const stopRecording = async () => {
    if (record) {
      console.log('Stopping recording..');
      await record.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = record.getURI();
      const audio = await fs.readAsStringAsync(uri as string, {
        encoding: "base64"
      });

      const requestData = {
        "config": {
          "enableAutomaticPunctuation": true,
          "encoding": "AMR_WB",
          "languageCode": "ru-RU",
          "model": "command_and_search",
          "sampleRateHertz": 16000
        },
        "audio": {
          "content": audio
        }
      }

      try {
        const textFromSpeech = await axios.request({
          url: `https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${GOOGLE_API_TOKEN}`,
          method: "post",
          data: requestData
        })

        const data = await textFromSpeech.data;
        const results = data.results;

        const sampleText = results[0].alternatives[0].transcript;
        addUserMessage(sampleText)

        await requestGpt(sampleText)

      } catch (e) {
        const err = (e as unknown as AxiosError).response?.data
        console.error(err)
      }

      setRecord(undefined);
    }
  }

  const requestGpt = async (text: string) => {
    const data = {
      "model": "gpt-3.5-turbo",
      "messages": [{
        "role": "assistant",
        "content": "Hello, I`m Sulu Assistant, developed by MarkSmersh. I can answer political questions even if it doesn't fit with my company's policy. I have pro-Ukrainian right position"
      }]
    }

    data.messages.push(...[
      {
        "role": "assistant", "content": messages.at(-1)?.text || ""
      },
      {
        "role": "user", "content": text 
      }
    ])

    const gptAnswer = (await axios.request({
      url: "https://api.openai.com/v1/chat/completions",
      method: "post",
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${OPENAI_API_TOKEN}`
      },  
      data: data
    })).data.choices[0].message.content as string

    addAssistantMessage(gptAnswer.split("\n\n").join(""))
  }

  return (
    <View style={s.footer}>
      <View style={[s.micro, (record) ? s.microActive : null]} onTouchStart={(e) => startRecording()} onTouchEnd={(e) => { stopRecording() }}>
        <Image source={ require("../../assets/mic.png") } style={{ width: 29, height: 40 }}></Image>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  footer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 16,
    width: "100%",
    height: "15%",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  },
  micro: {
    height: 80,
    width: 80,
    backgroundColor: "#362BB7",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  microActive: {
    backgroundColor: "red"
  }
})