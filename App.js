import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// ----- Tela de Lista -----
function ListaPetsScreen({ navigation, pets }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DetalhesPet", { pet: item })}
          >
            <Image source={{ uri: item.foto }} style={styles.imagem} />
            <Text style={styles.nome}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ----- Tela de Detalhes -----
function DetalhesPetScreen({ route }) {
  const { pet } = route.params;
  return (
    <View style={styles.container}>
      <Image source={{ uri: pet.foto }} style={styles.fotoGrande} />
      <Text style={styles.titulo}>{pet.nome}</Text>
      <Text>Idade: {pet.idade}</Text>
      <Text>Sexo: {pet.sexo}</Text>
      <Text>História: {pet.historia}</Text>
    </View>
  );
}

// ----- Tela de Cadastro -----
function CadastroScreen({ pets, setPets }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");

  const [especie, setEspecie] = useState("");
  const [sexo, setSexo] = useState("");
  const [idade, setIdade] = useState("");
  const [porte, setPorte] = useState("");

  // Helpers de formatação
  const onlyDigits = (text = "") => text.replace(/\D/g, "");
  const formatCelular = (text = "") => {
    const d = onlyDigits(text).slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
  };
  const formatDate = (text = "") => {
    const d = onlyDigits(text).slice(0, 8);
    if (d.length <= 2) return d;
    if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  };

  // Validações
  const emailValido = /\S+@\S+\.\S+/.test(email);
  const senhaConfere = senha !== "" && senha === confSenha;
  const formValido =
    nome &&
    emailValido &&
    celular.length === 15 &&
    dataNasc.length === 10 &&
    senhaConfere &&
    especie &&
    sexo &&
    idade &&
    porte;

  // Botão de seleção
  const BotaoSelecao = ({ label, value, selected, onPress }) => (
    <TouchableOpacity
      style={[styles.btnSelecao, selected === value && styles.btnSelecionado]}
      onPress={() => onPress(value)}
    >
      <Text
        style={[styles.textBtn, selected === value && styles.textBtnSelecionado]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

 // Ação final
  const handleSubmit = () => {
    const novoPet = {
      id: String(pets.length + 1),
      nome,
      idade,
      sexo,
      historia: `Pet cadastrado por ${nome}, porte ${porte}.`,
      foto: especie === "gato"
        ? "https://i.pinimg.com/474x/0c/79/b7/0c79b7dae034fdd36b5304427dc79f05.jpg"
        : "https://i.pinimg.com/474x/f5/7c/4c/f57c4c0724668fa16a842fee369433ab.jpg",
    };

    setPets([...pets, novoPet]);

    Alert.alert("Cadastro realizado! 🎉", `${nome}, seu pedido foi salvo.`);

    // limpa formulário
    setNome(""); setEmail(""); setCelular(""); setDataNasc("");
    setSenha(""); setConfSenha(""); setEspecie(""); setSexo(""); setIdade(""); setPorte("");
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.titulo}>🐾 Seus Dados</Text>

      <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Celular" value={celular} onChangeText={(t) => setCelular(formatCelular(t))} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Data de Nascimento" value={dataNasc} onChangeText={(t) => setDataNasc(formatDate(t))} keyboardType="number-pad" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirmar Senha" value={confSenha} onChangeText={setConfSenha} secureTextEntry />

      <Text style={styles.titulo}>🐶🐱 Preferências para Adoção</Text>

      <Text style={styles.label}>Espécie</Text>
      <View style={styles.row}>
        <BotaoSelecao label="Cachorro" value="cachorro" selected={especie} onPress={setEspecie} />
        <BotaoSelecao label="Gato" value="gato" selected={especie} onPress={setEspecie} />
      </View>

      <Text style={styles.label}>Sexo</Text>
      <View style={styles.row}>
        <BotaoSelecao label="Macho" value="macho" selected={sexo} onPress={setSexo} />
        <BotaoSelecao label="Fêmea" value="femea" selected={sexo} onPress={setSexo} />
      </View>

      <Text style={styles.label}>Idade</Text>
      <View style={styles.row}>
        <BotaoSelecao label="Filhote" value="filhote" selected={idade} onPress={setIdade} />
        <BotaoSelecao label="Adulto" value="adulto" selected={idade} onPress={setIdade} />
        <BotaoSelecao label="Idoso" value="idoso" selected={idade} onPress={setIdade} />
      </View>

      <Text style={styles.label}>Porte</Text>
      <View style={styles.row}>
        <BotaoSelecao label="Pequeno" value="pequeno" selected={porte} onPress={setPorte} />
        <BotaoSelecao label="Médio" value="medio" selected={porte} onPress={setPorte} />
        <BotaoSelecao label="Grande" value="grande" selected={porte} onPress={setPorte} />
      </View>

      <TouchableOpacity
        style={[styles.btnFinal, !formValido && styles.btnDesabilitado]}
        disabled={!formValido}
        onPress={handleSubmit}
      >
        <Text style={styles.textFinal}>Quero Adotar!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ----- Tela Sobre -----
function SobreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sobre o Abrigo</Text>
      <Text>Esse é um app fictício para adoção de pets.</Text>
    </View>
  );
}

// ----- Stack Navigator -----
const Stack = createStackNavigator();
function AdocaoStack({ pets }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListaPets" options={{ title: "Pets para Adoção" }}>
        {(props) => <ListaPetsScreen {...props} pets={pets} />}
      </Stack.Screen>
      <Stack.Screen name="DetalhesPet" component={DetalhesPetScreen} options={{ title: "Detalhes do Pet" }} />
    </Stack.Navigator>
  );
}

// ----- Tabs -----
const Tab = createBottomTabNavigator();

export default function App() {
  const [pets, setPets] = useState([
    { id: "1", nome: "Thor", idade: "2 anos", sexo: "Macho", historia: "Um cachorro muito brincalhão.", foto: "https://i.pinimg.com/474x/0c/79/b7/0c79b7dae034fdd36b5304427dc79f05.jpg" },
    { id: "2", nome: "Laika", idade: "1 ano", sexo: "Fêmea", historia: "Gatinha carinhosa que adora dormir.", foto: "https://i.pinimg.com/474x/f5/7c/4c/f57c4c0724668fa16a842fee369433ab.jpg" },
  ]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Adoção") iconName = "paw";
            else if (route.name === "Cadastrar") iconName = "create";
            else if (route.name === "Sobre") iconName = "information-circle";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Adoção">
          {(props) => <AdocaoStack {...props} pets={pets} />}
        </Tab.Screen>
        <Tab.Screen name="Cadastrar">
          {(props) => <CadastroScreen {...props} pets={pets} setPets={setPets} />}
        </Tab.Screen>
        <Tab.Screen name="Sobre" component={SobreScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ----- Estilos -----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
  },
  imagem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  fotoGrande: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  // estilos do formulário
  formContainer: {
    padding: 20,
    backgroundColor: "#fdfdfd",
  },
  label: {
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "600",
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  btnSelecao: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 6,
    backgroundColor: "#fff",
  },
  btnSelecionado: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  textBtn: {
    color: "#000",
  },
  textBtnSelecionado: {
    color: "#fff",
    fontWeight: "bold",
  },
  btnFinal: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  btnDesabilitado: {
    backgroundColor: "#aaa",
  },
  textFinal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
