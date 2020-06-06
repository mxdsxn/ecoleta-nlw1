import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons"; // icones prontos no react native
import { useNavigation } from "@react-navigation/native";
//#region ANOTACOES - componentes basicos
/*
TODO COMPONENTE TEM style COMO ATRIBUTO

View: é igual <div>
ImageBackground: uma <div> que da pra por imagem no fundo
  resizeMode: atributo para redimencionar a imagem
  imagesyle: atributo para passar style para a imagem

Stylesheets: serve para criar objetos de estilo, folhas de estilo
Text: é todo texto, sem diferenciacao tipo h1, p... etc
Image = <img>
Touchable: botoes infinitos com infinitas funcionalidades
*/

//#endregion

const Home = () => {
  const Navigation = useNavigation();

  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");

  const handleNavToLocais = () => {
    Navigation.navigate("Locais", { estado, cidade });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        imageStyle={{ width: 274, height: 368 }}
        style={styles.container}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu market place de coleta de residuos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas à encontrarem pontos de coletas de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="Selecione o estado"
            value={estado}
            onChangeText={setEstado}
            maxLength={2}
            autoCapitalize={"characters"}
            autoCorrect={false}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Selecione a cidade"
            value={cidade}
            onChangeText={setCidade}
            autoCorrect={false}
          ></TextInput>

          <RectButton style={styles.button} onPress={handleNavToLocais}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});
