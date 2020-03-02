import React, {useState, useEffect} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Bio,
  Avatar,
  Name,
  ProfileButton,
  ProfileButtonText,
} from './styles';

const Main = ({navigation}) => {
  const [newUser, setNewUser] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    const usersFromCache = await AsyncStorage.getItem('users');

    if (usersFromCache) {
      console.log('getUsers', JSON.parse(usersFromCache));
      setUsers(JSON.parse(usersFromCache));
    }
  };

  const updateUsers = async () => {
    await AsyncStorage.setItem('users', JSON.stringify(users));
    console.log('update', users);
  };

  const deleteAllUsers = async () => {
    await AsyncStorage.removeItem('users');
  };

  // equivalent to componentDidMount
  useEffect(() => {
    getUsers();
    // deleteAllUsers();
  }, []);

  // equivalent to componentDidUpdate
  useEffect(() => {
    updateUsers();
  }, [users]);

  const handleAddUser = async () => {
    setLoading(true);
    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    console.log(data);

    setUsers([...users, data]);
    setNewUser('');
    setLoading(false);
    Keyboard.dismiss();
  };

  const handleNavigate = user => {
    navigation.navigate('User', {user});
  };

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar usuário"
          value={newUser}
          onChangeText={text => setNewUser(text)}
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
        />
        <SubmitButton loading={loading} onPress={handleAddUser}>
          {loading ? (
            <ActivityIndicator color="#FFF" size={20} />
          ) : (
            <Icon name="add" size={14} color="#FFF" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({item}) => (
          <User>
            <Avatar source={{uri: item.avatar}} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>Ver Perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
};

Main.navigationOptions = {
  title: 'Hello World',
};

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Main;
