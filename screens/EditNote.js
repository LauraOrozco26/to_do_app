import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

import appFirebase from '../credenciales';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const db = getFirestore(appFirebase);

export default function EditNote(props) {
  const initialState = {
    titulo: '',
    detalle: '',
    fecha: '',
    hora: '',
  };

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [estado, setEstado] = useState(initialState);

  useEffect(() => {
    const getOneNote = async (id) => {
      try {
        const docRef = doc(db, 'notas', id);
        const docSnap = await getDoc(docRef);
        setEstado(docSnap.data());
      } catch (error) {
        console.log(error);
      }
    };

    getOneNote(props.route.params.notaId);
  }, [props.route.params.notaId]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      '/' +
      (tempDate.getMonth() + 1) +
      '/' +
      tempDate.getFullYear();
    let fTime =
      tempDate.getHours() + ' : ' + tempDate.getMinutes();

    setEstado({
      ...estado,
      fecha: fDate,
      hora: fTime,
    });
  };

  const showMode = (currentDate) => {
    setShow(true);
    setMode(currentDate);
  };

  const handleChangeText = (value, name) => {
    setEstado({ ...estado, [name]: value });
  };

  const saveEditedNote = async () => {
    try {
      if (
        estado.titulo === '' ||
        estado.detalle === '' ||
        estado.fecha === '' ||
        estado.hora === ''
      ) {
        Alert.alert(
          'Mensaje importante',
          'Debes rellenar todos los campos requeridos'
        );
      } else {
        const notaActualizada = {
          titulo: estado.titulo,
          detalle: estado.detalle,
          fecha: estado.fecha,
          hora: estado.hora,
        };

        await updateDoc(
          doc(db, 'notas', props.route.params.notaId),
          notaActualizada
        );
        Alert.alert('Éxito', 'Nota actualizada con éxito');
        props.navigation.navigate('Notas');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.caja}>
        <TextInput
          placeholder="Ingresa el título"
          style={styles.textoInput}
          value={estado.titulo}
          onChangeText={(value) => handleChangeText(value, 'titulo')}
        />
        <TextInput
          placeholder="Ingresa el detalle"
          multiline={true}
          numberOfLines={4}
          style={styles.textoInput}
          value={estado.detalle}
          onChangeText={(value) => handleChangeText(value, 'detalle')}
        />

        {/* Contenedor de fecha */}
        <View style={styles.inputDate}>
          <TextInput
            placeholder="1/1/2024"
            style={styles.textoDate}
            value={estado.fecha}
          />
          <TouchableOpacity
            style={styles.botonDate}
            onPress={() => showMode('date')}
          >
            <Text style={styles.subtitle}>Date</Text>
          </TouchableOpacity>
        </View>

        {/* Contenedor de hora */}
        <View style={styles.inputDate}>
          <TextInput
            placeholder="6 : 30"
            style={styles.textoDate}
            value={estado.hora}
          />
          <TouchableOpacity
            style={styles.botonDate}
            onPress={() => showMode('time')}
          >
            <Text style={styles.subtitle}>Hora</Text>
          </TouchableOpacity>
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            minimumDate={new Date('2024-1-1')}
          />
        )}

        <TouchableOpacity
          style={styles.botonEnviar}
          onPress={saveEditedNote}
        >
          <Text style={styles.textoBtnEnviar}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  caja: {
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 20, 
    width: '90%',
  },
  textoInput: {
    borderColor: 'slategray',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    width: '100%', 
  },
  inputDate: {
    width: '100%',
    flexDirection: 'row',
  },
  botonDate: {
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 10,
    width: '30%',
    height: '90%',
    marginTop: 10,
    marginLeft: 10,
  },
  textoDate: {
    borderColor: 'slategray',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
  },
  botonEnviar: {
    backgroundColor: '#129BF4',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 20,
    margin: 20,
    padding: 10,
    width: '100%', 
  },
  textoBtnEnviar: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
});
