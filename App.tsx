import { StatusBar } from 'expo-status-bar';
import { useState } from "react"
import { StyleSheet, Text, View } from 'react-native';
import { Message, Footer } from './client/components';
import { IMessage } from './client/types';

export default function App() {
  // const messageExample = 
  
  const [messages, setMessages] = useState<IMessage[]>([
    {
      text: "Hello, how can I help you today?",
      isUser: false
    }
  ]);

  const addUserMessage = (message: string) => {
    setMessages(m => [...m, { text: message, isUser: true }])
  }

  const addAssistantMessage = (message: string) => {
    setMessages(m => [...m, { text: message, isUser: false }])
  }

  return (
    <View style={s.container}>
      <View style={s.messages}>
        {messages.map((arr, i) => <Message key={i} text={arr.text} isUser={arr.isUser}></Message>)}
      </View>
      <Footer addUserMessage={(m) => addUserMessage(m)} addAssistantMessage={(m) => addAssistantMessage(m)} messages={messages}/>
      <StatusBar style="auto" />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: "column",
    margin: 20,
    marginTop: 40
  },
  messages: {
    backgroundColor: "#D9D9D9",
    width: "100%",
    borderRadius: 16,
    padding: 20,
    height: "80%",
    flexDirection: "column",
    justifyContent: "flex-end"
  }
});