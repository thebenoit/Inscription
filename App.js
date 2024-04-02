import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Header from "./composant/Header";

const SectionSelection = () => {
  text = "SÉLECTIONNER UN ÉTUDIANT"
  return (
    <View>
      <Input titre={"Id"} />
      <Text>Aucun étudiant séléctionné</Text>
      <Button text={text}/>
      <Text>Confirmé votre Séléction</Text>
    </View>
  );
};

const SectionAjouterAUCours = () => {

  return(
    <View>
      <Input titre={"Session"} />
      <Input titre={"Enregistrer élève au cour"}/>
      


      

    </View>
  )
}

const Input = ({ titre, text, textChanged, type } = {}) => {
  

  return (
    <View>
      <Text style={styles.inputName}>{titre}</Text>
      <TextInput
        style={styles.InputBoxStyle}
        onChangeText={textChanged} //capture ce qui enregistrer dans le textInput et modifie la variable texte
        value={text} //assure que le TextInput affiche toujours la valeur actuelle de texte
        keyboardType={type}
      />
    </View>
  );
};

const Button = ({text}) =>{
  
  return(
    <View>
      <TouchableOpacity
        style={[styles.buttonStyle, { backgroundColor: "#2199de" }]}
        onPress={() => Alert.alert("allo")}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>


  )
}
export default function App() {
  return (
    <View style={styles.container}>
      <Header titre="Inscriptions au cours" couleurFond="blue" />
      <SectionSelection />
      <SectionAjouterAUCours/>
      <Button text={"Enregistrer"}/>
      <Button text={"Afficher"}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    /* flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',*/
  },
  InputBoxStyle: {
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    //width: "85%",
  },
  inputName: {
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
  buttonStyle: {
    borderRadius: 5,
    padding: 5,
    margin: 5,
  },
});
