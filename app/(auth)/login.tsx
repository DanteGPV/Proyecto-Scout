import { COLORS, RADIUS, SPACING, TYPOGRAPGY } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function LoginScreen(){
    const router = useRouter();
    return(
        <SafeAreaView style={styles.safeArea}>
        <View style= {styles.content}>
            <Text style= {styles.title}>¡Hola otra vez!</Text>
            <Text style={styles.subtitle}>Logueate para continuar</Text>
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
                    <Text style={styles.buttonText}>Loguearse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkButton} onPress={()=>router.push("/(auth)/signup")}>
                    <Text style={styles.linkButtonText} >¿No tenés una cuenta?</Text><Text style={styles.linkButtonTextBold}>Registrate</Text>
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
        backgroundColor: COLORS.light.background,
        borderRadius: RADIUS.lg,
        flexDirection: "column",
        padding: SPACING.lg,
        justifyContent: "center",
        alignItems:"center"
    },
    title:{
        fontSize: TYPOGRAPGY.sizes.largeTitle,
        fontWeight: TYPOGRAPGY.weights.bold,
        marginBottom: SPACING.sm,
    },
    subtitle:{
        fontSize: TYPOGRAPGY.sizes.body,
        marginBottom: SPACING.xl,
        color: COLORS.light.textSecondary,
    },
    form:{
        width:"100%"
    },
    input:{
        backgroundColor: COLORS.light.backgroundAlt,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        fontSize: TYPOGRAPGY.sizes.body,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    button:{
        backgroundColor: COLORS.light.primary,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        alignItems: "center",
    },
    buttonText:{
        color: COLORS.light.textOnPrimary,
        fontSize: TYPOGRAPGY.sizes.body,
        fontWeight: TYPOGRAPGY.weights.semibold,
    },
    linkButton:{
        marginTop: SPACING.lg,
        alignItems:"center"
    },
    linkButtonText:{
        color: COLORS.light.primary,
        fontSize: TYPOGRAPGY.sizes.label,
    },
    linkButtonTextBold:{
        color: COLORS.light.primary,
        fontWeight: TYPOGRAPGY.weights.semibold,
    }

})