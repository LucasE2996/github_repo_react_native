import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Content,
} from './styles';

const User = ({route}) => {
  // react-navigation v5 uses route object to hold params objects
  const {user} = route.params;
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStars = async () => {
    const response = await api.get(`/users/${user.login}/starred`);

    if (response) {
      setStars(response.data);
    }

    setLoading(false);
  };

  // equivalent to componentDidMount
  useEffect(() => {
    getStars();
  }, []);

  return (
    <Container>
      <Header>
        <Avatar source={{uri: user.avatar}} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      {loading ? (
        <Content>
          <ActivityIndicator color="#333" size={50} />
        </Content>
      ) : (
        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({item}) => (
            <Starred>
              <OwnerAvatar source={{uri: item.owner.avatar_url}} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      )}
    </Container>
  );
};

User.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
};

export default User;
