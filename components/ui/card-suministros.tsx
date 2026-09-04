import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

interface cardSuministrosProps{
    cantidadSuministro: number;
    imagenSuministro: string
}

export default function SuministrosCard({cantidadSuministro, imagenSuministro}: cardSuministrosProps){
    return(
    <View style = {styles.card}>
        <Image style={styles.image} source={{uri:imagenSuministro}}/>
        <View style={styles.cardText}>
        <Text style={[styles.description, styles.quantity]}>{cantidadSuministro}</Text>
        </View>
    </View>
    )
}


const styles = StyleSheet.create({
  card:{
    flexDirection: "row",
    padding: 10,
    borderRadius: 30,
    margin: 25,
    backgroundColor: "white",
  },
  image:{
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10
  },
  cardText:{
    flex: 1,
    justifyContent: "center",
    alignContent: "center"
  },

  description:{
    color: "black",
    padding: 10,
    fontSize: 20
  },
  quantity:{
    fontWeight: "500",
    textAlign: "center",
  }
})