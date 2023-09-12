import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, Text, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {geolib} from 'geolib';

const CalculateDistanceScreen2 = ({navigation, route}) => {
  const [secondLatitude, setSecondLatitude] = useState('');
  const [secondLongitude, setSecondLongitude] = useState('');
  const [calculatedDistanceKM, setCalculatedDistanceKM] = useState(null);
  const [calculatedDistanceMiles, setCalculatedDistanceMiles] = useState(null);
  const imageURL = route.params?.imageURL || null;

  useEffect(() => {
    async function loadCoordinates() {
      const latitude = await AsyncStorage.getItem('latitude');
      const longitude = await AsyncStorage.getItem('longitude');
      setSecondLatitude(latitude);
      setSecondLongitude(longitude);
    }

    loadCoordinates();
  }, []);

  const calculateDistance = () => {
    if (secondLatitude && secondLongitude) {
      const distance = geolib.getDistance(
        {
          latitude: parseFloat(secondLatitude),
          longitude: parseFloat(secondLongitude),
        },
      
      );

      const distanceInKilometers = distance / 1000;
      setCalculatedDistanceKM(distanceInKilometers.toFixed(2) + ' KM');

      const distanceInMiles = distanceInKilometers * 0.621371;
      setCalculatedDistanceMiles(distanceInMiles.toFixed(2) + ' Miles');
    } else {
      setCalculatedDistanceKM('Invalid Coordinates');
      setCalculatedDistanceMiles('Invalid Coordinates');
    }
  };

  return (
    <View>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          padding: 5,
        }}>
        My Upload Picture
      </Text>
      {imageURL && (
        <Image
          source={{uri: imageURL}}
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            alignSelf: 'center',
          }}
        />
      )}
      <Text>
        {calculatedDistanceKM && `Distance in KM: ${calculatedDistanceKM}`}
      </Text>
      <Text>
        {calculatedDistanceMiles &&
          `Distance in Miles: ${calculatedDistanceMiles}`}
      </Text>
      <TextInput
        placeholder="Enter Second Latitude"
        value={secondLatitude}
        onChangeText={text => setSecondLatitude(text)}
      />
      <TextInput
        placeholder="Enter Second Longitude"
        value={secondLongitude}
        onChangeText={text => setSecondLongitude(text)}
      />
      <Button title="Calculate" onPress={calculateDistance} />
      <Button
        title="Previous"
        onPress={() => navigation.navigate('CalculateDistanceScreen1')}
      />
    </View>
  );
};

export default CalculateDistanceScreen2;
