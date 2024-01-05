import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Notas from "./screens/Notas";
import CreateNote from "./screens/CreateNote";
import EditNote from "./screens/EditNote";

export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Notas"
          component={Notas}
          options={{
            title: "ToDoApp",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="Crear"
          component={CreateNote}
          options={{
            title: "Crear Notas",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#129BF4" },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="Editar"
          component={EditNote}
          options={{
            title: "Editar nota",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "white",
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    tifyContent: "center",
    tifyContent: "center",
  },
});
