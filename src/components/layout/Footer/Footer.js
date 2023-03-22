import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Footer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  height: 60px;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
`;

const FooterButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const AppFooter = ({user}) => {
  const navigation = useNavigation();

  const handleProfile = () => {
    if (user) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <Footer>
      {user && (
        <>
          <FooterButton onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home-outline" size={24} color="#666" />
          </FooterButton>
          <FooterButton onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={24} color="#666" />
          </FooterButton>
        </>
      )}
      <FooterButton onPress={handleProfile}>
        {user ? (
          <Ionicons name="person-circle-outline" size={24} color="#666" />
        ) : (
          <Ionicons name="log-in-outline" size={24} color="#666" />
        )}
      </FooterButton>
    </Footer>
  );
};

export default AppFooter;
