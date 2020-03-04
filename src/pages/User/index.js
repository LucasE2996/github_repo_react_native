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
  ErrorText,
} from './styles';

const User = ({route}) => {
  // react-navigation v5 uses route object to hold params objects
  const {user} = route.params;
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEndPage, setLoadingEndPage] = useState(false);
  const [page, setPage] = useState(1);
  const [reachEnd, setReachEnd] = useState(false);
  const [errorPage, setErrorPage] = useState(false);

  const getStars = async () => {
    try {
      const response = await api.get(`/users/${user.login}/starred`, {
        params: {
          page,
          per_page: 20,
        },
      });
      if (response) {
        if (response.data.length < 1) {
          setReachEnd(true);
        } else {
          setStars([...stars, ...response.data]);
          setPage(prev => {
            const newValue = prev + 1;
            return newValue;
          });
        }
      }
    } catch (err) {
      setErrorPage(true);
    }

    setLoading(false);
    setLoadingEndPage(false);
  };

  // equivalent to componentDidMount
  useEffect(() => {
    getStars();
  }, []);

  const loadMore = () => {
    if (reachEnd || loadingEndPage) {
      return;
    }
    setLoadingEndPage(true);
    getStars();
  };

  return (
    <Container>
      <Header>
        <Avatar source={{uri: user.avatar}} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      {loading || errorPage ? (
        <Content>
          {loading ? (
            <ActivityIndicator color="#333" size={50} />
          ) : (
            <ErrorText>Ops... algo deu errado</ErrorText>
          )}
        </Content>
      ) : (
        <>
          <Stars
            onEndReachedThreshold={0.1} // Carrega mais itens quando chegar em 10% do fim
            onEndReached={loadMore} // Função que carrega mais itens
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
          {loadingEndPage && <ActivityIndicator color="#333" size={30} />}
        </>
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
