import { StyleSheet, Text, View } from "react-native"

interface TituloProps{
    titulo: string
}

export default function Titulos({titulo}: TituloProps){
    return(
    <View style={styles.titleCard}>
        <Text style={styles.titleText}>{titulo}</Text>
    </View>
    )
}

const styles = StyleSheet.create({
    titleCard:{
        padding:10,
        borderRadius: 25,
        margin: 10,
        backgroundColor: "white"
    },
    titleText:{
        color: "black",
        padding: 10,
        fontSize: 25,
        fontWeight: "900"
    }
})