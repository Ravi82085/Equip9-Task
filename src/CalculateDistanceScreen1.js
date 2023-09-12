import React, { useState } from 'react';
import { View, TextInput, Button, Image,Text ,useEffect} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalculateDistanceScreen1 = ({ navigation, route }) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const imageURL = route.params?.filePath.uri || null;


  const handleSave = async () => {
    
    await AsyncStorage.setItem('latitude', latitude);
    await AsyncStorage.setItem('longitude', longitude);

    navigation.setParams({ canNavigateToScreen2:true });
  };

  return (
    <View style={{ flex:1}}>
      <Text style={{ textAlign:'center',fontSize:20,fontWeight:'bold',padding:5}}>My Upload Picture</Text>
      {imageURL && <Image source={{ uri: imageURL }} style={{ width: 200, height: 200 ,borderRadius:100,alignSelf:'center'}} />}
      <TextInput
        placeholder="Enter Latitude"
        value={latitude}
        onChangeText={(text) => setLatitude(text)}
      />
      <TextInput
        placeholder="Enter Longitude"
        value={longitude}
        onChangeText={(text) => setLongitude(text)}
      />
      <Button
        title="Save"
        onPress={handleSave}
      />
      <Button
        title="Next"
        onPress={() => navigation.navigate('CalculateDistanceScreen2',{imageURL})}
        // disabled={!route.params.canNavigateToScreen2}
      />
    </View>
  );
};

export default CalculateDistanceScreen1;

