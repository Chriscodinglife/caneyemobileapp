import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useAppContext } from './AppContextProvider';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import LoginModal from './LoginModal';

interface AccountModalProps {
    isAccountModalVisible: boolean;
    setAccountModalVisible: Dispatch<SetStateAction<boolean>>;
}

const AccountModal: React.FC<AccountModalProps> = (props: AccountModalProps) => {

    const { user, updateUser } = useAppContext();
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    // Listen to state changes of the user and pass that along as needed
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        updateUser(user);
        });

    }, []);


    return (
        <Modal
            animationType='slide'
            transparent={false}
            visible={props.isAccountModalVisible}
            onRequestClose={() => props.setAccountModalVisible(false)}>

                <View style={styles.mainView}>

                    <TouchableOpacity onPress={() => props.setAccountModalVisible(false)}>
                        <Text style={styles.closeButtonText}>{`<-`}</Text>
                    </TouchableOpacity>

                    <View style={styles.userAccountIcon}>
                        <MaterialCommunityIcons name="tooltip-account" size={80} color="black" />
                        <Text style={styles.userHeader}>My Account Info</Text>
                    </View>

                    <View style={styles.userInfoContainer}>

                        { user ? (
                            <>
                                <Text style={styles.userEmailText}>Email: {user?.email}</Text>

                                <TouchableOpacity style={styles.logButton} onPress={() => updateUser(null)}>
                                    <Text style={styles.logButtonText}>Logout</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.userEmailText}>Log in to see your info</Text>

                                <TouchableOpacity style={styles.logButton} onPress={() => setLoginModalVisible(true)}>
                                    <Text style={styles.logButtonText}>Log in</Text>
                                </TouchableOpacity>
                                
                            </>
                        )}

                    </View>


                    <TouchableOpacity style={styles.button} onPress={() => props.setAccountModalVisible(false)}>
                        <Text style={styles.buttonText}>Looks Good</Text>
                    </TouchableOpacity>

                    <LoginModal
                      loginModalVisible={loginModalVisible}
                      setLoginModalVisible={setLoginModalVisible} />


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
        backgroundColor: 'white',
        paddingVertical: 40
    },
    userAccountIcon: {
        flex: 1,
        alignItems: 'center',
    },
    userHeader: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        padding: 40

    },
    userInfoContainer: {
        flex: 1,
        padding: 10,
    },
    userEmailText: {
        fontSize: 16,
        fontWeight: '600'

    },
    logButton: {
        alignItems: 'center',
        backgroundColor: "red",
        borderRadius: 10,
        padding: 16,
        marginVertical: 40,
        shadowColor: "#00AEED",
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2},
      },
    logButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
    },
    button: {
        alignItems: 'center',
        backgroundColor: "#1EB2EB",
        borderRadius: 10,
        padding: 16,
        shadowColor: "#00AEED",
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2},
      },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
    },

})

export default AccountModal;