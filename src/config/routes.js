import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screen/Home';
import LoginScreen from '../screen/Login';
import RegisterScreen from '../screen/Register';
import Layout from '../components/layout/AppLayout/AppLayout';
import {firebase} from '@react-native-firebase/auth';
import {UserContext, UserProvider} from '../context/auth';
import ProfileScreen from '../screen/Profile';
import SearchScreen from '../screen/Search';
import DetailScreen from '../screen/City';

const Stack = createStackNavigator();

const Routes = () => {
  const user = useContext(UserContext);
  return (
    <NavigationContainer>
      <Layout>
        <Stack.Navigator>
          {user && (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen name="City" component={DetailScreen} />
            </>
          )}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </Layout>
    </NavigationContainer>
  );
};

export default Routes;
