import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import axios from 'axios';
import {useDebounce} from 'use-debounce';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

const API_URL = 'https://api.openweathermap.org/data/2.5/';
const API_KEY = '489d758cad27ef9f5cf4e242b9c4adbf';

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Input = styled.TextInput`
  height: 40px;
  border-width: 1px;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 16px;
`;

const Item = styled.Text`
  padding: 10px;
  font-size: 18px;
  height: 44px;
`;

const TextCenter = styled.Text`
  text-align: center;
`;

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [cities, setCities] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (debouncedSearchText) {
      axios
        .get(`${API_URL}find`, {
          params: {
            q: searchText,
            type: 'like',
            sort: 'population',
            cnt: '30',
            appid: API_KEY,
          },
        })
        .then(response => {
          const citiesList = response.data.list.map(item => {
            return {
              name: item.name,
              country: item.sys.country,
              id: item.id,
            };
          });

          //unique city if name and country is equal
          const uniqueCities = citiesList.filter(
            (city, index, self) =>
              index ===
              self.findIndex(
                t =>
                  t.name.toLowerCase() === city.name.toLowerCase() &&
                  t.country.toLowerCase() === city.country.toLowerCase(),
              ),
          );

          setCities(uniqueCities);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setCities([]);
    }
  }, [debouncedSearchText, searchText]);

  const renderItem = ({item}) => (
    <Item
      onPress={() =>
        navigation.navigate('City', {id: item.id})
      }>{`${item.name}, ${item.country}`}</Item>
  );

  return (
    <Container>
      <Input
        placeholder="Rechercher une ville"
        onChangeText={setSearchText}
        value={searchText}
      />
      <FlatList
        data={cities}
        renderItem={renderItem}
        keyExtractor={item => item.id || item.name}
        ListEmptyComponent={
          <TextCenter>
            {debouncedSearchText ? 'No cities found' : 'Rechercher une ville'}
          </TextCenter>
        }
      />
    </Container>
  );
};

export default SearchScreen;
