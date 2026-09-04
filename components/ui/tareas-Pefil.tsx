import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

interface TareasPerfilProps {
  nombre: string;
  texto: string;
  imagen: string ;
}

export default function TareasPerfil ({nombre, texto, imagen}: TareasPerfilProps){
    return(
        <View style= {styles.card}>
         <Image style = {styles.image} source={{uri: imagen}}/>
         <View style={styles.cardText}>
          <Text style = {[styles.description, styles.title]}>{nombre}</Text>
          <Text style = {styles.description}> {texto}</Text>
          </View>
        </View>
        )
};

const styles = StyleSheet.create({
  card:{
    flexDirection: "row",
    padding: 10,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "flex-start"
  },
  image:{
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10
  },
  cardText:{
    flexDirection:"column"

  },
  description:{
    color: "black",
    padding: 10,
    textAlignVertical: "top",
    fontSize: 20
  },
  title:{
    fontWeight: 600,
  }
})