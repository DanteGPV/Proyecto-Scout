import itemsComidas from "@/comidas.json";
import SuministrosCard from "@/components/ui/card-suministros";
import Titulos from "@/components/ui/titulos";
import itemsLimpiezas from "@/limpieza.json";
import itemsMantenimiento from "@/mantenimiento.json";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const imagenComida = "https://img.magnific.com/vector-gratis/kawaii-comida-rapida-lindo-hot-dog-comida-rapida-hamburguesas-papas-fritas-bebida-ilustracion-salsa-tomate_24908-60601.jpg?semt=ais_hybrid&w=740&q=80"

const imagenLimpieza = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBNVMT9EiaZEPRcEhwWm9nKFbgv79DoECq7osoT--Xk6klJaQM-l647LZN&s=10"

const imagenMantenimiento = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBN87miSVmA_uCjSpB4zot9tEFZxBc9m_Jh_oBYCCFSwR6sfhr2mF99Rx7&s=10"

const totalComida = itemsComidas.reduce((acumulador, item)=> acumulador + item.cantidad, 0);
const totalLimpieza= itemsLimpiezas.reduce((acumulador, item)=> acumulador + item.cantidad, 0);
const totalMantenimiento = itemsMantenimiento.reduce((acumulador, item)=> acumulador + item.cantidad, 0);

export default function suministros (){
    return(
       <SafeAreaView style={styles.safeArea}>
        <ScrollView>
            <View><Titulos titulo={"Comida"} /></View>
            <View><SuministrosCard imagenSuministro= {imagenComida} cantidadSuministro ={totalComida}/></View>
            <View><Titulos titulo={"Limpieza"} /></View>
            <View><SuministrosCard imagenSuministro={imagenLimpieza} cantidadSuministro={totalLimpieza}/></View>
            <View><Titulos titulo={"Mantenimiento"} /></View>
            <View><SuministrosCard imagenSuministro={imagenMantenimiento} cantidadSuministro={totalMantenimiento}/></View>
        </ScrollView>
       </SafeAreaView> 
    )
}

const styles = StyleSheet.create({
        safeArea:{
        flex: 1,
        backgroundColor: "#E9ECEF",
        padding: 24,
    },
})