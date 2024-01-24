/**
 * Sample CodePush
 * Leon Arantes
 */

import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, Dimensions, AppState, SafeAreaView } from 'react-native';
import codePush from 'react-native-code-push';
const bgImage = require('./assets/background.png');
const img1 = require('./assets/img-1.png');
const img2 = require('./assets/img-2.png');
const img3 = require('./assets/img-3.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_PHOTO_WIDTH = SCREEN_WIDTH / 2 - 96;
const CARD_INFO_WIDTH = SCREEN_WIDTH - CARD_PHOTO_WIDTH - 72;

const Card = ({img, title, desc, price}) => {
  return (
    <View style={styles.card}>
      <Image source={img} resizeMode={'cover'} style={styles.photo} />
      <View style={styles.cardWrapper}>
        <Text style={styles.title}>{title || 'undefined'}</Text>
        <Text style={styles.desc}>{desc || 'undefined'}</Text>
        <Text style={styles.price}>R$ {price || 'undefined'}</Text>
      </View>
    </View>
  );
};

const App = () => {
  const [codePushProgress, setCodePushProgress] = useState(0);

  const checkAndInstallCodePush = async () => {
    try {
      const syncStatus = await codePush.checkForUpdate();

      if (syncStatus) {
        codePush.sync(
          {installMode: codePush.InstallMode.IMMEDIATE},
          status => {},
          ({receivedBytes, totalBytes}) => {
            const progress = Math.min((receivedBytes / totalBytes) * 100, 100);
            const formattedProgress = progress.toFixed(2);
            setCodePushProgress(parseInt(formattedProgress));
          },
        );
      } else {
        console.log('O aplicativo já está atualizado.');
      }
    } catch (error) {
      console.log('Erro ao verificar atualizações:', error);
    }
  };

  useEffect(() => {
    checkAndInstallCodePush();
    const appStateHandler = nextAppState => {
      if (nextAppState === 'background') {
        checkAndInstallCodePush();
      }
    };

    const subscription = AppState.addEventListener('change', appStateHandler);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ImageBackground source={bgImage} style={styles.container}>
      {codePushProgress ? (
        <SafeAreaView style={styles.safeArea}>
          <View style={{padding: 20}}>
            <Text style={{color: 'white', fontWeight: '600'}}>
              CodePush update progress: {codePushProgress}%
            </Text>
          </View>
        </SafeAreaView>
      ) : null}

      <Card
        img={img1}
        title="Nike Reverse Panda"
        desc="Nike Air Dunk Jumbo"
        price="999,99"
      />

      <Card
        img={img2}
        title="Short-Sleeve Top"
        desc="Nike x Off-White™"
        price="399,99"
      />

      <Card
        img={null}
        title={'Championship Purple'}
        desc={'Dunk Low'}
        price={'00,00'}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
  },
  safeArea: {
    width: '100%',
    backgroundColor: '#765BE2',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
  },
  card: {
    backgroundColor: '#FEFEFE',
    width: '92%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
  },
  photo: {
    width: CARD_PHOTO_WIDTH,
    height: CARD_PHOTO_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  cardWrapper: {
    width: CARD_INFO_WIDTH,
    height: '100%',
  },
  title: {
    color: '#1E1E1E',
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 8,
  },
  desc: {
    color: '#00000080',
  },
  price: {
    fontWeight: '800',
    color: '#60d394',
    fontSize: 20,
    marginTop: 22,
  },
});

export default App;
