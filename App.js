import React from 'react';
import {SafeAreaView, View} from 'react-native';

import Routes from './src/config/routes';
import {UserProvider} from './src/context/auth';

function App() {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <UserProvider>
      <Routes />
    </UserProvider>
  );
}

export default App;
