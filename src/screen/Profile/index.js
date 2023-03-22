import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import styled from 'styled-components/native';
import {UserContext} from '../../context/auth';
import {useNavigation} from '@react-navigation/native';

const ProfileContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const UserInfoContainer = styled.View`
  margin-bottom: 20px;
`;

const UserInfoLabel = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const UserInfoValue = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: #ff5c5c;
  padding: 10px;
  border-radius: 5px;
  align-self: center;
`;

const LogoutButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export default function ProfileScreen() {
  const user = useContext(UserContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    auth().signOut();
    navigation.navigate('Login');
  };

  if (!user) {
    return (
      <View>
        <Text>Vous n'êtes pas connecté</Text>
      </View>
    );
  }

  return (
    <ProfileContainer>
      <UserInfoContainer>
        <UserInfoLabel>Nom d'utilisateur :</UserInfoLabel>
        <UserInfoValue>{user?._user.displayName}</UserInfoValue>
        <UserInfoLabel>Email :</UserInfoLabel>
        <UserInfoValue>{user?._user.email}</UserInfoValue>
      </UserInfoContainer>

      <LogoutButton onPress={handleLogout}>
        <LogoutButtonText>Se déconnecter</LogoutButtonText>
      </LogoutButton>
    </ProfileContainer>
  );
}
