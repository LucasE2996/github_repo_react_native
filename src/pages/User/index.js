import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';

import api from '../../services/api';
// import { Container } from './styles';

const User = ({route}) => {
  // react-navigation v5 uses route object to hold params objects
  const {user} = route.params;
  const [stars, setStars] = useState([]);

  const getStars = async () => {
    const response = await api.get(`/users/${user.login}/starred`);

    if (response) {
      setStars(response.data);
    }
  };

  // equivalent to componentDidMount
  useEffect(() => {
    getStars();
  }, []);

  return (
    <View>
      <Text>{user.name}</Text>
    </View>
  );
};

User.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
};

export default User;
