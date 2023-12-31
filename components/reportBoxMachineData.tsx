import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MachineStatus, MachineData, Location } from './Location';
import LocationReportListModal from './LocationReportListModal';

interface ReportBoxMachineDataProps {
    machineData: MachineData;
}

const ReportBoxMachineData: React.FC<ReportBoxMachineDataProps> = (props: ReportBoxMachineDataProps) => {

    let goodGlassMachines = 0;
    let goodCanMachines = 0;
    let goodBottleMachines = 0;

    if (props.machineData.glass.status) {
      goodGlassMachines = props.machineData.glass.status.filter((status: MachineStatus) => status === 'thumbsUp').length;
    }

    if (props.machineData.can.status) {
      goodCanMachines = props.machineData.can.status.filter((status: MachineStatus) => status === 'thumbsUp').length;
    }

    if (props.machineData.bottle.status) {
      goodBottleMachines = props.machineData.bottle.status.filter((status: MachineStatus) => status === 'thumbsUp').length;
    };

    const numberGlassMachines = props.machineData.glass.count ?? 0;
    const numberCanMachines = props.machineData.can.count ?? 0;
    const numberBottleMachines = props.machineData.bottle.count ?? 0;

    const goodMachinesCount = goodGlassMachines + goodCanMachines + goodBottleMachines;
    const totalMachineCount = numberGlassMachines + numberCanMachines + numberBottleMachines;


    return (
        <View style={styles.recentReviewBox}>

            <Text style={styles.reviewBoxHeader}>{`🥫 ${goodMachinesCount} out of ${totalMachineCount} machines are good`}</Text>

            <View style={styles.reviewBoxGoodMachinesView}>

                <View style={styles.reviewGlassLeftColumn}>
                    <Text style={styles.reportNumber}>{goodGlassMachines}</Text>
                    <Text style={styles.reportNumberText}>Glass</Text>
                </View>

                <View style={styles.reviewCanMiddleColumn}>
                    <Text style={styles.reportNumber}>{goodCanMachines}</Text>
                    <Text style={styles.reportNumberText}>Can</Text>
                </View>

                <View style={styles.reviewBottleRightColumn}>
                    <Text style={styles.reportNumber}>{goodBottleMachines}</Text>
                    <Text style={styles.reportNumberText}>Bottle</Text>
                </View>

            </View>

        </View>
    );

};

const styles = StyleSheet.create({
    recentReviewBox: {
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: {width: 0, height: 10},
        padding: 15,
        height: 240,
        width: '100%'
    },
    reviewBoxHeader: {
        alignSelf: 'flex-start',
        fontSize: 17,
        fontWeight: '600'
    },
    reviewBoxGoodMachinesView: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      height: '75%',
      alignItems: 'center',
      backgroundColor: '#F6F5F1',
      borderRadius: 20,
      padding: 10,
    },
    reportNumber: {
      fontWeight: 'bold',
      fontSize: 30,
    },
    reportNumberText: {
      fontSize: 17,
      fontWeight: '600'
    },
    reviewGlassLeftColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      height: '100%',
      borderRightColor: 'grey',
      borderRightWidth: 1,
      padding: 15,
    },
    reviewCanMiddleColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      height: '100%',
      borderRightColor: 'grey',
      borderRightWidth: 1,
      padding: 15
    },
    reviewBottleRightColumn: {
      flex: 1, 
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      height: '100%',
      borderRightColor: 'grey',
      padding: 15
    },
    reportBoxFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      width: '100%',
      marginTop: 10
    },
    reportBoxDate: {
      fontSize: 13
    },
    seeMoreReports: {
      alignSelf: 'flex-end',
      backgroundColor: '#1636EA',
      borderRadius: 5,
      padding: 4,
      paddingHorizontal: 6
    },
    seeMoreReportsText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 13
    },
});

export default ReportBoxMachineData;