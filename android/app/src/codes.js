// // Import React
// import React, { useState } from 'react';
// // Import required components
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from 'react-native';
// import { RNS3 } from 'react-native-aws3';
// import { launchImageLibrary } from 'react-native-image-picker';

// const App = () => {
//   const [filePath, setFilePath] = useState({});
//   const [uploadStatus, setUploadStatus] = useState(null);

//   const chooseFile = () => {
//     let options = {
//       mediaType: 'photo',
//     };
//     launchImageLibrary(options, (response) => {
//       console.log('Response = ', response);
//       setUploadStatus(null);
//       if (response.didCancel) {
//         // User cancelled image picker
//         Alert.alert('Cancelled', 'User cancelled image picker');
//       } else if (response.errorCode === 'camera_unavailable') {
//         Alert.alert('Error', 'Camera not available on device');
//       } else if (response.errorCode === 'permission') {
//         Alert.alert('Error', 'Permission not satisfied');
//       } else if (response.errorCode === 'others') {
//         Alert.alert('Error', response.errorMessage);
//       } else {
//         setFilePath(response);
//       }
//     });
//   };

//   const uploadFile = () => {
//     if (Object.keys(filePath).length === 0) {
//       Alert.alert('Error', 'Please select an image first');
//       return;
//     }

//     const awsConfig = {
//       bucket: 'equip9-testing', // Your AWS S3 bucket name
//       region: 'ap-south-1', // Your AWS region
//       accessKey: 'AKIA3KZVK3RM6V72UAHV', // Your AWS access key
//       secretKey: 'OrMJ2oKSdPdnl+tM53XJcse2fY4VvZoJ3xBJPy4j', // Your AWS secret key
//     };

//     const file = {
//       uri: filePath.uri,
//       name: filePath.fileName,
//       type: filePath.type,
//     };

//     RNS3.put(file, awsConfig)
//       .progress((progress) => {
//         console.log(
//           `Uploading: ${progress.loaded / progress.total} (${progress.percent}%)`
//         );
//         setUploadStatus(`Uploading: ${Math.round(progress.percent)}%`);
//       })
//       .then((response) => {
//         if (response.status === 201) {
//           console.log('Upload successful');
//           const { bucket } = response.body.postResponse;
//           setUploadStatus(`Uploaded Successfully to Bucket: ${bucket}`);
//         } else {
//           console.log('Failed to upload image to S3');
//           Alert.alert('Error', 'Failed to upload image to S3');
//         }
//       });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.titleText}>
//         How to Upload any File or Image to AWS S3 Bucket {'\n'}from React Native
//         App
//       </Text>
//       <View style={styles.container}>
//         {filePath.uri ? (
//           <>
//             <Image source={{ uri: filePath.uri }} style={styles.imageStyle} />
//             <Text style={styles.textStyle}>{filePath.uri}</Text>
//             <TouchableOpacity
//               activeOpacity={0.5}
//               style={styles.buttonStyleGreen}
//               onPress={uploadFile}>
//               <Text style={styles.textStyleWhite}>Upload Image</Text>
//             </TouchableOpacity>
//           </>
//         ) : null}
//         {uploadStatus ? (
//           <Text style={styles.textStyleGreen}>{uploadStatus}</Text>
//         ) : null}
//         <TouchableOpacity
//           activeOpacity={0.5}
//           style={styles.buttonStyle}
//           onPress={chooseFile}>
//           <Text style={styles.textStyleWhite}>Choose Image</Text>
//         </TouchableOpacity>
//       </View>
//       <Text style={{ textAlign: 'center' }}>www.aboutreact.com</Text>
//     </SafeAreaView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
//   textStyle: {
//     padding: 10,
//     color: 'black',
//     textAlign: 'center',
//   },
//   textStyleGreen: {
//     padding: 10,
//     color: 'green',
//   },
//   textStyleWhite: {
//     padding: 10,
//     color: 'red',
//   },
//   buttonStyle: {
//     alignItems: 'center',
//     backgroundColor: 'orange',
//     marginVertical: 10,
//     width: '100%',
//   },
//   buttonStyleGreen: {
//     alignItems: 'center',
//     backgroundColor: 'green',
//     marginVertical: 10,
//     width: '100%',
//   },
//   imageStyle: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//     margin: 5,
//   },
// });
// ===============================================================================================
import React from 'react';
import { View, Button, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId:'AKIA3KZVK3RM6V72UAHV',
  secretAccessKey: 'OrMJ2oKSdPdnl+tM53XJcse2fY4VvZoJ3xBJPy4j',
  region: 'ap-south-1', // Make sure this matches your desired region
});

const s3 = new AWS.S3();

const uploadFileToS3 = (bucketName, fileName, fileData) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileData,
  };
  return s3.upload(params).promise();
};

const App = () => {
  const pickFiles = async () => {
    try {
      const fileDetails = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        copyTo: 'cachesDirectory',
      });

      const bucketName = 'equip9-testing'; // Replace with your bucket name

      for (const fileDetail of fileDetails) {
        const filePath = fileDetail.uri.replace('file://',' '); // Remove the extra space
        const fileName = fileDetail.name;

        try {
          const fileData = await fetch(filePath).then(response => response.blob(),);

          await uploadFileToS3(bucketName, fileName, fileData);
          console.log('File uploaded:', fileName);
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          Alert.alert('Error', 'File upload failed');
        }
      }
    } catch (error) {
      console.log('+++++++++++hello+++++++',error);
      Alert.alert(
        'Error',
        DocumentPicker.isCancel(error) ? 'File selection canceled' : 'Unknown Error:' + JSON.stringify(error),
      );
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pick and Upload Files" onPress={pickFiles} />
    </View>
  );
};

export default App;

// *************************************************************************************************

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import UploadProfilePicScreen from './src/UploadProfilePicScreen';
// import CalculateDistanceScreen1 from './src/CalculateDistanceScreen1';
// import CalculateDistanceScreen2 from './src/CalculateDistanceScreen2';

// const Stack = createNativeStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="UploadProfilePic">
//         <Stack.Screen name="UploadProfilePic" component={UploadProfilePicScreen} />
//         <Stack.Screen name="CalculateDistanceScreen1" component={CalculateDistanceScreen1} />
//         <Stack.Screen name="CalculateDistanceScreen2" component={CalculateDistanceScreen2} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;



// import React, {useState} from 'react';

// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import {RNS3} from 'react-native-aws3';

// import {launchImageLibrary} from 'react-native-image-picker';

// const App = () => {
//   const [filePath, setFilePath] = useState({});
//   const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

//   const chooseFile = () => {
//     let options = {
//       mediaType: 'photo',
//     };
//     launchImageLibrary(options, response => {
//       console.log('Response = ', response);
//       setUploadSuccessMessage('');
//       if (response.didCancel) {
//         alert('User cancelled camera picker');
//         return;
//       } else if (response.errorCode == 'camera_unavailable') {
//         alert('Camera not available on device');
//         return;
//       } else if (response.errorCode == 'permission') {
//         alert('Permission not satisfied');
//         return;
//       } else if (response.errorCode == 'others') {
//         alert(response.errorMessage);
//         return;
//       }
//       setFilePath(response.assets[0]);
//     });
//   };

//   const uploadFile = () => {
//     if (Object.keys(filePath).length == 0) {
//       alert('Please select image first');
//       return;
//     }
//     RNS3.put(
//       {
    
//         uri: filePath.uri,
//         name: filePath.fileName,
//         type: filePath.type,
//       },
//       {
//         keyPrefix: 'RaviUploads/',
//         bucket: 'equip9-testing',
//         region: 'ap-south-1',
//         accessKey: 'AKIA3KZVK3RM6V72UAHV',
//         secretKey: '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',
//         successActionStatus: 201,
//       },
//     )
//       .progress(progress =>
//         setUploadSuccessMessage(
//           `Uploading: ${progress.loaded / progress.total} (${
//             progress.percent
//           }%)`,
//         ),
//       )
//       .then(response => {
//         if (response.status !== 201) alert('Failed to upload image to S3');
//         console.log('##################################', response);
//         setFilePath('');
//         let {bucket, etag, key, location} = response.body.postResponse;
//         setUploadSuccessMessage(
//           `Uploaded Successfully: 
//           \n1. bucket => ${bucket}
//           \n2. etag => ${etag}
//           \n3. key => ${key}
//           \n4. location => ${location}`,
//         );
       
//       });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.titleText}>profile Picture</Text>
//       <View style={styles.container}>
//         {filePath.uri ? (
//           <>
//             <Image source={{uri: filePath.uri}} style={styles.imageStyle} />
//             <Text style={styles.textStyle}>{filePath.uri}</Text>
//             <TouchableOpacity
//               activeOpacity={0.5}
//               style={styles.buttonStyleGreen}
//               onPress={uploadFile}>
//               <Text style={styles.textStyleWhite}>Uplaod Image</Text>
//             </TouchableOpacity>
//           </>
//         ) : null}
//         {uploadSuccessMessage ? (
//           <Text style={styles.textStyleGreen}>{uploadSuccessMessage}</Text>
//         ) : null}
//         <TouchableOpacity
//           activeOpacity={0.5}
//           style={styles.buttonStyle}
//           onPress={chooseFile}>
//           <Text style={styles.textStyleWhite}>Choose Image</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
//   textStyle: {
//     padding: 10,
//     color: 'black',
//     textAlign: 'center',
//   },
//   textStyleGreen: {
//     padding: 10,
//     color: 'green',
//   },
//   textStyleWhite: {
//     padding: 10,
//     color: 'white',
//   },
//   buttonStyle: {
//     alignItems: 'center',
//     backgroundColor: 'orange',
//     marginVertical: 10,
//     width: '100%',
//   },
//   buttonStyleGreen: {
//     alignItems: 'center',
//     backgroundColor: 'green',
//     marginVertical: 10,
//     width: '100%',
//   },
//   imageStyle: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//     margin: 5,
//   },
// });

