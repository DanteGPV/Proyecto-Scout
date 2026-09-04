import { useRouter } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen(){
    const router = useRouter()
    return(
        <SafeAreaView style={styles.safeArea}>
        <View style= {styles.content}>
            <Text style= {styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Registrate para empezar</Text>
            <View style={styles.form}>
                <TextInput style={styles.input}
                placeholder="Email..." 
                placeholderTextColor={"#999"}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"></TextInput>
                <TextInput style={styles.input} 
                placeholder="Contraseña..." 
                placeholderTextColor={"#999"}
                autoComplete="password"
                secureTextEntry
                autoCapitalize="none"></TextInput>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/(auth)/login")}>
                    <Text style={styles.linkButtonText} >¿Ya tenés una cuenta?</Text><Text style={styles.linkButtonTextBold}>Logueate</Text>
                </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea:{
        flex:1,
    },
    content: {
        flex:1,
        backgroundColor: "white",
        borderRadius: 25,
        flexDirection: "column",
        padding: 24,
        justifyContent: "center",
        alignItems:"center"
    },
    title:{
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle:{
        fontSize:16,
        marginBottom: 32,
        color: "#666",
    },
    form:{
        width:"100%"
    },
    input:{
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        padding: 16,
        fontSize:16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor:"#e0e0e0",
    },
    button:{
        backgroundColor: "coral",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    buttonText:{
        color:"#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    linkButton:{
        marginTop: 24,
        alignItems:"center"
    },
    linkButtonText:{
        color: "coral",
        fontSize: 14,

    },
    linkButtonTextBold:{
        color:"coral",
        fontWeight: "600",
    }

})