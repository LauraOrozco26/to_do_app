import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import appFirebase from '../credenciales'
import {getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc} from 'firebase/firestore'
import {ListItem, Avatar} from '@rneui/themed'
import { ListItemChevron } from '@rneui/base/dist/ListItem/ListItem.Chevron'
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content'
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title'
import { ListItemSubtitle } from '@rneui/base/dist/ListItem/ListItem.Subtitle'
const db = getFirestore(appFirebase)

export default function Notas(props) {

    const [lista, setLista] = useState([])

    const deleteNote = async (id) => {
        try {
          await deleteDoc(doc(db, 'notas', id));
          Alert.alert('Éxito', 'Nota eliminada con éxito');
          const updatedList = lista.filter((note) => note.id !== id);
          setLista(updatedList);
        } catch (error) {
          console.error('Error al eliminar la nota:', error);
        }
      };

    //logica para llamar la lista de documentos
    useEffect(() => {
        const getLista = async()=>{
            try {
                const querySnapshot = await getDocs(collection(db, 'notas'))
                const docs = []
                querySnapshot.forEach((doc)=>{
                    const {titulo, detalle, fecha, hora} = doc.data()
                    docs.push({
                        id:doc.id,
                        titulo,
                        detalle,
                        fecha,
                        hora
                    })
                })
                setLista(docs);
            } catch (error) {
                console.log(error);
            }
        }
        getLista()
    }, [lista])
  
    return (
      <ScrollView>
        <View>
            <TouchableOpacity style={styles.boton} onPress={()=>props.navigation.navigate('Crear')}>
                <Text style={styles.textoBoton}>Agregar una nueva tarea</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.contenedor}>
            {lista.map((not)=>(
                <ListItem bottomDivider key={not.id}>
                    <ListItemContent>
                        <ListItemTitle style={styles.titulo}>{not.titulo}</ListItemTitle>
                        <ListItemSubtitle>{not.fecha}</ListItemSubtitle>
                    </ListItemContent>
                    <FontAwesome name="pencil" size={24} color="black" style={styles.icono} onPress={() => {props.navigation.navigate('Editar',{
                    notaId: not.id
                })}} />
                    <FontAwesome name="trash" size={24} color="black" style={styles.icono} onPress={() => deleteNote(not.id)} />

                </ListItem> 
            ))}
        </View>
      </ScrollView>
    )
  
}

const styles = StyleSheet.create({
    boton:{
        backgroundColor: '#129BF4',
        borderRadius: 20,
        marginLeft: 20,
        marginRight:20,
        marginTop:20       
    },
    textoBoton:{
        textAlign:'center',
        padding:10,
        color:'white',
        fontSize:16
    },
    contenedor:{
        margin:20,
        backgroundColor:'white',
        borderRadius:20,
        width:'90%',
        padding:20,
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.25,
        shadowRadius:4,
        elevation:5
    },
    titulo:{
      fontWeight:'bold'
    }
})
