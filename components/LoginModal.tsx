import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from "firebase/auth";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Modal, TouchableOpacity, Image, Platform, TouchableWithoutFeedback, Keyboard, } from 'react-native';

type LoginModalProps = {
  loginModalVisible: boolean;
  setLoginModalVisible: Dispatch<SetStateAction<boolean>>;
};

const LoginModal: React.FC<LoginModalProps> = ({ loginModalVisible, setLoginModalVisible}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
      setLoading(true);
      
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        console.log(response);
        alert("You have successfully signed in!")
        setLoginModalVisible(false);
      } catch (error: any) {
        console.log(error);
        alert("Sign in failed: Please double check your credentials")
      } finally {
        setLoading(false);
      };

    };

    const signUp = async () => {
      setLoading(true);

      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log(response);
        alert("Check your email to verify your account.")
      } catch (error: any) {
        console.log(error);
        alert("Registration Failed: Please double check your credentials")
      } finally {
        setLoading(false);
      };

    };


    return (

      <Modal
        animationType='slide'
        transparent={false}
        visible={loginModalVisible}
        onRequestClose={() => setLoginModalVisible(false)}>
        
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainView}>
          <View style={styles.mainHeader}>

            <TouchableOpacity onPress={() => setLoginModalVisible(false)}>
                <Text style={styles.uppercloseButton}>{`<-`}</Text>
            </TouchableOpacity>
            
            <Text style={styles.mainHeaderText}>Can Eye</Text>
            
            <View style={styles.imageContainer}>
              <Image source={require('../assets/caneyeapp_small.png')} style={styles.iconImage}/>
            </View>
          </View>


         
            <Text style={styles.loginHeader}>Login or Sign Up</Text>
            <TextInput 
              value={email}
              style={styles.inputBox}
              placeholder='Email'
              placeholderTextColor={'black'}
              autoCapitalize='none'
              onChange={(event) => setEmail(event.nativeEvent.text)}
            />
            <TextInput 
              secureTextEntry={true}
              value={password}
              style={styles.inputBox}
              placeholder='Password'
              placeholderTextColor={'black'}
              autoCapitalize='none'
              onChange={(event) => setPassword(event.nativeEvent.text)}
            />

          
            { loading ? <ActivityIndicator size="large" color="#0000ff" />
            : <>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity style={styles.loginButton} onPress={() => signIn()}>
                    <Text style={styles.loginText}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.registerButton} onPress={() => signUp()}>
                    <Text style={styles.registerText}>Register</Text>
                  </TouchableOpacity>
                </View>
              </> }

          

          
          <TouchableOpacity style={styles.closeButton} onPress={() => setLoginModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>


        </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      </Modal>

    );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    padding: 30,
    backgroundColor: 'white'
  },
  uppercloseButton: {
    color: 'black',
    fontWeight: "bold",
    fontSize: 20,
    shadowColor: 'white',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { height: 0, width: 0},
    paddingVertical: 40
},
  mainHeader: {
  },
  mainHeaderText: {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: '600',
    color: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { height: 3, width: 0},
  },
  imageContainer: {
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { height: 10, width: 0},
    margin: 20
  },
  iconImage: {
    borderRadius: 50,
  },
  loginHeader: {
    alignSelf: 'center',
    marginBottom: 30,
    fontSize: 25,
    color: 'black',
    fontWeight: '700'
  },
  inputBox: {
    marginVertical: 5,
    paddingLeft: 15,
    width: '100%',
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { height: 3, width: 0},
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 7,
    marginVertical: 20
  },
  loginButton: {
    backgroundColor: '#2B5CFF',
    padding: 16,
    width: '50%',
    alignItems: 'center',
    borderRadius: 10
  },
  loginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center'
  },
  registerButton: {
    backgroundColor: '#2B5CFF',
    padding: 16,
    width: '50%',
    alignItems: 'center',
    borderRadius: 10
  },
  registerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center'
  },
  closeButton: {
    backgroundColor: '#F58264',
    padding: 16,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#F58264',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { height: 3, width: 0},
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700'
}
})

export default LoginModal;