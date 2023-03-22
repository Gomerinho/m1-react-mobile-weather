import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import styled from 'styled-components/native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const Input = styled.TextInput`
  width: 80%;
  height: 50px;
  margin-bottom: 20px;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #ccc;
`;

const LoginButton = styled.TouchableOpacity`
  width: 80%;
  background-color: #00aaff;
  padding: 10px;
  border-radius: 5px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const LoginButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  text-align: center;
`;

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Connexion réussie',
        });
        navigation.navigate('Home');
      })
      .catch(error => console.log(error));
  };

  if (auth().currentUser) {
    navigation.navigate('Home');
  }

  return (
    <Container>
      <LogoImage source={require('../../assets/images/logo.png')} />
      <Title>Se connecter</Title>
      <Input
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <Input
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      <LoginButton title="Login" onPress={handleLogin}>
        <LoginButtonText>Connexion</LoginButtonText>
      </LoginButton>
      <Text>
        Vous n'avez pas de compte ?{' '}
        <Text onPress={() => navigation.navigate('Register')}>
          Inscrivez vous !{' '}
        </Text>
      </Text>
    </Container>
  );
};

const LogoImage = styled.Image`
  width: 100px;
  height: 100px;
`;

export default LoginScreen;
