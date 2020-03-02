import React from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';

// import { Container } from './styles';

const User = ({route}) => {
  // react-navigation v5 uses route object to hold params objects
  const {user} = route.params;

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
