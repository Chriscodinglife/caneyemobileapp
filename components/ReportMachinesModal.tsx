import { Location } from './Location';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native';

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

        return machines.map((_, index) => (
        <View key={index}>
            <Text>{capitalizeFirstLetter(machineType)} Machine {index + 1}</Text>
            <Button title="Thumbs Up" onPress={() => handleThumbsUp(machineType, index)} />
            <Button title="Needs Repair" onPress={() => handleNeedsRepair(machineType, index)} />
        </View>
        ));
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
                <View>
                    {step === 1 || step === 2 || step === 3 ? (
                        <>
                            {renderMachines(step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle')}
                        </>
                    ) : null}
                </View>
                <View>
                    {step === 1 || step === 2 || step === 3 ? (
                        <>
                            <View style={styles.addButtonsBox}>
                                <Button title="➖" onPress={() => decrementMachineCount(step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle')} />
                                    <Text>{machineData[step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle'].count}</Text>
                                <Button title="➕" onPress={() => incrementMachineCount(step === 1 ? 'glass' : step === 2 ? 'can' : 'bottle')} />
                            </View>
                        </>
                    ) : null}
                    {step === 1 || step === 2 ? (
                        <>
                            <View style={styles.nextSubmitButton}>
                                <Button title="Next" onPress={handleNext} />
                            </View>
                        </>
                    ) : (
                        <>
                            <Button title="Submit" onPress={() => handleClose()} />
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
        paddingTop: 10
    },
    addButtonsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        alignContent: 'flex-end',
        paddingVertical: 30
    },
    nextSubmitButton: {
        backgroundColor: 'blue',
        color: 'white',
        padding: 10
    }
})

export default ReportMachinesModal;
