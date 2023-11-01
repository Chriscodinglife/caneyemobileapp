import React, { useState, Dispatch, SetStateAction } from 'react';
import { View, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


interface CanEyeActionButtonsProps {
    setLocationListVisible: Dispatch<SetStateAction<boolean>>;
    setAccountModalVisible: Dispatch<SetStateAction<boolean>>;
};

const CanEyeActionButtons: React.FC<CanEyeActionButtonsProps> = (props: CanEyeActionButtonsProps) => {

    return (
        <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButtonsContent}>
                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={() => props.setLocationListVisible(true)}>
                        <FontAwesome name="recycle" size={38} color="#fff" style={styles.iconStyle}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.accountButton}
                    onPress={() => props.setAccountModalVisible(true)}>
                        <MaterialCommunityIcons name="tooltip-account" size={35} color="white" style={styles.iconStyle}/>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    actionButtonsContainer: {
        position: 'absolute',
        bottom: 80,
        width: 80,
        height: 80,
    },
    actionButtonsContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    locationButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 30,
        backgroundColor: "#1EB2EB",
        shadowColor: "#00AEED",
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2},
    },
    iconStyle: {
        alignSelf: 'center'
    },
    accountButton: {
        marginLeft: 38,
        marginBottom: 10,
        padding: 4,
        alignSelf: 'flex-end',
        borderRadius: 30,
        backgroundColor: "#1EB2EB",
        shadowColor: "#00AEED",
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2},
    }
});

export default CanEyeActionButtons;