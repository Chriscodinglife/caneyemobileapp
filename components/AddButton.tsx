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
                    <MaterialIcons name="add" size={38} color="#25292e" />
                </Pressable>
        </View>
    )
};

const styles = StyleSheet.create({
    circleButtonContainer: {
        width: 84,
        height: 84,
        marginHorizontal: 60,
        borderWidth: 4,
        borderColor: "#000000",
        borderRadius: 40,
        padding: 3,
    },
    whiteCircleButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 30,
        backgroundColor: "#fff"
    },
    greyCircleButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 30,
        backgroundColor: "#F0F0F0"
    },
});

export default AddButton;