
import { Camera, CameraType } from 'expo-camera';
import { machineDB, auth } from '../firebaseConfig';
import CameraModal from './CameraModal';
import { ref, child, update, get, set } from 'firebase/database';
import React, { useState, Dispatch, SetStateAction, useRef, useEffect, useContext } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, ImageBackground, Dimensions, StatusBar, ActivityIndicator} from 'react-native';
import { Location, MachineIndex, MachineType, MachineStatus, MachineData, Review } from './Location';
import ReportBoxMachineData from './reportBoxMachineData';
import { storage } from '../firebaseConfig';
import { getDownloadURL, ref as storageRef, uploadBytes, uploadString, uploadBytesResumable } from 'firebase/storage';
import { AuthContext } from './AuthContext';




// Set the types to be expected into this modal as a props
interface ReportMachinesModalProps {
    placeID: string | null;
    location: Location; 
    reportMachinesModalVisible: boolean;
    updateLocationAtThisPlaceID: (location: Location, placeID: string | null) => void;
    setReportMachinesModalVisible: Dispatch<SetStateAction<boolean>>;
    setSelectedLocation: Dispatch<SetStateAction<Location>>;
}

const ReportMachinesModal: React.FC<ReportMachinesModalProps> = (props: ReportMachinesModalProps) => {
  
    const dbRef = ref(machineDB);
    // Set a counter so that we can keep track of which step we are on
    const [step, setStep] = useState(1);
    const [picture, setPicture] = useState<string | null>(null);
    const [isCameraModalVisible, setCameraModalVisible] = useState<boolean>(false);
    const [machineStepType, setMachineStepType] = useState<string>('glass');
    const [reportBoxVisible, setReportBoxVisible] = useState<boolean>(true);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // Track the machine data for this report
    const [machineData, setMachineData] = useState<MachineData>({
        glass: { count: 0, status: [] },
        can: { count: 0, status: [] },
        bottle: { count: 0, status: [] },
    });

    const { currentUser } = useContext(AuthContext);

    // Close down this modal when we need to
    const handleClose = () => {
        setStep(1);
        setPicture(null);
        setMachineStepType('glass');
        setCameraModalVisible(false);
        setReportBoxVisible(true);
        setMachineData({
            glass: { count: 0, status: [] },
            can: { count: 0, status: [] },
            bottle: { count: 0, status: [] },
        });
        props.setReportMachinesModalVisible(false);

    };

    // useEffect(() => {
    //     if (picture) {
    //         console.log(picture);
    //     }
    // }, [picture]);


    useEffect(() => {
        // When the user confirms the picture, close the modal and proceed to the next step

        if (step === 4) {
          setCameraModalVisible(true);
        }
      }, [step]);


    // track when step changes to change the value of the MachineStep Type
    useEffect(() => {
        if (step == 1) {
            setMachineStepType('glass');
        } else if (step == 2) {
            setMachineStepType('can')
        } else if (step == 3) {
            setMachineStepType('bottle')
        };
    }, [step]);


    // Increase the step by 1 and then reset the machineData if needed
    const handleNext = () => {

        const count = (machineData as MachineData)[machineStepType as MachineType].count;

        let length = 0
        if ((machineData as MachineData)[machineStepType as MachineType].status) {
            length = (machineData as MachineData)[machineStepType as MachineType].status?.length as number;
        };
        
        if (count != length) {
            // Check if a selection has been made, show an alert if not
            Alert.alert('Selection Required', 'After adding a machine, make sure to select either 👍 or 🛠️');
            return;
        };

        setStep(step + 1);
        if (step === 4) {
            setCameraModalVisible(true);
        }; 
    };


    const handleSubmit = async () => {
        // Submit the data up to database

        setIsUploading(true);

        const currentDate = new Date();

        let newReview: Review = {
            user: "",
            date: "",
        }
        
        if (picture) {
            // Get the Image URL from firebase
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", picture as string, true);
                xhr.send(null);
            });

            const imageRef = storageRef(storage, 'reportImages/' + currentDate.toString() + props.placeID);
            const metadata = {contentType: 'image/jpeg'};
            const uploadTask = await uploadBytesResumable(imageRef, blob as Blob, metadata);
            const imageUri = await getDownloadURL(imageRef);

            newReview = {
                'user': currentUser?.email as string,
                'date': currentDate.toLocaleDateString(),
                'machineData': machineData,
                'imageUri': imageUri
            };
        } else {
            newReview = {
                'user': currentUser?.email as string,
                'date': currentDate.toLocaleDateString(),
                'machineData': machineData,
                "imageUri": null
            };
        };

        const addReviewToLocation = async (location: Location | null | undefined) => {

            if (!location) {
                console.error("Location is null or undefined");
                return;
            }

            const locationRef = child(dbRef, `machines/${location?.placeID}`);

            await get(locationRef).then((snapshot) => {

                if (snapshot.exists()) {
                    const currentLocationData = snapshot.val();

                    if (!currentLocationData.reviews) {
                        currentLocationData.reviews = [];
                    }

                    // Add a new entry to the reviews array for the location
                    currentLocationData.reviews.push(newReview);
                    // Update the location locally and in the database
                    props.updateLocationAtThisPlaceID(currentLocationData, props.placeID);

                
                    update(locationRef, currentLocationData)
                    .then(() => {
                        console.log("New Review Added");
                        // Update the current location modal
                        props.setSelectedLocation(currentLocationData);
                        
                    })
                    .catch((error) => {
                        console.error("Error adding review");
                        alert("There was an error adding the review:" + error.message)
                    });
                } else {

                    const currentLocationData = location;

                    if (!currentLocationData?.reviews) {
                        currentLocationData.reviews = [];
                    }

                    // Add a new entry to the reviews array for the location
                    currentLocationData.reviews.push(newReview);

                    // Update the location locally and in the database
                    props.updateLocationAtThisPlaceID(currentLocationData, props.placeID);

                    
                    set(locationRef, currentLocationData)
                    .then(() => {
                        console.log("New Review Added with New Location");
                        // Update the current location modal
                        props.setSelectedLocation(currentLocationData);

                        
                    })
                    .catch((error) => {
                        console.error("Error adding review");
                        alert("There was an error adding the review with the location:" + error.message)
                    });
                };

            });
            
        };

        // Run the function
        addReviewToLocation(props.location);
        setStep(1);
        setPicture(null);
        setMachineStepType('glass');
        setCameraModalVisible(false);
        setReportBoxVisible(true);
        setMachineData({
            glass: { count: 0, status: [] },
            can: { count: 0, status: [] },
            bottle: { count: 0, status: [] },
        });
        setIsUploading(false);
        props.setReportMachinesModalVisible(false);

        
        
    };


    // Set the status for the current given machine
    const handleThumbsUp = (machineType: MachineType, machineIndex: MachineIndex) => {
        // Get the current machine data
        const currentMachineData = { ...machineData[machineType] };

        if (currentMachineData.status) { 
            currentMachineData.status[machineIndex] = 'thumbsUp';
        }

        setMachineData({
        ...machineData,
        [machineType]: currentMachineData,
        });

    };

    // Set the status for a current given machine that needs repair
    const handleNeedsRepair = (machineType: MachineType, machineIndex: MachineIndex) => {
        // Get the current machine data
        const currentMachineData = { ...machineData[machineType] };

        if (currentMachineData.status) {
            currentMachineData.status[machineIndex] = 'repairNeeded';
        }

        setMachineData({
        ...machineData,
        [machineType]: currentMachineData,
        });

    };


    const incrementMachineCount = (machineType: MachineType) => {
        // Increase the machine count and add 1
        const currentMachineData = { ...machineData[machineType] };
        currentMachineData.count += 1;

        setMachineData({
        ...machineData,
        [machineType]: currentMachineData,
        });
    };


    const decrementMachineCount = (machineType: MachineType) => {
        // Decrease the machine count and remove the last one
        const currentMachineData = { ...machineData[machineType] };
        currentMachineData.count = Math.max(0, currentMachineData.count - 1);
        
        if (currentMachineData.status) {
            if (currentMachineData.status.length > 0) {
                currentMachineData.status.pop();
            };
        };
        
        setMachineData({
        ...machineData,
        [machineType]: currentMachineData,
        });
    };


    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };


    const renderMachines = (machineType: MachineType) => {
        const currentMachineData = { ...machineData[machineType] };
        const machines = Array(currentMachineData.count).fill(0);

        return (
            <View style={styles.scrollMachines}>
              <ScrollView>
                { machines?.map( (machine, index) => { 

                    let status: MachineStatus[] = [];

                    if (currentMachineData.status) {
                        status = currentMachineData.status;
                    };

                  return ( 
                    <View style={styles.machineRow} key={index}>
                        <Text style={styles.machineRowName}>{capitalizeFirstLetter(machineType)} Machine {index + 1} </Text>
                        <TouchableOpacity style={status[index] === 'thumbsUp' ? styles.greenButton : styles.machineRowButtonFlex} onPress={() => handleThumbsUp(machineType, index)}> 
                            <Text style={styles.machineRowThumbs}>👍</Text>
                            <Text>{`Looks\nGood!`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={status[index] === 'repairNeeded' ? styles.redButton : styles.machineRowButtonFlex} onPress={() => handleNeedsRepair(machineType, index)}>
                            <Text style={styles.machineRowFix}>🛠️</Text>
                            <Text>{`Needs\nFixing!`}</Text>
                        </TouchableOpacity>
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          )
    };


    return (
        <Modal
        animationType="slide"
        transparent={false}
        visible={props.reportMachinesModalVisible}
        onRequestClose={() => handleClose()}
        statusBarTranslucent
        >

            {step < 5 ? (

                <View style={styles.mainView}>

                {step === 1 || step === 2 || step === 3 ? (
                    <View style={styles.headerBox}>
                        <View> 
                        <TouchableOpacity onPress={() => handleClose()}>
                            <Text style={styles.closeButtonText}>{`<-`}</Text>
                        </TouchableOpacity>
                            <Text style={styles.mainHeader}>
                                {step === 1 ? 'Glass' : step === 2 ? 'Can' : 'Bottle'} Recycling Machines
                            </Text>
                            <Text style={styles.subMainHeader}>
                                How many{' '}{step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle'} recycling machines are here at {props.location.name}?
                            </Text>
                        </View>
                    </View>
                ) : step === 4 ? (
                    <CameraModal
                        setPicture={setPicture}
                        handleNext={handleNext}
                        isCameraModalVisible={isCameraModalVisible} 
                        setCameraModalVisible={setCameraModalVisible}/>

                ) : null}


                {step === 1 || step === 2 || step === 3 ? (
                    <>
                        {renderMachines(step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle')}
                    </>
                ) : null}

                {step === 1 || step === 2 || step === 3 ? (
                        <View style={styles.addButtonsBox}>
                            <View style={styles.minusButton}>
                                <Button title="➖" onPress={() => decrementMachineCount(step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle')} />
                            </View>
                                <Text style={styles.machineCounter}>{machineData[step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle'].count}</Text>
                            <View style={styles.addButton}>
                                <Button title="➕" onPress={() => incrementMachineCount(step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle')} />
                            </View>    
                        </View>
                ) : null}

                {step === 1 || step === 2 || step === 3 ? (
                    
                    <>
                        <TouchableOpacity style={styles.nextSubmitButton} onPress={handleNext}>
                            <Text style={styles.nextSubmitText}>Next</Text>
                        </TouchableOpacity>
                    </>

                ) : null}

                </View>

            ) : null }
            
            {step === 5 ? (
                <View style={styles.submitReportCheckView}>
                    
                    <ImageBackground style={styles.previewImage} source={{ uri: picture as string}}>
                    
                        <TouchableOpacity style={styles.closeButtonReportStep} onPress={() => handleClose()}>
                            <Text style={styles.closeReportButtonText}>{`<-`}</Text>
                        </TouchableOpacity>

                        {reportBoxVisible ? (
                            <View style={styles.reportBoxContainer}>
                                <ReportBoxMachineData
                                    machineData={machineData} />
                            </View>
                        ) : null }
                        
                        <View style={styles.reportActions}>

                            <View style={styles.reportConfirmContainer}>
                                <Text style={styles.confirmationText}>Ready to submit Report?</Text>
                                <TouchableOpacity style={styles.showReportBoxButton} onPress={() => setReportBoxVisible(!reportBoxVisible)}>
                                        <Text style={styles.showReportBoxText}>{reportBoxVisible ? ("Hide"): ("Show")}</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {!isUploading ? (
                            <TouchableOpacity style={styles.nextSubmitButton} onPress={handleSubmit}>
                                <Text style={styles.nextSubmitText}>Submit Report</Text>
                            </TouchableOpacity>
                            ) : (
                            <ActivityIndicator size={"large"} color={'white'}/>
                            )}

                        </View>

                    </ImageBackground>

                </View>
            ): null}
            
        </Modal>
    );
};


const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 30
    },
    submitReportCheckView: {
        flex: 1,
    },    
    previewImage: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 30,
    },
    closeButtonReportStep: {
        paddingVertical: 30,
    },
    closeButtonText: {
        color: 'grey',
        fontWeight: "bold",
        fontSize: 20,
        shadowColor: 'white',
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: { height: 0, width: 0},
        paddingVertical: 30
    },
    closeReportButtonText: {
        color: 'white',
        fontWeight: "bold",
        fontSize: 20,
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: { height: 3, width: 0},
        paddingVertical: 30
    },
    headerBox: {
        alignItems: 'flex-start',
        paddingTop: 20,
    },
    mainHeader: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    subMainHeader: {
        fontSize: 18,
        fontWeight: '500',
        paddingVertical: 20,
    },

    scrollMachines: {
        flex: 1,
        backgroundColor: "#faf0e64D",
        padding: 20,
    },
    machineRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#D3D3D34D',
        borderRadius: 10,
        margin: 5,
        padding: 25,
        gap: 30
    },
    machineRowButtonFlex: {
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'center'
    },
    greenButton: {
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#5BEB4E66',
        borderRadius: 10,
        padding: 10
    },
    redButton: {
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#EA312A66',
        borderRadius: 10,
        padding: 10
    },
    machineRowName: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    machineRowThumbs: {
        fontSize: 28,
    },
    machineRowFix: {
        fontSize: 28
    },
    addButtonsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        alignContent: 'flex-end',
        paddingVertical: 30
    },
    minusButton: {
        backgroundColor: '#D3D3D359',
        padding: 10,
        borderRadius: 20
    },
    machineCounter: {
        fontWeight: 'bold',
        fontSize: 30,
    },
    addButton: {
        backgroundColor: '#D3D3D359',
        padding: 10,
        borderRadius: 20
    },
    nextSubmitButton: {
        backgroundColor: '#102DEB',
        padding: 16,
        alignItems: 'center',
        borderRadius: 10
    },
    nextSubmitText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700'
    },
    reportBoxContainer: {
        flex: 4, 
        justifyContent: 'flex-end'
    },
    reportActions: {
    },
    reportConfirmContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 20
    },
    confirmationText: {
        color: 'white',
        fontWeight: "bold",
        fontSize: 20,
        textAlign: 'center',
        alignSelf: 'center',
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: { height: 3, width: 0},
    },
    showReportBoxButton: {
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 10,
    },
    showReportBoxText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    }
})

export default ReportMachinesModal;
