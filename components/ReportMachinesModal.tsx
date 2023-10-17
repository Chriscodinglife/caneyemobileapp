import { Location } from './Location';
import { View, Text, Modal, Button } from 'react-native';
import { useAppContext } from './AppContextProvider';
import React, { useState, Dispatch, SetStateAction } from 'react';

interface ReportMachinesModalProps {
    location: Location;
    reportMachinesModalVisible: boolean;
    setCurrentLocation: Dispatch<SetStateAction<Location>>;
    setReportMachinesModalVisible: Dispatch<SetStateAction<boolean>>;
}

const ReportMachinesModal: React.FC<ReportMachinesModalProps> = (props: ReportMachinesModalProps) => {


    const handleClose = () => {
        props.setReportMachinesModalVisible(false);
    };


    return (
        <Modal
            animationType='slide'
            transparent={false}
            visible={props.reportMachinesModalVisible}
            onRequestClose={() => handleClose()}
        >
            <View>
                <View style={{ marginTop: 300}}></View>
                <Text>Let's collect some data</Text>
                <Button title='Close' onPress={() => handleClose()}></Button>
            </View>
        </Modal>
    )
}

export default ReportMachinesModal