import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import Header from "./composant/Header";

const EtudiantPic = ({ props }) => {
  return (
    <Image
      style={styles.imageFormat}
      source={{
        uri: `${props}`,
      }}
    />
  );
};

const Etudiant = ({ id, nom, session, cours, uriPic }) => {
  return (
    <View style={styles.EtudiantContainer}>
      <EtudiantPic props={uriPic} />
      <Text style={{ padding: 10, fontSize: 15, margin: 10 }}>{nom}</Text>
    </View>
  );
};
const SectionSelection = ({
  idInput,
  onChangeText,
  id,
  nomEtudiantSelectionner,
  imageURl,
  listeEtudiants,
  selectionner,
  selectionnerEleve
}) => {
  text = "SÉLECTIONNER UN ÉTUDIANT";
  return (
    <View style={styles.selectionContainerStyle}>
      <Input titre={"Id"} text={idInput} textChanged={onChangeText} />
      <Etudiant nom={nomEtudiantSelectionner} uriPic={imageURl} />
      <Button 
      text={text}
      selectionnerEleve={selectionnerEleve} />
      <Text style={{ color: "red", textAlign: "center", fontSize: 20 }}>
        {selectionner ? "Élève sélectionné" : "Confirmé votre Sélection"}
      </Text>
    </View>
  );
};

const SectionAjouterAUCours = () => {
  return (
    <View style={styles.ajouterAuCoursContainer}>
      <Input titre={"Session"} />
      <Input titre={"Enregistrer élève au cour"} />
    </View>
  );
};

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

const Button = ({ text, selectionner,selectionnerEleve }) => {
  return (
    <View>
      <TouchableOpacity
        style={[styles.buttonStyle, { backgroundColor: "#2199de" }]}
        onPress={() => selectionnerEleve()}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default function App() {
  const URLDATA =
    "https://raw.githubusercontent.com/thebenoit/Inscription/main/listeEtudiant.json";

  const [etudiantSelectionner, setEtudiantSelectionner] = useState({
    id: "00",
    Nom: "Aucun Etudiant selectionné",
    uriPic:
      "https://i.pinimg.com/736x/dc/08/0f/dc080fd21b57b382a1b0de17dac1dfe6.jpg",
  });
  //liste d'étudiant
  const [listeEtudiants, setListeEtudiants] = useState([]);

  const [inputId, setInputId] = useState("00");

  const [selectionner, setSelectionner] = useState(false);
  useEffect(() => {
    compareId();
  }, [listeEtudiants]);

  useEffect(() => {
    // Appeler fetchTask une seule fois lors du montage initial
    fetchTask(URLDATA);
  }, [inputId, setListeEtudiants]);

  const selectionnerEleve = () => {
    setSelectionner(true);
  };

  const fetchTask = (url) => {
    //fetch URL et transforme ;a reponse en Json
    fetch(url)
      .then((res) => res.json())
      //update le data avec la liste des todos
      .then((data) => {
        setListeEtudiants(data);
      })

      .catch((error) => {
        console.log(`Erreur ${error}`);
      });
  };

  /**
   * methode qui compare id de l'étudiant avec input mit
   *
   * @param {*} inputId
   * @param {*} listeEtudiant
   */
  const compareId = () => {
    // Recherche de l'étudiant correspondant à l'inputId
    const etudiant = listeEtudiants.find(
      (etudiant) => etudiant.id_etudiant === inputId
    );

    // Si un étudiant correspond à l'inputId, mettre à jour etudiantSelectionner avec ses informations
    if (etudiant) {
      setEtudiantSelectionner({
        id: etudiant.id_etudiant,
        Nom: etudiant.nom,
        uriPic: etudiant.image_url,
      });
    } else {
      // Si aucun étudiant ne correspond à l'inputId, mettre à jour avec les valeurs par défaut
      setEtudiantSelectionner({
        id: "00",
        Nom: "Aucun Etudiant selectionné",
        uriPic:
          "https://i.pinimg.com/736x/dc/08/0f/dc080fd21b57b382a1b0de17dac1dfe6.jpg",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header titre="Inscriptions au cours" couleurFond="#6e7276" />
      <SectionSelection
        idInput={inputId}
        listeEtudiants={listeEtudiants}
        nomEtudiantSelectionner={etudiantSelectionner.Nom}
        imageURl={etudiantSelectionner.uriPic}
        onChangeText={setInputId}
        selectionner={selectionner}
        selectionnerEleve={selectionnerEleve}
      />
      <SectionAjouterAUCours />
      <Button text={"Enregistrer"} />
      <Button text={"Afficherer"} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  selectionContainerStyle: {
    margin: 15,
  },
  ajouterAuCoursContainer: {
    margin: 15,
  },
  InputBoxStyle: {
    borderColor: "black",
    borderWidth: 0.5,
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
  imageFormat: {
    width: 110,
    height: 110,
    paddingRight: 10,
  },
  EtudiantContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottomColor: "#DDD",
    borderBottomWidth: 2,
    alignItems: "center",
    paddingTop: 5,
    margin: 15,
  },
});
