import React, { useState, useEffect } from "react";
import { SvgUri } from "react-native-svg";
import { Feather as Icon } from "@expo/vector-icons";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";

import * as Location from "expo-location";

import api from "../../services/api";

interface itemInterface {
  idItem: number;
  nome: string;
  imageUrl: string;
}
interface locaisInterface {
  IdLocal: number;
  Imagem: string;
  nome: string;
  latitude: number;
  longitude: number;
}
interface filtro {
  ufSelecionado: string;
  cidadeSelecionada: string;
}

const Locais = () => {
  const Navigation = useNavigation();
  const route = useRoute();
  const routesParams = route.params as filtro;

  const [itens, setItens] = useState<itemInterface[]>([]);
  const [itensSelecionados, setItensSelecionados] = useState<number[]>([]);
  const [posicaoInicial, setPosicaoInicial] = useState<[number, number]>([
    0,
    0,
  ]);
  const [locais, setLocais] = useState<locaisInterface[]>([]);

  useEffect(() => {
    api.get("itens").then((res) => {
      setItens(res.data);
    });
  }, []);

  useEffect(() => {
    console.log(routesParams)
    const loadPosicao = async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Oooops...", "Precisamos acessar sua localizacao");
        return;
      }
      const posicao = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = posicao.coords;
      setPosicaoInicial([latitude, longitude]);
    };
    loadPosicao();
  }, []);

  // query params
  useEffect(() => {
    if (itensSelecionados.length > 0) {
      api
        .get("Locais", {
          params: {
            cidade: routesParams.cidadeSelecionada,
            uf: routesParams.ufSelecionado,
            itens: itensSelecionados,
          },
        })
        .then((res) => {
          if (posicaoInicial[0] !== 0) {
            console.log(res.data)
            setLocais(res.data);
          }
        });
    } else {
      const empptyLocal = locais.filter((l) => {});
      setLocais(empptyLocal);
    }
  }, [itensSelecionados]);

  const handleNavigateBack = () => {
    Navigation.goBack();
  };
  const handleNavigateToDatail = (IdLocal: number) => {
    Navigation.navigate("Detalhe", { IdLocal: IdLocal });
  };
  const handleItemSelecionado = (itemId: number) => {
    const jaSelecionado = itensSelecionados.findIndex(
      (item) => item === itemId
    );
    if (jaSelecionado >= 0) {
      const itensFiltrados = itensSelecionados.filter(
        (item) => item !== itemId
      );
      setItensSelecionados(itensFiltrados);
      return;
    } else {
      setItensSelecionados([...itensSelecionados, itemId]);
      return;
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color={"#34cb79"} />
        </TouchableOpacity>
        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>
      
        <View style={styles.mapContainer}>
          {posicaoInicial[0] !== 0 && (
            <MapView
              style={styles.map}
              loadingEnabled={posicaoInicial[0] === 0}
              initialRegion={{
                latitude: posicaoInicial[0],
                longitude: posicaoInicial[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {locais.map((local) => (
                <Marker
                  key={String(local.IdLocal)}
                  style={styles.mapMarker}
                  coordinate={{
                    latitude: Number(local.latitude),
                    longitude: Number(local.longitude),
                  }}
                  onPress={() => handleNavigateToDatail(local.IdLocal)}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: local.Imagem,
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>{local.nome}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {itens.map((item) => (
            <TouchableOpacity
              key={String(item.idItem)}
              style={[
                styles.item,
                itensSelecionados.includes(item.idItem)
                  ? styles.selectedItem
                  : {},
              ]}
              onPress={() => handleItemSelecionado(item.idItem)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.imageUrl} />
              <Text style={styles.itemTitle}>{item.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Locais;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 4,
    fontFamily: "Roboto_400Regular",
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: "#34CB79",
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: "cover",
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: "Roboto_400Regular",
    color: "#FFF",
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "space-between",

    textAlign: "center",
  },

  selectedItem: {
    borderColor: "#34CB79",
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    fontSize: 13,
  },
});
