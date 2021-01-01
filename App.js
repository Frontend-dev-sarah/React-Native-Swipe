import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Image, Text, View, ScrollView } from 'react-native';
import Deck from './src/Deck';
import data from './data';
import { Card, Button } from 'react-native-elements';

export default function App() {
  return (
    <View style={styles.container}>
      <Deck 
        data = {data}
        renderItem = {renderCard}
        renderNoMoreCards
        swipeLeft
        swipeRight
      />
    </View>
  );
}


renderCard = (item) => {
return (
    <Card key = {item.id}>
      <Card.Title>{item.name}</Card.Title>
      <Card.Image source = {item.image} resizeMode = 'contain'></Card.Image>
        <Button
        icon={{name: 'swipe', color: 'white'}}
        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
        title='Swipe'/>
   </Card>
    
);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 50
  },
});
