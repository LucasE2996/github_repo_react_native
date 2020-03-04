import React, {useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import PropTypes from 'prop-types';

// import { Container } from './styles';

const Detail = ({route}) => {
  const [loading, setLoading] = useState(true);

  const onLoadEnd = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color="#333" size={50} />
        </View>
      )}
      <WebView
        source={{uri: route.params.html_url}}
        style={{flex: 1}}
        onLoadEnd={onLoadEnd}
        onLoadStart={console.log('START LOADING')}
      />
    </>
  );
};

Detail.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
};

export default Detail;
