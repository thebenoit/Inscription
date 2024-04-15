import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Modal, Button as RNButton } from "react-native";
import Header from "./component_2/Header";

const EtudiantPic = ({ uriPic }) => {
  return (
    <Image
      style={styles.imageFormat}
      source={{
        uri: uriPic,
      }}
    />
  );
};

const Etudiant = ({ id, nom, uriPic }) => {
  return (
    <View style={styles.EtudiantContainer}>
      <EtudiantPic uriPic={uriPic} />
      <Text style={{ padding: 10, fontSize: 15, margin: 10 }}>{nom}</Text>
    </View>
  );
};

const SectionSelection = ({ idInput, onChangeText, nomEtudiantSelectionner, imageURl, selectionner, selectionnerEtudiant, session, updateSession, cours }) => {
  const text = "SÉLECTIONNER UN ÉTUDIANT";

  const handleSelection = () => {
    selectionnerEtudiant();
    updateSession(session, cours); // Mettre à jour la session avec la session de l'étudiant sélectionné et les cours
  };

  return (
    <View style={styles.selectionContainerStyle}>
      <Input titre={"Id"} text={idInput} textChanged={onChangeText} />
      <Etudiant nom={nomEtudiantSelectionner} uriPic={imageURl} />
      
      <TouchableOpacity
        style={[styles.buttonStyle, { backgroundColor: "#2199de" }]}
        onPress={handleSelection}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
      <Text style={{ color: selectionner ? "red" : "black", textAlign: "center", fontSize: 20 }}>
        {selectionner ? "Étudiant sélectionné" : "Confirmez votre Sélection"}
      </Text>
      <Text style={{ marginLeft: 15, marginTop: 10, color: "#888" }}>
        {selectionner && (
          `Étudiant sélectionné : ${idInput} - ${nomEtudiantSelectionner} est inscrit à la session ${session}`
        )}
      </Text>
    </View>
  );
};

const SectionAjouterAUCours = ({ session, onSessionChange, cours, onCoursChange }) => {
  return (
    <View style={styles.ajouterAuCoursContainer}>
      <TextInput
        style={styles.InputBoxStyle}
        placeholder={`Session: ${session}`}
        onChangeText={onSessionChange}
        value={session}
      />
      <TextInput
        style={styles.InputBoxStyle}
        placeholder="Enregistrer étudiant au cours"
        onChangeText={onCoursChange}
        value={cours}
      />
    </View>
  );
};

const Input = ({ titre, text, textChanged, type }) => {
  return (
    <View>
      <Text style={styles.inputName}>{titre}</Text>
      <TextInput
        style={styles.InputBoxStyle}
        onChangeText={textChanged}
        value={text}
        keyboardType={type}
      />
    </View>
  );
};

const Button = ({ text, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, { backgroundColor: "#2199de" }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default function App() {
  const URLDATA = "https://raw.githubusercontent.com/thebenoit/Inscription/main/listeEtudiant.json";

  const [etudiantSelectionner, setEtudiantSelectionner] = useState({
    id: "00",
    Nom: "Aucun Etudiant selectionné",
    uriPic: "https://i.pinimg.com/736x/dc/08/0f/dc080fd21b57b382a1b0de17dac1dfe6.jpg",
    session: "",
  });

  const [listeEtudiants, setListeEtudiants] = useState([]);
  const [inputId, setInputId] = useState("00");
  const [selectionner, setSelectionner] = useState(false);
  const [session, setSession] = useState("");
  const [cours, setCours] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [etudiantInfo, setEtudiantInfo] = useState({ id: "", nom: "", session: "", cours: [] });

  useEffect(() => {
    compareId();
  }, [listeEtudiants]);

  useEffect(() => {
    fetchTask(URLDATA);
  }, [inputId]);

  const selectionnerEtudiant = () => {
    setSelectionner(true);
  };

  const fetchTask = (url) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setListeEtudiants(data);
      })
      .catch((error) => {
        console.log(`Erreur ${error}`);
      });
  };

  const compareId = () => {
    const etudiant = listeEtudiants.find((etudiant) => etudiant.id_etudiant === inputId);

    if (etudiant) {
      setEtudiantSelectionner({
        id: etudiant.id_etudiant,
        Nom: etudiant.nom,
        uriPic: etudiant.image_url,
        session: etudiant.session,
      });
    } else {
      setEtudiantSelectionner({
        id: "00",
        Nom: "Aucun Etudiant selectionné",
        uriPic: "https://i.pinimg.com/736x/dc/08/0f/dc080fd21b57b382a1b0de17dac1dfe6.jpg",
        session: "",
      });
    }
  };

  const handleSelection = () => {
    selectionnerEtudiant();
    updateSession(session, cours); // Mettre à jour la session avec la session de l'étudiant sélectionné
  };

  const updateSession = (sessionEtudiant, coursEtudiant) => {
    if (selectionner) {
      setSession(sessionEtudiant);
      setCours(coursEtudiant);
    }
  };

  const enregistrerAction = () => {
    // Vérifier si le nouveau cours est déjà inscrit dans la session
    const coursExistant = etudiantInfo.cours.includes(cours);
    // Vérifier si plus de 5 cours sont inscrits dans la session
    const tropDeCours = etudiantInfo.cours.length + 1 > 5;
  
    if (coursExistant) {
      alert("Erreur : Ce cours est déjà inscrit dans la session.");
    } else if (tropDeCours) {
      alert("Erreur : Vous avez déjà inscrit 5 cours dans cette session.");
    } else {
      // Si le cours n'est pas déjà inscrit et qu'il n'y a pas plus de 5 cours, procéder à l'enregistrement
      const nouvelEtudiantInfo = {
        id: etudiantSelectionner.id,
        nom: etudiantSelectionner.Nom,
        session: session,
        cours: [...etudiantInfo.cours, cours], // Ajouter le nouveau cours à la liste des cours de l'étudiant
      };
  
      // Mettre à jour l'état de l'étudiant avec les nouveaux cours
      setEtudiantInfo(nouvelEtudiantInfo);
      setModalVisible(true);
      // Vider les champs session et cours
      setSession("");
      setCours("");
    }
  };  
  
  const afficherAction = () => {
    // Récupérer les cours de l'étudiant actuellement sélectionné
    const etudiant = listeEtudiants.find((etudiant) => etudiant.id_etudiant === inputId);
  
    if (etudiant) {
      // Récupérer tous les cours enregistrés pour l'étudiant actuellement sélectionné
      const coursEnregistres = etudiantInfo.cours;
      // Récupérer les cours déjà présents dans la liste de cours de l'étudiant
      const coursDejaPresents = etudiant.cours;
  
      // Fusionner les deux listes de cours en supprimant les doublons
      const tousLesCours = [...new Set([...coursEnregistres, ...coursDejaPresents])];
  
      // Afficher les cours dans la fenêtre modale
      setModalVisible(true);
      setEtudiantInfo({
        id: etudiant.id_etudiant,
        nom: etudiant.nom,
        session: etudiant.session,
        cours: tousLesCours,
      });
    }
  };
  
  
  
  
  
  
  
  
  

  const closeModal = () => {
    setModalVisible(false);
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
        selectionnerEtudiant={selectionnerEtudiant}
        session={etudiantSelectionner.session}
        updateSession={updateSession}
        cours={cours}
        onCoursChange={setCours}
      />
      <SectionAjouterAUCours session={session} onSessionChange={setSession} cours={cours} onCoursChange={setCours} />
      <Button text={"Enregistrer"} onPress={enregistrerAction} />
      <Button text={"Afficher"} onPress={afficherAction} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>ID: {etudiantInfo.id}</Text>
            <Text>Nom: {etudiantInfo.nom}</Text>
            <Text>Session: {etudiantInfo.session}</Text>
            <Text>Cours: {etudiantInfo.cours.join(", ")}</Text>
            <RNButton title="OK" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  }
});
