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

const User = ({route, navigation}) => {
  console.log(route);
  // react-navigation v5 uses route object to hold params objects
  const {user} = route.params;
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEndPage, setLoadingEndPage] = useState(false);
  const [page, setPage] = useState(1);
  const [reachEnd, setReachEnd] = useState(false);
  const [errorPage, setErrorPage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getStars = async (newPage, resetData) => {
    console.log(`getStars; page: ${page}`);
    try {
      const response = await api.get(`/users/${user.login}/starred`, {
        params: {
          page: newPage || page,
          per_page: 20,
        },
      });
      if (response) {
        if (response.data.length < 1) {
          setReachEnd(true);
        } else {
          console.log(response.data);
          setStars(resetData ? response.data : [...stars, ...response.data]);
          setPage(prev => {
            const newValue = prev + 1;
            return newValue;
          });
        }
      }
    } catch (err) {
      console.error('ERROR', err);
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
      console.log('deny loadMore');
      return;
    }
    console.log('loadMore');
    setLoadingEndPage(true);
    getStars();
  };

  const refreshList = () => {
    setRefreshing(true);
    setPage(1);

    setTimeout(() => {
      getStars(1, true);
      setRefreshing(false);
    }, 500);
  };

  const handleNavigateDetail = url => {
    navigation.navigate('Detail', {html_url: url});
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
            onRefresh={refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
            refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
            onEndReachedThreshold={0.01} // Carrega mais itens quando chegar em 10% do fim
            onEndReached={loadMore} // Função que carrega mais itens
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <Starred onPress={() => handleNavigateDetail(item.html_url)}>
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
