import React, { useState } from 'react';
import { View, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 


type AddButtonProps = {
    onClick: () => void;
};

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
    const [buttonPressed, setButtonPressed] = useState(false);

    const inPressButton = () => {

        setButtonPressed(true)
        onClick()

    };


    return (
        <View style={styles.circleButtonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPressIn={() => inPressButton()}
                    onPressOut={() => setButtonPressed(false)}>
                        <FontAwesome name="recycle" size={38} color="#fff" style={styles.iconStyle}/>
                </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    circleButtonContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 80,
        width: 80,
        height: 80,
    },
    button: {
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
    }
});

export default AddButton;