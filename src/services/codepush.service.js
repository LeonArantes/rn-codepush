import React, {useEffect, useState} from 'react';
import {
  AppState,
  Dimensions,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import CodePush from 'react-native-code-push';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const CodePushService = () => {
  const [packageToInstall, setPackageToInstall] = useState(null);
  const [codePushProgress, setCodePushProgress] = useState(0);

  const updateAppCodepush = _package => {
    // setPackageToInstall(_package);

    CodePush.sync(
      {installMode: CodePush.InstallMode.IMMEDIATE},
      SyncStatus => {
        switch (SyncStatus) {
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            console.log('CODEPUSH_BUNDLE_DOWNLOADING');
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            console.log('CODEPUSH_BUNDLE_INSTALLING');
            break;
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            console.log('CODEPUSH_INSTALLED_UPDATE');
            CodePush.restartApp();
            break;
          case CodePush.SyncStatus.UNKNOWN_ERROR:
            setPackageToInstall(null);
          default:
            break;
        }
      },
      ({receivedBytes, totalBytes}) => {
        const progress = Math.min((receivedBytes / totalBytes) * 100, 100);
        const formattedProgress = progress.toFixed(2);
        setCodePushProgress(parseInt(formattedProgress));
      },
    );
  };

  const checkForUpdatesCodepush = async () => {
    updateAppCodepush();
  };

  useEffect(() => {
    checkForUpdatesCodepush();
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'background') checkForUpdatesCodepush();
      },
    );
    return () => {
      appStateListener.remove();
    };
  }, []);

  return (
    <>
      {codePushProgress ? (
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={{padding: 20}}>
              <Text style={{color: 'white', fontWeight: '600'}}>
                CodePush update progress: {codePushProgress}%
              </Text>
            </View>
          </SafeAreaView>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: WIDTH,
    height: HEIGHT,
    zIndex: 9 * 1000000,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  safeArea: {
    width: '100%',
    backgroundColor: '#765BE2',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
  },
});

export default CodePushService;
