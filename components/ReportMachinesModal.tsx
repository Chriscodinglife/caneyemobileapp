
import { machineDB, auth } from '../firebaseConfig';
import { useAppContext } from './AppContextProvider';
import { ref, child, update, get } from 'firebase/database';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Location, MachineIndex, MachineType, MachineStatus, MachineData, Review } from './Location';


// Set the types to be expected into this modal as a props
interface ReportMachinesModalProps {
  location: Location; 
  reportMachinesModalVisible: boolean;
  setCurrentLocation: Dispatch<SetStateAction<Location>>
  setReportMachinesModalVisible: Dispatch<SetStateAction<boolean>>;
}
const ReportMachinesModal: React.FC<ReportMachinesModalProps> = (props: ReportMachinesModalProps) => {
  
    const dbRef = ref(machineDB);
    // Set a counter so that we can keep track of which step we are on
    const [step, setStep] = useState(1);

    // Track the machine data for this report
    const [machineData, setMachineData] = useState<MachineData>({
        glass: { count: 0, status: [] },
        can: { count: 0, status: [] },
        bottle: { count: 0, status: [] },
    });

    const { user, updateUser } = useAppContext();
    const [currentLocation, setCurrentLocation] = useState(props.location);
    const [isSelectionMade, setIsSelectionMade] = useState(false);


    // Close down this modal when we need to
    const handleClose = () => {
        setStep(1);
        setMachineData({
            glass: { count: 0, status: [] },
            can: { count: 0, status: [] },
            bottle: { count: 0, status: [] },
        });
        props.setReportMachinesModalVisible(false);
    };


    // Increase the step by 1 and then reset the machineData if needed
    const handleNext = () => {
        if (step < 3) {
            if (!isSelectionMade) {
                // Check if a selection has been made, show an alert if not
                Alert.alert('Selection Required', 'After adding a machine, make sure to select either 👍 or 🛠️');
                return;
            }
            setStep(step + 1);
            setIsSelectionMade(false);
        } else {
        // Save the report data to your database or perform further processing
        // Reset the step and data for the next report
            if (!isSelectionMade) {
                // Check if a selection has been made, show an alert if not
                Alert.alert('Selection Required', 'After adding a machine, make sure to select either 👍 or 🛠️');
                return;
            }
            setStep(1);
            setIsSelectionMade(false);
            setMachineData({
                glass: { count: 0, status: [] },
                can: { count: 0, status: [] },
                bottle: { count: 0, status: [] },
            });
        };
    };

    const handleSubmit = () => {
        // Submit the data up to database
        console.log(machineData);

        if (!isSelectionMade) {
            // Check if a selection has been made, show an alert if not
            Alert.alert('Selection Required', 'After adding a machine, make sure to select either 👍 or 🛠️');
            return;
        }

        const currentDate = new Date();

        const newReview: Review = {
            'user': user?.email as string,
            'date': currentDate.toLocaleDateString(),
            'machineData': machineData
        };

        const addReviewToLocation = (location: Location | null | undefined) => {
        const locationRef = child(dbRef, `machines/${location?.placeID}`);

        get(locationRef).then((snapshot) => {

            if (snapshot.exists()) {
                const currentLocationData = snapshot.val();
                console.log(currentLocationData);

            if (!currentLocationData.reviews) {
                currentLocationData.reviews = [];
            }

                // Add a new entry to the reviews array for the location
                currentLocationData.reviews.push(newReview);

                currentLocationData.recentReview = newReview;

                // Update the location locally and in the database
                props.setCurrentLocation(currentLocationData);

                update(locationRef, currentLocationData)
                .then(() => {
                    console.log("New Review Added");
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
        handleClose();
    };


    // Set the status for the current given machine
    const handleThumbsUp = (machineType: MachineType, machineIndex: MachineIndex) => {
        // Get the current machine data
        const currentMachineData = { ...machineData[machineType] };

        currentMachineData.status[machineIndex] = 'thumbsUp';

        setMachineData({
        ...machineData,
        [machineType]: currentMachineData,
        });

        setIsSelectionMade(true);
    };

    // Set the status for a current given machine that needs repair
    const handleNeedsRepair = (machineType: MachineType, machineIndex: MachineIndex) => {
        // Get the current machine data
        const currentMachineData = { ...machineData[machineType] };


        currentMachineData.status[machineIndex] = 'repairNeeded';

        setMachineData({
        ...machineData,
        [machineType]: currentMachineData,
        });

        setIsSelectionMade(true);
    };


    const incrementMachineCount = (machineType: MachineType) => {
        const currentMachineData = { ...machineData[machineType] };
        currentMachineData.count += 1;

        setMachineData({
        ...machineData,
        [machineType]: currentMachineData,
        });
    };


    const decrementMachineCount = (machineType: MachineType) => {
        const currentMachineData = { ...machineData[machineType] };
        currentMachineData.count = Math.max(0, currentMachineData.count - 1);

        setMachineData({
        ...machineData,
        [machineType]: currentMachineData,
        });
    };


    const renderMachines = (machineType: MachineType) => {
        const currentMachineData = { ...machineData[machineType] };
        const machines = Array(currentMachineData.count).fill(0);

        return (
            <View style={styles.scrollMachines}>
              <ScrollView>
                { machines?.map( (machine, index) => { 
                    const status = currentMachineData.status[index];
                  return ( 
                    <View style={styles.machineRow} key={index}>
                        <Text style={styles.machineRowName}>{capitalizeFirstLetter(machineType)} Machine {index + 1} </Text>
                        <TouchableOpacity style={status === 'thumbsUp' ? styles.greenButton : styles.machineRowButtonFlex} onPress={() => handleThumbsUp(machineType, index)}> 
                            <Text style={styles.machineRowThumbs}>👍</Text>
                            <Text>{`Looks\nGood!`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={status === 'repairNeeded' ? styles.redButton : styles.machineRowButtonFlex} onPress={() => handleNeedsRepair(machineType, index)}>
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

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };


    return (
        <Modal
        animationType="slide"
        transparent={false}
        visible={props.reportMachinesModalVisible}
        onRequestClose={() => handleClose()}
        >
            <View style={styles.mainView}>
                <View style={styles.headerBox}>  
                    {step === 1 || step === 2 || step === 3 ? (
                        <>
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
                            
                        </>
                    ) : null}
                </View>
                {step === 1 || step === 2 || step === 3 ? (
                    <>
                        {renderMachines(step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle')}
                    </>
                ) : null}
                <View>
                    {step === 1 || step === 2 || step === 3 ? (
                        <>
                            <View style={styles.addButtonsBox}>
                                <View style={styles.minusButton}>
                                    <Button title="➖" onPress={() => decrementMachineCount(step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle')} />
                                </View>
                                    <Text style={styles.machineCounter}>{machineData[step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle'].count}</Text>
                                <View style={styles.addButton}>
                                    <Button title="➕" onPress={() => incrementMachineCount(step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle')} />
                                </View>    
                            </View>
                        </>
                    ) : null}
                    {step === 1 || step === 2 ? (
                        <>
                            <TouchableOpacity style={styles.nextSubmitButton} onPress={handleNext}>
                                <Text style={styles.nextSubmitText}>Next</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.nextSubmitButton} onPress={handleSubmit}>
                                <Text style={styles.nextSubmitText}>Submit</Text>
                             </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
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
        backgroundColor: '#2B5CFF',
        padding: 16,
        alignItems: 'center',
        borderRadius: 10
    },
    nextSubmitText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700'
    }
})

export default ReportMachinesModal;
