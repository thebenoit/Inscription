[Tuesday 3:51 PM] Khadidja Tchouaka
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Pressable, StyleSheet, AsyncStorage } from 'react-native';
import Header from './component_2/Header.js';
 
const App = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [session, setSession] = useState('');
  const [course, setCourse] = useState('');
 
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/KhadiPro/TCH_app.mobile_travailFinal/main/listeEtudiants.json')
      .then(response => response.json())
      .then(data => setStudents(data))
      .catch(error => console.error(error));
  }, []);
 
  const selectStudent = () => {
    const selected = students.find(student => student.id === studentId);
    setSelectedStudent(selected);
  };
 
 
  const saveCourse = async () => {
    try {
     
      const courseDetails = {
        student: selectedStudent,
        session: session,
        course: course,
      };
 
      await AsyncStorage.setItem('courseDetails', JSON.stringify(courseDetails));
      
      alert('Cours enregistré avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du cours:', error);
    }
  };
 
 
  const displayCourses = async () => {
    try {
   
      const courseDetails = await AsyncStorage.getItem('courseDetails');
 
      if (courseDetails !== null) {
       
        alert('Cours enregistré:\n' + courseDetails);
      } else {
        alert('Aucun cours enregistré.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'affichage des cours enregistrés:', error);
    }
  };
 
 
  const statusContainerStyle = {
    backgroundColor: selectedStudent ? '#34D399' : '#EF4444',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  };
 
  return (
    <View style={{ flex: 1 }}>
      <Header title="INSCRIPTION AUX COURS" />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Id:</Text>
          <TextInput
            style={styles.input}
            value={studentId}
            onChangeText={setStudentId}
          />
        </View>
        <View >
          <Text>{selectedStudent ? selectedStudent.name : 'Aucun étudiant sélectionné'}</Text>
        </View>
        <Pressable
          style={styles.button}
          onPress={selectStudent}
        >
          <Text style={styles.buttonText}>SÉLECTIONNER UN ÉTUDIANT</Text>
        </Pressable>
       
        <View style={selectedStudent ? styles.statusContainerSelected : styles.statusContainer}>
  <Text style={styles.statusText}>
    {selectedStudent ? 'Élève sélectionné' : 'Confirmer votre sélection'}
  </Text>
</View>
        <View style={styles.inputContainer}>
       
          <Text style={styles.label}>
            {selectedStudent ? `01 ${selectedStudent.name} en session:` : '00 Aucun étudiant sélectionné en session:'}
          </Text>
          <TextInput
            style={styles.input}
            value={session}
            onChangeText={setSession}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>enregistrer au cours:</Text>
          <TextInput
            style={styles.input}
            value={course}
            onChangeText={setCourse}
          />
        </View>
        <Button
          title="ENREGISTRER"
          onPress={saveCourse}
        />
        <Button
          title="AFFICHER"
          onPress={displayCourses}
        />
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#34D399',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
 
export default App;
 