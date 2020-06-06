import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./pages/home";
import Locais from "./pages/locais";
import Detalhe from "./pages/detalhe";

const AppStack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        headerMode="none"
        screenOptions={{ cardStyle: { backgroundColor: "#f0f0f5" } }}
    >
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="Detalhe" component={Detalhe} />
        <AppStack.Screen name="Locais" component={Locais} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
//#region ANOTACOES ROTAS
/*
  NavigationContainer: funciona como o RouterBrowser
*/
//#endregion
