import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


type AddButtonProps = {
    onClick: () => void;
};

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
    const [buttonPressed, setButtonPressed] = useState(false);

    const setStyle = () => {
        if (buttonPressed) {
            return styles.greyCircleButton;
        } else { 
            return styles.whiteCircleButton;
        };
    };

    const inPressButton = () => {

        setButtonPressed(true)
        onClick()

    };


    return (
        <View style={styles.circleButtonContainer}>
                <Pressable
                    style={setStyle()}
                    onPressIn={() => inPressButton()}
                    onPressOut={() => setButtonPressed(false)}>
                    <MaterialIcons name="add" size={38} color="#fff" />
                </Pressable>
        </View>
    )
};

const styles = StyleSheet.create({
    circleButtonContainer: {
        width: 70,
        height: 70,
        marginHorizontal: 60,
        padding: 3,
    },
    whiteCircleButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 30,
        backgroundColor: "#1EB2EB",
        shadowColor: "#00AEED",
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2},
    },
    greyCircleButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 30,
        backgroundColor: "#11A0D4"
    },
});

export default AddButton;