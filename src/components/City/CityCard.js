import axios from 'axios';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';

const Card = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  elevation: 5;
  padding: 20px;
  margin: 10px;
`;

const CityName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000;
`;

const Temperature = styled.Text`
  font-size: 16px;
  color: #666;
`;

const WeatherIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const Container = styled.View`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

const WeatherInfo = styled.View``;

const API_KEY = '489d758cad27ef9f5cf4e242b9c4adbf';

const CityCard = ({cityId, onPress}) => {
  const fetchACityWeatherById = async id => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&lang=fr&appid=${API_KEY}`,
    );

    return response.data;
  };

  const [weather, setWeather] = useState({});

  useEffect(() => {
    try {
      fetchACityWeatherById(cityId).then(data => setWeather(data));
    } catch (error) {
      console.log(error);
    }
  }, [cityId]);

  return (
    <Card onPress={onPress} key={cityId}>
      <Container>
        <WeatherInfo>
          <CityName>{weather.name}</CityName>
          <Temperature>{Math.round(weather?.main?.temp)}°C</Temperature>
        </WeatherInfo>

        <WeatherIcon
          source={{
            uri: `https://openweathermap.org/img/w/${weather?.weather?.[0]?.icon}.png`,
          }}
        />
      </Container>
    </Card>
  );
};

export default CityCard;
