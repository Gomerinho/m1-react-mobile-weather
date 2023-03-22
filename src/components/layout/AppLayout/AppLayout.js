import React, {useContext} from 'react';
import {SafeAreaView, View} from 'react-native';
import {UserContext} from '../../../context/auth';
import AppFooter from '../Footer/Footer';
import Toast from 'react-native-toast-message';
import styled from 'styled-components/native';

const BackgroundView = styled.SafeAreaView`
  flex: 1;
`;

export default function Layout({children}) {
  const user = useContext(UserContext);
  return (
    <BackgroundView style={{flex: 1}}>
      <View style={{flex: 1}}>{children}</View>

      <AppFooter user={user} />
      <Toast position="top" />
    </BackgroundView>
  );
}
