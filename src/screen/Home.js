import React, {useContext, useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Button} from 'react-native';

import {UserContext} from '../context/auth';

import CityCard from '../components/City/CityCard';
import styled from 'styled-components/native';
import {firebase} from '@react-native-firebase/firestore';

const TextCentered = styled.Text`
  text-align: center;
`;

const Home = ({route}) => {
  const user = useContext(UserContext);

  const {favorites} = route.params || {};

  const [userFavorites, setUserFavorites] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (favorites) {
        setUserFavorites(favorites);
      } else {
        const userRef = firebase.firestore().collection('users').doc(user?.uid);
        userRef.get().then(doc => {
          if (doc.exists) {
            setUserFavorites(doc.data().favorites);
          }
        });
      }
    }, [favorites, user]),
  );

  const navigation = useNavigation();

  return (
    <View>
      <FlatList
        data={userFavorites}
        renderItem={({item}) => (
          <CityCard
            cityId={item.cityId}
            onPress={() => navigation.navigate('City', {id: item.cityId})}
          />
        )}
        keyExtractor={item => item.cityId}
        ListEmptyComponent={
          <>
            <TextCentered>Oooops vous n'avez pas de favoris</TextCentered>
            <Button
              title="Ajouter une ville"
              onPress={() => navigation.navigate('Search')}
            />
          </>
        }
      />
    </View>
  );
};

export default Home;
