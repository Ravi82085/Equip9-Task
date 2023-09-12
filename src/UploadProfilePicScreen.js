import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {RNS3} from 'react-native-aws3';
import {launchImageLibrary} from 'react-native-image-picker';

const UploadProfilePicScreen = ({navigation}) => {
  const [filePath, setFilePath] = useState({});

  const chooseFile = () => {
    let options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath(response.assets[0]);
    });
  };

  const uploadFile = () => {
    if (Object.keys(filePath).length == 0) {
      alert('Please select image first');
      return;
    }
    RNS3.put(
      {
        uri: filePath.uri,
        name: filePath.fileName,
        type: filePath.type,
      },
      {
        keyPrefix: 'RaviUploads/',
        bucket: 'equip9-testing',
        region: 'ap-south-1',
        accessKey: 'AKIA3KZVK3RM6V72UAHV',
        secretKey: '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',
        successActionStatus: 201,
      },
    ).then(response => {
      if (response.status !== 201) alert('Access Denied From S3 Bucket');
      else alert('Image Uploaded On S3 Bucket');
      console.log('##################################', response);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}> upload profile Picture</Text>
      <View style={styles.container}>
        {filePath.uri ? (
          <>
            <Image source={{uri: filePath.uri}} style={styles.imageStyle} />
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyleGreen}
              onPress={uploadFile}>
              <Text style={styles.textStyleWhite}>Uplaod Image</Text>
            </TouchableOpacity>
          </>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={chooseFile}>
          <Text style={styles.textStyleWhite}>Choose Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStylenext}
          disabled={!filePath}
          onPress={() =>
            navigation.navigate('CalculateDistanceScreen1', {filePath})
          }>
          <Text style={styles.textStyleWhite}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UploadProfilePicScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    // paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  textStyleGreen: {
    padding: 10,
    color: 'green',
  },
  textStyleWhite: {
    padding: 10,
    color: 'white',
    textAlign: 'center',
  },
  buttonStyle: {
    alignSelf: 'center',
    backgroundColor: 'orange',
    width: '50%',
  },
  buttonStylenext: {
    alignSelf: 'center',
    backgroundColor: 'gray',
    width: '25%',
    marginVertical: 5,
    borderRadius: 40,
  },
  buttonStyleGreen: {
    alignSelf: 'center',
    backgroundColor: 'green',
    marginVertical: 10,
    width: '50%',
  },
  imageStyle: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
    margin: 5,
    alignSelf: 'center',
  },
});
