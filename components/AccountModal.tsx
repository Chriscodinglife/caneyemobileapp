import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useState, Dispatch, SetStateAction, useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import LoginModal from './LoginModal';
import { AuthContext } from './AuthContext'
import { User } from 'firebase/auth';


interface AccountModalProps {
    isAccountModalVisible: boolean;
    setAccountModalVisible: Dispatch<SetStateAction<boolean>>;
}

const AccountModal: React.FC<AccountModalProps> = (props: AccountModalProps) => {

    const { currentUser, signOut, deleteUser } = useContext(AuthContext);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [isLogoutLoading, setIsLogOutLoading] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

    const sleep = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
      

    const handleLogout = async () => {
        setIsLogOutLoading(true);
        await sleep(500);
        signOut();
        setIsLogOutLoading(false);
        Alert.alert("Log Out Successful!", "You were able to log out!\n\nSee you again soon!")
    };

    const handleUserDelete = async () => {
        setIsDeleteLoading(true);
        await sleep(500);
        deleteUser();
        setIsDeleteLoading(false);
        Alert.alert("Account Deleted", "Sorry to see you go!")

    };

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

                        { currentUser ? (
                            <>
                                <Text style={styles.userEmailText}>Email: {currentUser?.email}</Text>

                                {!isLogoutLoading ? (
                                    <TouchableOpacity style={styles.logButton} onPress={handleLogout}>
                                        <Text style={styles.logButtonText}>Logout</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <ActivityIndicator size={"large"} color={'grey'} />
                                )}

                                {!isDeleteLoading ? (
                                    <TouchableOpacity style={styles.logButton} onPress={handleUserDelete}>
                                        <Text style={styles.logButtonText}>Delete Account</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <ActivityIndicator size={"large"} color={'grey'} />
                                )}
                                
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