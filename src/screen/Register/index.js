import React, {useState} from 'react';
import styled from 'styled-components/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const Input = styled.TextInput`
  width: 80%;
  height: 50px;
  margin-bottom: 20px;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #ccc;
`;

const Button = styled.TouchableOpacity`
  width: 80%;
  height: 50px;
  background-color: #00aaff;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const LoginButton = styled.TouchableOpacity`
  width: 80%;
  height: 50px;
  margin-top: 10px;
  background-color: grey;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

const RegisterScreen = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Les mots de passe ne correspondent pas',
      });
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        userCredential.user
          .updateProfile({
            displayName: `${firstName} ${lastName}`,
          })
          .then(() => {
            const userRef = firestore().collection('users').doc(user?.uid);
            userRef
              .set({
                firstName,
                lastName,
                email,
              })
              .then(() => {
                Toast.show({
                  type: 'success',
                  text1: 'Inscription réussie',
                });
                navigation.navigate('Home');
              });
          })
          .catch(error => {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: error.message,
            });
          });

        const user = userCredential.user;
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
        });
      });
  };

  if (auth().currentUser) {
    navigation.navigate('Home');
  }

  return (
    <Container>
      <Input
        placeholder="First Name"
        onChangeText={text => setFirstName(text)}
        value={firstName}
      />
      <Input
        placeholder="Last Name"
        onChangeText={text => setLastName(text)}
        value={lastName}
      />
      <Input
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Input
        placeholder="Confirm Password"
        onChangeText={text => setConfirmPassword(text)}
        value={confirmPassword}
        secureTextEntry
      />
      <Button
        onPress={() => {
          handleSignup();
        }}>
        <ButtonText>Inscription</ButtonText>
      </Button>
      <LoginButton
        onPress={() => {
          navigation.navigate('Login');
        }}>
        <ButtonText>Se connecter</ButtonText>
      </LoginButton>
    </Container>
  );
};

export default RegisterScreen;
