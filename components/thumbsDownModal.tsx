import * as Crypto from 'expo-crypto';
import { Platform } from "react-native";
import { storage } from "../firebaseConfig";
import { Location, Review} from "./Location";
import * as ImagePicker from "expo-image-picker";
import { machineDB, auth } from '../firebaseConfig';
import { useAppContext } from './AppContextProvider';
import { ref as refdb, child, update, get } from 'firebase/database';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { View, Text, Modal, StyleSheet, TextInput, Button, Image, LogBox, ActivityIndicator, Share, StatusBar } from 'react-native';


interface ThumbsDownModalProps {
  location: Location;
  thumbsDownModalVisible: boolean;
  setCurrentLocation: Dispatch<SetStateAction<Location>>;
  setThumbsdownModalVisible: Dispatch<SetStateAction<boolean>>;
}

const ThumbsDownModal: React.FC<ThumbsDownModalProps> = (props: ThumbsDownModalProps) => {
  const dbRef = refdb(machineDB);
  const { user, updateUser } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);


  const componentDidMount = async () => {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  }

  const handleCloseThumbsDown = () => {
    props.setThumbsdownModalVisible(false);
    setImageUri(null);

  };


  const pickImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    handleImagePicked(pickerResult);
  };

  const takePhoto = async () => {
    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4,3],
    });

    handleImagePicked(pickerResult);
  };

  const handleImagePicked = async (pickerResult: ImagePicker.ImagePickerResult) => {
    try {
      setIsUploading(true);

      if (!pickerResult.canceled) {
        const uploadURL = await uploadImageAsync(pickerResult.assets[0].uri);
        
        setImageUri(uploadURL);
      };
    } catch (error) {
      console.log(error);
      alert("Upload failed, sorry =(");
    } finally {
      setIsUploading(false);
    };
  };

  const uploadImageAsync = async (uri: any) => {

      // https://github.com/expo/expo/issues/2402#issuecomment-443726662
      const blob: Blob | Uint8Array | ArrayBuffer = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const fileRef = ref(storage, String(Crypto.randomUUID()));
      const result = await uploadBytes(fileRef, blob);

      return await getDownloadURL(fileRef);
  };

  const submitPhoto = () => {
    const currentDate = new Date();

    const newReview: Review = {
      'user': user?.email as string,
      'date': currentDate.toLocaleDateString(),
      'message': reviewMessage,
      'imageUri': imageUri
    }

    const addReviewToLocation = (location: Location | null | undefined) => {
      const locationRef = child(dbRef, `machines/${location?.placeID}`);

      get(locationRef).then((snapshot) => {
        if (snapshot.exists()) {
          const currentLocationData = snapshot.val();
          console.log(currentLocationData)

          if (!currentLocationData.reviews) {
            currentLocationData.reviews = [];
          }

          currentLocationData.reviews.push(newReview);

          // Update the location locally and in the database
          props.setCurrentLocation(currentLocationData)
          update(locationRef, currentLocationData)
          .then(() => {
          })
          .catch((error) => {
            console.error("Error adding review");
            alert("There was an error adding the review:" + error.message)
          });
        };

      });
      
    };

    // Run the function
    addReviewToLocation(props.location);
    props.setThumbsdownModalVisible(false);
    setImageUri(null);

  };


  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={props.thumbsDownModalVisible}
      onRequestClose={() => handleCloseThumbsDown()}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>What happened at {props.location.name}?</Text>
        <Text>Tell us what you saw</Text>
        <TextInput style={styles.input} onChangeText={setReviewMessage} value={reviewMessage} />
        <Text>Please also take or send us a picture</Text>
        <Button onPress={pickImage} title="Pick an image from camera roll" />
        <Button onPress={takePhoto} title="Take a photo" />
        {imageUri && (
          <View>
            <Text style={styles.result}>
              <Image source={{ uri: imageUri }} style={{ width: 250, height: 250 }} />
            </Text>
          </View>
        )}
        <Button title="Submit Report" onPress={submitPhoto} />
        <Button title='Close' onPress={handleCloseThumbsDown} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    paddingBottom: 40,
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 1,
    padding: 5,
    backgroundColor: '#fff',
  },
  percentage: {
    marginBottom: 10,
  },
  result: {
    paddingTop: 5,
  },
});

export default ThumbsDownModal;
