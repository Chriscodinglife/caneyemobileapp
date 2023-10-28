import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Button  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons'; 


interface CameraModalProps {
    setPicture: Dispatch<SetStateAction<string|null>>;
    handleNext: () => void;
    isCameraModalVisible: boolean;
    setCameraModalVisible: Dispatch<SetStateAction<boolean>>;
}

const CameraModal: React.FC<CameraModalProps> = (props: CameraModalProps) => {
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [type, setType] = useState(CameraType.back);
    const [isPreviewing, setPreviewing] = useState(false);
    const cameraRef = useRef<Camera | null>(null);
    const [capturedPicture, setCapturedPicture] = useState<string | null>(null);
    const [isConfirmed, setConfirmed] = useState(false);
    const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
    
    const takePicture = async () => {
        if (cameraRef.current) {
          const { uri } = await cameraRef.current.takePictureAsync();
          setPreviewing(true);
          setCapturedPicture(uri);
        }
      };

      const selectPicture = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          setSelectedPicture(result.assets[0].uri);
          setPreviewing(true);
        }
      };
    
      const confirmPicture = () => {
        if (capturedPicture || selectedPicture) {
          const pictureToSet = capturedPicture || selectedPicture;
          props.setPicture(pictureToSet);
          setConfirmed(true);
        }
      };
    
      const retakePicture = () => {
        setPreviewing(false);
        setConfirmed(false);
        setCapturedPicture(null);
        setSelectedPicture(null);
      };
    
      useEffect(() => {
        // When the user confirms the picture, close the modal and proceed to the next step
        if (isConfirmed) {
          props.handleNext();
          props.setCameraModalVisible(false);
        }
      }, [isConfirmed]);

      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={props.isCameraModalVisible}
          onRequestClose={() => props.setCameraModalVisible(false)}>
          <View style={styles.mainView}>
            {permission?.granted === false ? (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant permission" />
              </View>
            ) : permission?.granted ? (
              <View style={styles.cameraContainer}>
                {isPreviewing ? (
                  <Image style={styles.previewImage} source={{ uri: capturedPicture || selectedPicture! }} />
                ) : (
                  <Camera style={styles.camera} type={type} ref={(ref) => (cameraRef.current = ref)} />
                )}
                {!isPreviewing && !isConfirmed && (
                  <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <Entypo name="circle" size={80} color="white" />
                  </TouchableOpacity>
                )}
                {!isPreviewing && !isConfirmed && (
                  <TouchableOpacity style={styles.selectButton} onPress={selectPicture}>
                    <Text style={styles.captureButtonText}>Select</Text>
                  </TouchableOpacity>
                )}
                {isPreviewing && !isConfirmed && (
                  <>
                  <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
                    <Text style={styles.captureButtonText}>Retake Picture</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.confirmButton} onPress={confirmPicture}>
                    <Text style={styles.captureButtonText}>Confirm</Text>
                  </TouchableOpacity>
                  </>
                )}
              </View>
            ) : null}
          </View>
        </Modal>
      );
    };
    
    const styles = StyleSheet.create({
      mainView: {
        flex: 1,
        justifyContent: 'center',
      },
      cameraContainer: {
        flex: 1,
      },
      camera: {
        flex: 1,
      },
      previewImage: {
        flex: 1,
      },
      captureButton: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 20,
        padding: 10,
      },
      selectButton: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
      },
      confirmButton: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
      },
      retakeButton: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
      },
      captureButtonText: {
        fontSize: 18,
        color: 'black',
      },
    });
    
    export default CameraModal;