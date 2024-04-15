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
  Modal,
  Pressable,
} from "react-native";
import { I18n } from "i18n-js";

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
  selectionnerEleve,
}) => {
  text = "SÉLECTIONNER UN ÉTUDIANT";
  return (
    <View style={styles.selectionContainerStyle}>
      <Input titre={"Id"} text={idInput} textChanged={onChangeText} />
      <Etudiant nom={nomEtudiantSelectionner} uriPic={imageURl} />
      <Button text={text} action={selectionnerEleve} />
      <Text style={{ color: "red", textAlign: "center", fontSize: 20 }}>
        {selectionner ? "Élève sélectionné" : "Confirmé votre Sélection"}
      </Text>
    </View>
  );
};

const SectionAjouterAUCours = ({
  session,
  sessionTextChanged,
  cours,
  coursTextChanged,
  enregistrer,
  afficher,
}) => {
  return (
    <View style={styles.ajouterAuCoursContainer}>
      <Input
        titre={"Session"}
        text={session}
        textChanged={sessionTextChanged}
      />
      <Input
        titre={"Enregistrer élève au cours"}
        text={cours}
        textChanged={coursTextChanged}
      />

      <Button text={"Enregistrer"} action={enregistrer} />
      <Button text={"Afficher"} action={afficher} />
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

const Button = ({ text, selectionner, action }) => {
  return (
    <View>
      <TouchableOpacity
        style={[styles.buttonStyle, { backgroundColor: "#2199de" }]}
        onPress={() => action()}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};
const AfficherEtudiantSelectionner = ({
  modalVisible,
  etudiant,
  fermerModal,
}) => {
  const Fermer = "Fermer";

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        fermerModal();
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>ID: {etudiant.id}</Text>
          <Text>Nom: {etudiant.Nom}</Text>
          <Text>Session: {etudiant.session}</Text>
          <Image
            source={{ uri: etudiant.uriPic }}
            style={{ width: 100, height: 100 }}
          />
          <Text>Cours:</Text>
          <View>
            {etudiant.cours.map((cours, index) => (
              <Text key={index}>{cours}</Text>
            ))}
          </View>
          <Button text={Fermer} action={fermerModal} />
        </View>
      </View>
    </Modal>
  );
};
export default function App() {
  const URLDATA =
    "https://raw.githubusercontent.com/thebenoit/Inscription/main/listeEtudiant.json";

  const [etudiantSelectionner, setEtudiantSelectionner] = useState({
    id: "00",
    Nom: "Aucun Etudiant selectionné",
    session: "0",
    uriPic:
      "https://i.pinimg.com/736x/dc/08/0f/dc080fd21b57b382a1b0de17dac1dfe6.jpg",
    cours: ["no_course"],
  });
  //liste d'étudiant
  const [listeEtudiants, setListeEtudiants] = useState([]);
  const [inputId, setInputId] = useState("00");
  const [inputSession, setInputSession] = useState("");
  const [inputcours, setInputcours] = useState("");
  const [selectionner, setSelectionner] = useState(false);
  //determine is the modal is visible or not
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    compareId();
  }, [listeEtudiants]);

  useEffect(() => {
    // Appeler fetchTask une seule fois lors du montage initial
    fetchTask(URLDATA);
  }, [inputId, setListeEtudiants]);
  //chaque fois que je change le ID reset les TextInput et le booleen selection
  useEffect(() => {
    setInputSession("");
    setInputcours("");
    setSelectionner(false);
  }, [inputId]);

  const selectionnerEleve = () => {
    setSelectionner(true);
  };

  const rendreVisible = () => setModalVisible(true);
  const rendreInVisible = () => setModalVisible(false);

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
        session: etudiant.session,
        uriPic: etudiant.image_url,
        cours: etudiant.cours,
      });
    } else {
      // Si aucun étudiant ne correspond à l'inputId, mettre à jour avec les valeurs par défaut
      setEtudiantSelectionner({
        id: "00",
        Nom: "Aucun Etudiant selectionné",
        uriPic:
          "https://i.pinimg.com/736x/dc/08/0f/dc080fd21b57b382a1b0de17dac1dfe6.jpg",
        session: "0",
        cours: ["no_course"],
      });
    }
  };

  const enregistrer = () => {
    let length = etudiantSelectionner.cours.length;
    let coursModifier = etudiantSelectionner.cours;

    const coursDejaLa = listeEtudiants.some((etudiant) =>
      etudiant.cours.includes(inputId)
    );

    //si selectionner == true
    if (selectionner) {
      setEtudiantSelectionner({
        ...etudiantSelectionner,
        session: inputSession,
      });

      if (length <= 5 && inputcours != undefined && coursDejaLa === false) {
        //rentre le data dans le tableau coursModifier
        coursModifier.push(inputcours);
        setEtudiantSelectionner({
          ...etudiantSelectionner,
          cours: coursModifier,
        });
        console.log("cours: ", etudiantSelectionner.cours);
        //console.log("Session:", session)
        console.log("Cours déjà là ?:", coursDejaLa);
      } else {
        Alert,
          alert(
            `La liste est trop longue: ${length} ou le cours est vide: ${inputcours}, session: ${inputSession}`
          );
      }
    } else {
      Alert.alert("Aucun élève selectionner");
    }
  };

  return (
    <View style={styles.container}>
      <Header titre="Inscriptions au cours" couleurFond="white" />
      <SectionSelection
        idInput={inputId}
        listeEtudiants={listeEtudiants}
        nomEtudiantSelectionner={etudiantSelectionner.Nom}
        imageURl={etudiantSelectionner.uriPic}
        onChangeText={setInputId}
        selectionner={selectionner}
        selectionnerEleve={selectionnerEleve}
      />
      <SectionAjouterAUCours
        session={inputSession}
        sessionTextChanged={setInputSession}
        cours={inputcours}
        coursTextChanged={setInputcours}
        enregistrer={enregistrer}
        afficher={rendreVisible}
      />
      <AfficherEtudiantSelectionner
        etudiant={etudiantSelectionner}
        modalVisible={modalVisible}
        fermerModal={rendreInVisible}
      />
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black background
  },
  modalContent: {
    width: 300,
    height: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
