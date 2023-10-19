import { Location } from './Location';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// Set some types so we can track the status across different machines
type MachineIndex = number;
type MachineType = 'glass' | 'can' | 'bottle';
type MachineStatus = 'thumbsUp' | 'repairNeeded';

// Set the expected types for the machine types
type MachineData = {
    glass: { count: number; status: MachineStatus[] };
    can: { count: number; status: MachineStatus[] };
    bottle: { count: number; status: MachineStatus[] };
};


// Set the types to be expected into this modal as a props
interface ReportMachinesModalProps {
  location: Location; 
  reportMachinesModalVisible: boolean;
  setCurrentLocation: Dispatch<SetStateAction<Location>>
  setReportMachinesModalVisible: Dispatch<SetStateAction<boolean>>;
}
const ReportMachinesModal: React.FC<ReportMachinesModalProps> = (props: ReportMachinesModalProps) => {
  
    // Set a counter so that we can keep track of which step we are on
    const [step, setStep] = useState(1);

    // Track the machine data for this report
    const [machineData, setMachineData] = useState<MachineData>({
        glass: { count: 0, status: [] },
        can: { count: 0, status: [] },
        bottle: { count: 0, status: [] },
    });


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
        setStep(step + 1);
        } else {
        // Save the report data to your database or perform further processing
        // Reset the step and data for the next report
        setStep(1);
        setMachineData({
            glass: { count: 0, status: [] },
            can: { count: 0, status: [] },
            bottle: { count: 0, status: [] },
        });
        }
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
                        <TouchableOpacity style={status !== 'thumbsUp' ? styles.redButton : styles.machineRowButtonFlex} onPress={() => handleNeedsRepair(machineType, index)}>
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
                            <TouchableOpacity style={styles.nextSubmitButton} onPress={handleClose}>
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
