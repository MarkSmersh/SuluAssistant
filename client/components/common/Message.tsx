import { View, Text, StyleSheet } from 'react-native'

export default function Message({ text, isUser }: MessageProps) {
  return (
    <View style={[s.message, (isUser) ? s.messageUser : null]}>
      <Text style={[s.textMessage, (isUser) ? s.textMessageUser : null]}>{text}</Text>
    </View>
  )
}

const s = StyleSheet.create({
    message: {
      backgroundColor: '#fff',
      justifyContent: 'center',
      borderRadius: 16,
      borderBottomLeftRadius: 0,
      padding: 15,
      marginTop: 10,
      alignSelf: "flex-start"
    },
    messageUser: {
      backgroundColor: '#362BB7',
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 0,
      color: "white",
      alignSelf: "flex-end"
    },
    textMessage: {
      fontFamily: "Roboto",
      maxWidth: "100%",
      color: "black"
    },
    textMessageUser: {
      color: "#FFF"
    }
});

interface MessageProps {
    text: string,
    isUser: boolean
}