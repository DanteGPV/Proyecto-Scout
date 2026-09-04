import TareasPerfil from "@/components/ui/tareas-Pefil";
import { COLORS, SPACING } from "@/constants/theme";
import listaPerfiles from "@/perfiles.json";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function inicio() {
    return(
    
        <SafeAreaView style = {styles.safeArea}>
            <ScrollView>
            <View><Calendar style = {styles.calendar}/></View>
            <View style = {styles.flatList}>
            <FlatList
            data={listaPerfiles} renderItem={({item}) =>{
                return(
                <TareasPerfil nombre={item.nombre} texto={item.descripción} imagen={item.imagen}/>)
            }}
            />
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea:{
        flex: 1,
        backgroundColor: COLORS.light.screenBackground //"#E9ECEF",
    },
    flatList:{
        paddingHorizontal: SPACING.md
    },
    calendar:{
        margin: SPACING.mdp,
        borderRadius: 15
    }
})