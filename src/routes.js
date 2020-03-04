import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Main from './pages/Main';
import User from './pages/User';
import Detail from './pages/Detail';

const Stack = createStackNavigator();

const DefaultOptions = {
  headerStyle: {
    backgroundColor: '#7159C1',
  },
  headerTitleAlign: 'center',
  headerTintColor: '#FFF',
  headerBackTitleVisible: false,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" screenOptions={DefaultOptions}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen
          name="User"
          component={User}
          options={({route}) => ({title: route.params.user.name})}
        />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
