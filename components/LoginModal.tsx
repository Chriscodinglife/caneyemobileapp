import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { View, TextInput, Button, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Modal } from 'react-native';

type LoginModalProps = {
  loginModalVisible: boolean;
  setLoginModalVisible: () => void;
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
        setLoginModalVisible();
      } catch (error: any) {
        console.log(error);
        alert("Sign in failed: " + error.message)
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
        alert("Registration Failed: " + error.message)
      } finally {
        setLoading(false);
      };

    };


    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={loginModalVisible}
        onRequestClose={() => setLoginModalVisible()}>
        <View style={styles.container}>
          <KeyboardAvoidingView behavior='padding'>
            <TextInput 
              value={email}
              style={styles.input}
              placeholder='Email'
              autoCapitalize='none'
              onChange={(event) => setEmail(event.nativeEvent.text)}
            />
            <TextInput 
              secureTextEntry={true}
              value={password}
              style={styles.input}
              placeholder='Pasword'
              autoCapitalize='none'
              onChange={(event) => setPassword(event.nativeEvent.text)}
            />

            { loading ? <ActivityIndicator size="large" color="#0000ff" />
            : <>
              <Button title='Login' onPress={() => signIn()}/>
              <Button title='Create Account' onPress={() => signUp()}/>
              <Button title='Close' onPress={() => setLoginModalVisible()}/>
            </> }
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 1,
    padding: 10,
    backgroundColor: "#fff"
  }
})

export default LoginModal;