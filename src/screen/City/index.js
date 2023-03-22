import React, {useState, useEffect, useContext} from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import axios from 'axios';
import styled from 'styled-components/native';
import {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {UserContext} from '../../context/auth';

const API_KEY = '489d758cad27ef9f5cf4e242b9c4adbf';

const DetailScreen = ({route}) => {
  const {id} = route.params;
  const [weather, setWeather] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();
  const userContext = useContext(UserContext);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&lang=fr&appid=${API_KEY}`,
      )
      .then(response => setWeather(response.data))
      .catch(error =>
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: "Une erreur s'est produite",
        }),
      );

    const user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection('users')
      .doc(user?.uid)
      .get()
      .then(doc => {
        const user = doc.data();

        setIsFavorite(user.favorites?.some(city => city.cityId === id));
      });
  }, [id]);

  const addToFavorites = async () => {
    const user = firebase.auth().currentUser;

    const userRef = firebase.firestore().collection('users').doc(user?.uid);

    const doc = await userRef.get();

    const userDoc = doc.data();

    const favorites = userDoc.favorites || [];

    favorites.push({
      cityId: id,
    });

    await userRef
      .update({
        favorites,
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Ville ajoutée aux favoris',
        });
        user.favorites = favorites;
        navigation.navigate('Home', {favorites});
      });
  };

  const removeFromFavorites = async () => {
    const user = firebase.auth().currentUser;

    const userRef = firebase.firestore().collection('users').doc(user?.uid);
    const userDoc = await userRef.get();

    const favorites = userDoc.data().favorites;

    const newFavorites = favorites.filter(city => city.cityId !== id);

    await userRef
      .update({
        favorites: newFavorites,
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Ville supprimée des favoris',
        });
        user.favorites = newFavorites;
        navigation.navigate('Home', {favorites: newFavorites});
      });
  };

  if (!weather) {
    return (
      <Container>
        <Loading>Chargement en cours...</Loading>
      </Container>
    );
  }

  const {
    name,
    sys: {country},
    weather: [
      {main: weatherMain, description: weatherDescription, icon: weatherIcon},
    ],
    main: {
      temp: temperature,
      feels_like: feelsLike,
      temp_min: tempMin,
      temp_max: tempMax,
      humidity,
    },
    wind: {speed: windSpeed},
    dt,
    timezone,
  } = weather;

  const sunrise = moment.unix(weather.sys.sunrise + timezone).format('LT');
  const sunset = moment.unix(weather.sys.sunset + timezone).format('LT');
  const date = moment.unix(dt + timezone).format('LL');
  const time = moment.unix(dt + timezone).format('LT');

  return (
    <Container>
      <TopContainer>
        <CityName>
          {name}, {country}
        </CityName>
        <DateTime>
          {date} - {time}
        </DateTime>
        <WeatherIcon
          source={{uri: `https://openweathermap.org/img/w/${weatherIcon}.png`}}
        />
        <Temperature>{Math.round(temperature)}°C</Temperature>
        <WeatherDescription>{weatherMain}</WeatherDescription>
      </TopContainer>
      {!isFavorite ? (
        <AddToFavoritesButton onPress={addToFavorites}>
          <AddToFavoritesButtonText>
            Ajouter aux favoris
          </AddToFavoritesButtonText>
        </AddToFavoritesButton>
      ) : (
        <RemoveFromFavoritesButton onPress={removeFromFavorites}>
          <RemoveFromFavoritesButtonText>
            Retirer des favoris
          </RemoveFromFavoritesButtonText>
        </RemoveFromFavoritesButton>
      )}

      <BottomContainer>
        <InfoContainer>
          <InfoTitle>Sensations</InfoTitle>

          <FeelsLike>{Math.round(feelsLike)}°C</FeelsLike>
        </InfoContainer>
        <InfoContainer>
          <InfoTitle>Température Min.</InfoTitle>
          <InfoValue>{Math.round(tempMin)}°C</InfoValue>
        </InfoContainer>
        <InfoContainer>
          <InfoTitle>Température Max.</InfoTitle>
          <InfoValue>{Math.round(tempMax)}°C</InfoValue>
        </InfoContainer>
        <InfoContainer>
          <InfoTitle>Humidité</InfoTitle>
          <InfoValue>{humidity}%</InfoValue>
        </InfoContainer>
        <InfoContainer>
          <InfoTitle>Vitesse du vent</InfoTitle>
          <InfoValue>{windSpeed} km/h</InfoValue>
        </InfoContainer>
        <InfoContainer>
          <InfoTitle>Lever du soleil</InfoTitle>
          <InfoValue>{sunrise}</InfoValue>
        </InfoContainer>
        <InfoContainer>
          <InfoTitle>Coucher du soleil</InfoTitle>
          <InfoValue>{sunset}</InfoValue>
        </InfoContainer>
      </BottomContainer>
    </Container>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  background-color: #fff;
`;

const TopContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const BottomContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const CityName = styled.Text`
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
`;

const DateTime = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
`;

const WeatherIcon = styled.Image`
  width: 120px;
  height: 120px;
`;

const Temperature = styled.Text`
  font-size: 48px;
  font-weight: 500;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const WeatherDescription = styled.Text`
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
`;

const InfoContainer = styled.View`
  margin-bottom: 20px;
`;

const InfoTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const InfoValue = styled.Text`
  font-size: 16px;
`;

const FeelsLike = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Loading = styled.Text`
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
`;

const AddToFavoritesButton = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  background-color: #00bfff;
  width: 50%;
  margin: 0 auto;
`;

const AddToFavoritesButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

const RemoveFromFavoritesButton = styled.TouchableOpacity`
  background-color: red;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  width: 50%;
  margin: 0 auto;
`;

const RemoveFromFavoritesButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

export default DetailScreen;
