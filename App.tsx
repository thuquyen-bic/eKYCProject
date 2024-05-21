/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  SafeAreaView,
  FlatList,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  CameraMode,
  EkycConfig,
  FaceChallengeMode,
  FlowType,
  SdkType,
  startNormalEkyc,
  startUIOnlyEkyc,
  UiFlowType,
  UserIdType,
} from './src/ekyc';
import {
  AdvancedLivenessConfig,
  FontConfig,
  IdCardType,
  NfcUiConfig,
} from './src/ekyc/config/EkycConfig';

const {EkycTracker} = NativeModules;
const eventEmitter = new NativeEventEmitter(EkycTracker);
var trackingLogs: string[] = [];

function App() {
  const [isResultModalVisible, setResultModalVisible] = useState(false);
  const [isTrackingLogVisible, setTrackingLogVisible] = useState(false);
  const [ekycResult, setEkycResult] = useState<any>();

  const [normalFlow, setNormalFlow] = useState('EKYC_FULL');
  const [uiFlow, setUiFlow] = useState('ID_CARD_FRONT');
  const [sdkType, setSdkType] = useState('NORMAL');
  const [faceChallengeMode, setFaceChallengeMode] = useState('restricted');

  const [isShowAutoCaptureButton, setShowAutoCaptureButton] = useState(true);
  const [autoCaptureMode, setAutoCaptureMode] = useState(true);
  const [isDebug, setDebug] = useState(false);
  const [isShowHelp, setShowHelp] = useState(true);
  const [isEnableVoiceHelp, setEnableVoiceHelp] = useState(true);
  const [flashMode, setFlashMode] = useState(true);
  const [isDefaultBackground, setDefaultBackground] = useState(true);
  const [isDefaultPopupBackground, setDefaultPopupBackground] = useState(true);
  const [isDefaultButtonColor, setDefaultButtonColor] = useState(true);
  const [isDefaultText, setDefaultText] = useState(true);
  const [isSkipConfirmScreen, setSkipConfirmScreen] = useState(false);
  const [isImageId, setImageId] = useState(false);
  const [isCacheImage, setCacheImage] = useState(false);
  const [isCacheVideo, setCacheVideo] = useState(false);
  const [isSmallButtonRadius, setSmallButtonRadius] = useState(false);
  const [isTestFont, setTestFont] = useState(false);
  const [zoomLevel, setZoomLevel] = useState('1.0');
  const [iouThreshold, setIouThreshold] = useState('0.92');
  const [iouCaptureTime, setIouCaptureTime] = useState('1000');
  const [idCardBoxPercentage, setIdCardBoxPercentage] = useState('0.025');

  // Authentication
  const [proxyUrl, setProxyUrl] = useState('http://ekyc.spower.asia');
  const [token, setToken] = useState('7d9cbfdc4a7408b3614fb2e968a3e4f5');
  const [requestId, setRequestId] = useState('');
  const [xRequestId, setXRequestId] = useState('');
  const [clientCode, setClientCode] = useState('spower');
  const [userId, setUserId] = useState('0905757202');
  const [userIdType, setUserIdType] = useState('PHONE_NUM_TYPE'); // PHONE_NUM_TYPE' | 'IDCARD_ID_TYPE

  // Card config
  const [isCardQualityCheck, setCardQualityCheck] = useState(true);
  const [isCardSpoofCheck, setCardSpoofCheck] = useState(true);
  const [isIdCardAbbr, setIsIdCardAbbr] = useState(true);
  const [idCardMinRatio, setIdCardMinRatio] = useState('0.6');
  const [cardRetakeLimit, setCardRetakeLimit] = useState('10');
  const [frontIdCardId, setFrontIdCardId] = useState('j21sss21321e3');
  const [idCardCameraMode, setIdCardCameraMode] = useState('BACK'); //'FRONT' | 'BACK'
  //'CMND' | 'CCCD' | 'PASSPORT' | 'BLX' | 'CMQD';
  const [idCardTypes, setIdCardTypes] = useState([
    {
      id: 1,
      name: 'CMND',
      checked: true,
    },
    {
      id: 2,
      name: 'CCCD',
      checked: true,
    },
    {
      id: 3,
      name: 'PASSPORT',
      checked: false,
    },
    {
      id: 4,
      name: 'BLX',
      checked: false,
    },
    {
      id: 5,
      name: 'CMQD',
      checked: false,
    },
  ]);

  // Face config
  const [isFaceSearch, setFaceSearch] = useState(false);
  const [isFaceSave, setFaceSave] = useState(false);
  const [isFaceUpdate, setFaceUpdate] = useState(false);
  const [isFaceQuality, setFaceQuality] = useState(true);
  const [isFaceLiveness, setFaceLiveness] = useState(true);
  const [faceRetakeLimit, setFaceRetakeLimit] = useState('10');
  const [faceMinRatio, setFaceMinRatio] = useState('0.25');
  const [faceMaxRatio, setFaceMaxRatio] = useState('0.7');
  const [selfieCameraMode, setSelfieCameraMode] = useState('FRONT'); //'FRONT' | 'BACK'

  // Face advanced config
  const [isAdvancedLiveness, setAdvancedLiveness] = useState(true);
  const [isAdvancedLivenessFaceMatching, setAdvancedLivenessFaceMatching] =
    useState(false);
  const [leftAngle, setLeftAngle] = useState('30');
  const [rightAngle, setRightAngle] = useState('30');
  const [challengeRetakeLimit, setChallengeRetakeLimit] = useState('4');
  const [advancedDuration, setAdvancedDuration] = useState('20');
  const [faceGuideUrl, setFaceGuideUrl] = useState(
    'https://api24cdn.vtmoney.vn/vtmoney3.mov',
  );

  // NFC config
  const [isNfcChipVerify, setNfcChipVerify] = useState(false);
  const [isNfc, setNfc] = useState(false);
  const [nfcCardNumber, setNfcCardNumber] = useState('038096005533');
  const [nfcBirthDate, setNfcBirthDate] = useState('07/08/1996');
  const [nfcExpiredDate, setNfcExpiredDate] = useState('07/08/2036');

  const toggleCheckbox = (name: string, value: boolean) => {
    const data = [...idCardTypes];
    const item = data.find(item => item.name === name);
    if (item) {
      item.checked = value;
    }

    setIdCardTypes(data);
  };

  useEffect(() => {
    const subscription = eventEmitter.addListener(
      'trackEvent',
      (res: string) => {
        console.log(res);
        trackingLogs.push(res);
      },
    );

    return () => {
      subscription?.remove?.();
      // eventEmitter?.removeAllListeners?.('trackEvent');
    };
  }, []);

  const openResultModal = () => {
    setResultModalVisible(true);
  };

  const openTrackingLogModal = () => {
    console.log(trackingLogs);
    setTrackingLogVisible(true);
  };

  const openEkyc = () => {
    trackingLogs = [];

    const advancedConfig: AdvancedLivenessConfig = {
      leftAngle: parseInt(leftAngle),
      rightAngle: parseInt(rightAngle),
      challengeRetakeLimit: parseInt(challengeRetakeLimit),
      duration: parseInt(advancedDuration),
    };

    const nfcUiConfig: NfcUiConfig = {
      idNumber: nfcCardNumber,
      expiredDate: nfcExpiredDate,
      birthDate: nfcBirthDate,
    };

    const idCardTypesStr = idCardTypes
      .filter(item => item.checked)
      .map(item => item.name as IdCardType);

    const fontConfig: FontConfig = {
      regularFontName: 'RobotoMono-Regular',
      regularFontSize: 14,
      boldFontName: 'RobotoMono-Bold',
      boldFontSize: 14,
    };

    const config: EkycConfig = {
      advancedGuideVideoUrl: faceGuideUrl,
      advancedLivenessConfig: advancedConfig,
      autoCaptureMode: autoCaptureMode,
      backgroundColor: isDefaultBackground ? '#66000000' : '#FFB84C',
      buttonColor: isDefaultButtonColor ? '#EE0033' : '#FFB84C',
      popupBackgroundColor: isDefaultPopupBackground ? '#EFEFEE' : '#EDE7F6',
      textColor: isDefaultText ? '#FFFFFF' : '#1B9C85',
      cardRetakeLimit: parseInt(cardRetakeLimit),
      clientCode: clientCode,
      enableVoiceHelp: isEnableVoiceHelp,
      faceMaxRatio: parseFloat(faceMaxRatio),
      faceMinRatio: parseFloat(faceMinRatio),
      faceRetakeLimit: parseInt(faceRetakeLimit),
      flash: flashMode,
      flowType: normalFlow as FlowType,
      frontIdCardId: frontIdCardId,
      idCardAbbr: isIdCardAbbr,
      idCardBoxPercentage: parseFloat(idCardBoxPercentage),
      idCardCameraMode: idCardCameraMode as CameraMode,
      idCardMinRatio: parseFloat(idCardMinRatio),
      idCardTypes: idCardTypesStr,
      isAdvancedLiveness: isAdvancedLiveness,
      isAdvancedMatching: isAdvancedLivenessFaceMatching,
      isCacheImage: isCacheImage,
      isCardQualityCheck: isCardQualityCheck,
      isCardSpoofCheck: isCardSpoofCheck,
      isDebug: isDebug,
      isFaceLiveness: isFaceLiveness,
      isFaceQuality: isFaceQuality,
      isFaceSave: isFaceSave,
      isFaceSearch: isFaceSearch,
      isFaceUpdate: isFaceUpdate,
      isImageId: isImageId,
      isNfc: isNfc,
      isSaveVideo: isCacheVideo,
      nfcUiConfig: nfcUiConfig,
      nfcVerifyOption: isNfcChipVerify ? 'CHIP_DATA_VERIFY' : 'FACE_VERIFY',
      proxyUrl: proxyUrl,
      requestId: requestId,
      sdkType: sdkType as SdkType,
      selfieCameraMode: selfieCameraMode as CameraMode,
      showAutoCaptureButton: isShowAutoCaptureButton,
      showHelp: isShowHelp,
      skipConfirmScreen: isSkipConfirmScreen,
      uiFlowType: uiFlow as UiFlowType,
      userId: userId,
      userIdType: userIdType as UserIdType,
      xRequestId: xRequestId,
      zoom: parseFloat(zoomLevel),
      token: token,
      iouThreshold: parseFloat(iouThreshold),
      iouCaptureTime: parseInt(iouCaptureTime),
      fontConfig: isTestFont ? fontConfig : null,
      buttonCornerRadius: isSmallButtonRadius ? 12 : null,
      faceChallengeMode: faceChallengeMode as FaceChallengeMode,
    };

    if (sdkType == 'UI_ONLY') {
      startUIOnlyEkyc(config)
        .then(result => {
          console.log('UI_ONLY', result);

          setEkycResult(result);
          // setResultModalVisible(true);
        })
        .catch(err => {
          console.log('Error: ', err);
        });
    } else {
      startNormalEkyc(config)
        .then(result => {
          setEkycResult(result);
          console.log('startNormalEkyc', result);

          // setResultModalVisible(true);
        })
        .catch(err => {
          console.log('Error: ', err);
        });
    }
  };

  const UIResultView = () => {
    const ekycResultCopy = {...ekycResult};

    const localCroppedImage = ekycResultCopy.localCroppedImage;
    const localFullImage = ekycResultCopy.localFullImage;
    const videoPath = ekycResultCopy.videoPath;

    let left = null;
    let right = null;

    if (
      ekycResult.advanceImageDataList &&
      ekycResultCopy.advanceImageDataList.length > 0
    ) {
      left = ekycResultCopy.advanceImageDataList[0].localImage;
      right = ekycResultCopy.advanceImageDataList[1].localImage;

      ekycResultCopy.advanceImageDataList[0].localImage = '';
      ekycResultCopy.advanceImageDataList[1].localImage = '';
    }

    ekycResultCopy.localCroppedImage = '';
    ekycResultCopy.localFullImage = '';
    ekycResultCopy.videoPath = '';

    return (
      <View>
        <Text>{JSON.stringify(ekycResultCopy)}</Text>
        <Text>{videoPath}</Text>

        {localCroppedImage ? (
          <View>
            <Text>{'Cropped Image'}</Text>
            <Image
              style={styles.image}
              source={{uri: `data:image/png;base64,${localCroppedImage}`}}
            />
          </View>
        ) : (
          <View />
        )}
        {localFullImage ? (
          <View>
            <Text>{'Full Image'}</Text>
            <Image
              style={styles.image}
              source={{uri: `data:image/png;base64,${localFullImage}`}}
            />
          </View>
        ) : (
          <View />
        )}
        {left ? (
          <View>
            <Text>{'Left'}</Text>
            <Image
              style={styles.image}
              source={{uri: `data:image/png;base64,${left}`}}
            />
          </View>
        ) : (
          <View />
        )}
        {right ? (
          <View>
            <Text>{'Right'}</Text>
            <Image
              style={styles.image}
              source={{uri: `data:image/png;base64,${right}`}}
            />
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  };

  const NormalResultView = () => {
    const ekycResultCopy = {...ekycResult};

    const localFrontCardFullImage = ekycResultCopy.localFrontCardFullImage;
    const localBackCardFullImage = ekycResultCopy.localBackCardFullImage;
    const localFaceFullImage = ekycResultCopy.localFaceFullImage;
    const localFrontIdCardUploadImage =
      ekycResultCopy.localFrontIdCardUploadImage;
    const localBackIdCardUploadImage =
      ekycResultCopy.localBackIdCardUploadImage;
    const localFaceUploadImage = ekycResultCopy.localFaceUploadImage;
    const videoPath = ekycResultCopy.videoPath;

    ekycResultCopy.localFrontCardFullImage = '';
    ekycResultCopy.localBackCardFullImage = '';
    ekycResultCopy.localFaceFullImage = '';
    ekycResultCopy.localFrontIdCardUploadImage = '';
    ekycResultCopy.localBackIdCardUploadImage = '';
    ekycResultCopy.localFaceUploadImage = '';
    ekycResultCopy.videoPath = '';

    return (
      <View>
        <Text>{JSON.stringify(ekycResultCopy)}</Text>

        <Text>{videoPath}</Text>

        {localFrontCardFullImage ? (
          <View>
            <Text>{'localFrontCardFullImage'}</Text>
            <Image
              style={styles.image}
              source={{uri: `data:image/png;base64,${localFrontCardFullImage}`}}
            />
          </View>
        ) : (
          <View />
        )}
        {localBackCardFullImage ? (
          <View>
            <Text>{'localBackCardFullImage'}</Text>
            <Image
              style={styles.image}
              source={{uri: `data:image/png;base64,${localBackCardFullImage}`}}
            />
          </View>
        ) : (
          <View />
        )}
        {localFaceFullImage ? (
          <View>
            <Text>{'localFaceFullImage'}</Text>
            <Image
              style={styles.image}
              source={{uri: `data:image/png;base64,${localFaceFullImage}`}}
            />
          </View>
        ) : (
          <View />
        )}
        {localFrontIdCardUploadImage ? (
          <View>
            <Text>{'localFrontIdCardUploadImage'}</Text>
            <Image
              style={styles.image}
              source={{
                uri: `data:image/png;base64,${localFrontIdCardUploadImage}`,
              }}
            />
          </View>
        ) : (
          <View />
        )}
        {localBackIdCardUploadImage ? (
          <View>
            <Text>{'localBackIdCardUploadImage'}</Text>
            <Image
              style={styles.image}
              source={{
                uri: `data:image/png;base64,${localBackIdCardUploadImage}`,
              }}
            />
          </View>
        ) : (
          <View />
        )}
        {localFaceUploadImage ? (
          <View>
            <Text>{'localFaceUploadImage'}</Text>
            <Image
              style={styles.image}
              source={{uri: `data:image/png;base64,${localFaceUploadImage}`}}
            />
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
          <View style={{padding: 16}}>
            <Button onPress={openEkyc} title={'Open Ekyc'} />
          </View>
          <Button onPress={openResultModal} title={'Open Result Modal'} />
          <Button onPress={openTrackingLogModal} title={'Open Tracking Logs'} />
          <View style={{flex: 2, backgroundColor: 'lightpink'}}>
            <Text style={styles.titleText}>Config Chung của SDK</Text>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Normal Flow Type</Text>
            </View>
            <View>
              <Picker
                selectedValue={normalFlow}
                onValueChange={(itemValue, _) => setNormalFlow(itemValue)}>
                <Picker.Item
                  label="EKYC_FULL"
                  value="EKYC_FULL"
                  key="EKYC_FULL"
                />
                <Picker.Item
                  label="FACE_FULL"
                  value="FACE_FULL"
                  key="FACE_FULL"
                />
                <Picker.Item
                  label="ID_CARD_FULL"
                  value="ID_CARD_FULL"
                  key="ID_CARD_FULL"
                />
                <Picker.Item
                  label="ID_CARD_FRONT"
                  value="ID_CARD_FRONT"
                  key="ID_CARD_FRONT"
                />
                <Picker.Item
                  label="ID_CARD_BACK"
                  value="ID_CARD_BACK"
                  key="ID_CARD_BACK"
                />
                <Picker.Item
                  label="FACE_SEARCH"
                  value="FACE_SEARCH"
                  key="FACE_SEARCH"
                />
              </Picker>
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Ui Flow Type</Text>
            </View>
            <View>
              <Picker
                selectedValue={uiFlow}
                onValueChange={(itemValue, _) => setUiFlow(itemValue)}>
                <Picker.Item label="ID_CARD_FRONT" value="ID_CARD_FRONT" />
                <Picker.Item label="ID_CARD_BACK" value="ID_CARD_BACK" />
                <Picker.Item label="FACE_BASIC" value="FACE_BASIC" />
                <Picker.Item label="FACE_ADVANCED" value="FACE_ADVANCED" />
                <Picker.Item label="UI_NFC" value="UI_NFC" />
              </Picker>
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>SDK Type</Text>
            </View>
            <View>
              <Picker
                selectedValue={sdkType}
                onValueChange={(itemValue, _) => setSdkType(itemValue)}>
                <Picker.Item label="NORMAL" value="NORMAL" />
                <Picker.Item label="UI_ONLY" value="UI_ONLY" />
              </Picker>
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Face Challenge Mode</Text>
            </View>
            <View>
              <Picker
                selectedValue={faceChallengeMode}
                onValueChange={(itemValue, _) =>
                  setFaceChallengeMode(itemValue)
                }>
                <Picker.Item label="restricted" value="restricted" />
                <Picker.Item label="unrestricted" value="unrestricted" />
              </Picker>
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Show Auto Capture Button</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isShowAutoCaptureButton ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setShowAutoCaptureButton(value)}
                value={isShowAutoCaptureButton}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Auto Capture Mode:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={autoCaptureMode ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setAutoCaptureMode(value)}
                value={autoCaptureMode}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Debug:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isDebug ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setDebug(value)}
                value={isDebug}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Show Help:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isShowHelp ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setShowHelp(value)}
                value={isShowHelp}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Enable Voice Help:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnableVoiceHelp ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setEnableVoiceHelp(value)}
                value={isEnableVoiceHelp}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Flash Mode On:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={flashMode ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setFlashMode(value)}
                value={flashMode}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Default Background:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isDefaultBackground ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setDefaultBackground(value)}
                value={isDefaultBackground}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Default Popup Background Color:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isDefaultPopupBackground ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setDefaultPopupBackground(value)}
                value={isDefaultPopupBackground}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Default Button Color:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isDefaultButtonColor ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setDefaultButtonColor(value)}
                value={isDefaultButtonColor}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Default Text:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isDefaultText ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setDefaultText(value)}
                value={isDefaultText}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Skip Confirm Screen:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isSkipConfirmScreen ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setSkipConfirmScreen(value)}
                value={isSkipConfirmScreen}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Image Id:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isImageId ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setImageId(value)}
                value={isImageId}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Cache Image:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isCacheImage ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setCacheImage(value)}
                value={isCacheImage}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Save Video:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isCacheVideo ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setCacheVideo(value)}
                value={isCacheVideo}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Test Small Button Radius:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isSmallButtonRadius ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setSmallButtonRadius(value)}
                value={isSmallButtonRadius}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Test Another Font:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isTestFont ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setTestFont(value)}
                value={isTestFont}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Zoom Level:</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setZoomLevel(text)}
                value={zoomLevel}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>lOU Threshold:</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setIouThreshold(text)}
                value={iouThreshold}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>IOU capture time:</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setIouCaptureTime(text)}
                value={iouCaptureTime}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>IdCard Capture Box</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setIdCardBoxPercentage(text)}
                value={idCardBoxPercentage}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={{flex: 2, backgroundColor: 'lightpink'}}>
            <Text style={styles.titleText}>Config Authentication</Text>
          </View>
          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Proxy Url</Text>
            </View>
            <View>
              <TextInput
                onChangeText={text => setProxyUrl(text)}
                value={proxyUrl}
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Client Code</Text>
            </View>
            <View>
              <TextInput
                onChangeText={text => setClientCode(text)}
                value={clientCode}
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Token</Text>
            </View>
            <View>
              <TextInput
                onChangeText={text => setToken(text)}
                value={token}
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Request Id</Text>
            </View>
            <View>
              <TextInput
                onChangeText={text => setRequestId(text)}
                value={requestId}
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>X Request Id</Text>
            </View>
            <View>
              <TextInput
                onChangeText={text => setXRequestId(text)}
                value={xRequestId}
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>User Id</Text>
            </View>
            <View>
              <TextInput
                onChangeText={text => setUserId(text)}
                value={userId}
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>User Id Type</Text>
            </View>
            <View>
              <Picker
                selectedValue={userIdType}
                onValueChange={(itemValue, _) => setUserIdType(itemValue)}>
                <Picker.Item label="PHONE_NUM_TYPE" value="PHONE_NUM_TYPE" />
                <Picker.Item label="IDCARD_ID_TYPE" value="IDCARD_ID_TYPE" />
              </Picker>
            </View>
          </View>

          <View style={{flex: 2, backgroundColor: 'lightpink'}}>
            <Text style={styles.titleText}>Config Card</Text>
          </View>
          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Choose Id Card Types</Text>
            </View>
            {idCardTypes.map(cb => {
              return (
                <View style={{flexDirection: 'row'}}>
                  <CheckBox
                    id={cb.name}
                    key={cb.id}
                    value={cb.checked}
                    onValueChange={value => toggleCheckbox(cb.name, value)}
                  />
                  <Text>{cb.name}</Text>
                </View>
              );
            })}
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Card Camera </Text>
            </View>
            <View>
              <Picker
                selectedValue={idCardCameraMode}
                onValueChange={(itemValue, _) =>
                  setIdCardCameraMode(itemValue)
                }>
                <Picker.Item label="FRONT" value="FRONT" />
                <Picker.Item label="BACK" value="BACK" />
              </Picker>
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Card Quality Check:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isCardQualityCheck ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setCardQualityCheck(value)}
                value={isCardQualityCheck}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Card Spoof Check:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isCardSpoofCheck ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setCardSpoofCheck(value)}
                value={isCardSpoofCheck}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Card Abbr:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isIdCardAbbr ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setIsIdCardAbbr(value)}
                value={isIdCardAbbr}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Card Retake Limit</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setCardRetakeLimit(text)}
                value={cardRetakeLimit}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Card Min Ratio</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setIdCardMinRatio(text)}
                value={idCardMinRatio}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Front Card Image Id</Text>
            </View>
            <View>
              <TextInput
                onChangeText={text => setFrontIdCardId(text)}
                value={frontIdCardId}
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={{flex: 2, backgroundColor: 'lightpink'}}>
            <Text style={styles.titleText}>Config Face</Text>
          </View>
          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Face Quality Check:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isFaceQuality ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setFaceQuality(value)}
                value={isFaceQuality}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Liveness:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isFaceLiveness ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setFaceLiveness(value)}
                value={isFaceLiveness}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Face Search:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isFaceSearch ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setFaceSearch(value)}
                value={isFaceSearch}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Face Save:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isFaceSave ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setFaceSave(value)}
                value={isFaceSave}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Face Update:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isFaceUpdate ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setFaceUpdate(value)}
                value={isFaceUpdate}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Selfie Camera</Text>
            </View>
            <View>
              <Picker
                selectedValue={selfieCameraMode}
                onValueChange={(itemValue, _) =>
                  setSelfieCameraMode(itemValue)
                }>
                <Picker.Item label="FRONT" value="FRONT" />
                <Picker.Item label="BACK" value="BACK" />
              </Picker>
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Face Retake Limit</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setFaceRetakeLimit(text)}
                value={faceRetakeLimit}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Face Min Ratio</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setFaceMinRatio(text)}
                value={faceMinRatio}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Face Max Ratio</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setFaceMaxRatio(text)}
                value={faceMaxRatio}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={{flex: 2, backgroundColor: 'lightpink'}}>
            <Text style={styles.titleText}>Config Advanced Face</Text>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Advanced Liveness:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isAdvancedLiveness ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setAdvancedLiveness(value)}
                value={isAdvancedLiveness}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Advanced Liveness FaceMatching:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={
                  isAdvancedLivenessFaceMatching ? '#f5dd4b' : '#f4f3f4'
                }
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setAdvancedLivenessFaceMatching(value)}
                value={isAdvancedLivenessFaceMatching}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Left Angle</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setLeftAngle(text)}
                value={leftAngle}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Right Angle</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setRightAngle(text)}
                value={rightAngle}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Challenge Retake Limit</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setChallengeRetakeLimit(text)}
                value={challengeRetakeLimit}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Advanced Liveness Duration</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={text => setAdvancedDuration(text)}
                value={advancedDuration}
                keyboardType="numeric"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'column'}]}>
            <View>
              <Text>Advanced Guide - Video URL</Text>
            </View>
            <View>
              <TextInput
                onChangeText={text => setFaceGuideUrl(text)}
                value={faceGuideUrl}
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={{flex: 2, backgroundColor: 'lightpink'}}>
            <Text style={styles.titleText}>Config NFC</Text>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Nfc Chip Data Verify:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isNfcChipVerify ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setNfcChipVerify(value)}
                value={isNfcChipVerify}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Is NFC:</Text>
            </View>
            <View style={{flex: 1}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isNfc ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => setNfc(value)}
                value={isNfc}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>NFC ID Card Number</Text>
            </View>
            <View style={{flex: 2}}>
              <TextInput
                onChangeText={text => setNfcCardNumber(text)}
                value={nfcCardNumber}
                keyboardType="default"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Birthday dd/mm/yyyy</Text>
            </View>
            <View style={{flex: 2}}>
              <TextInput
                onChangeText={text => setNfcBirthDate(text)}
                value={nfcBirthDate}
                keyboardType="default"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={[styles.child, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <Text>Expired Date dd/mm/yyyy</Text>
            </View>
            <View style={{flex: 2}}>
              <TextInput
                onChangeText={text => setNfcExpiredDate(text)}
                value={nfcExpiredDate}
                keyboardType="default"
                style={styles.inputStyle}
              />
            </View>
          </View>

          <View style={{height: 300}} />

          <Modal
            animationType="slide"
            transparent={true}
            visible={isResultModalVisible}
            onRequestClose={() => {
              setResultModalVisible(!isResultModalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ScrollView>
                  {sdkType == 'NORMAL' ? (
                    <NormalResultView />
                  ) : (
                    <UIResultView />
                  )}
                </ScrollView>
                <View style={{height: 16}} />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setResultModalVisible(!isResultModalVisible)}>
                  <Text>Hide Popup</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isTrackingLogVisible}
            onRequestClose={() => {
              setTrackingLogVisible(!isTrackingLogVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <FlatList
                  data={trackingLogs}
                  renderItem={({item}) => (
                    <Text style={styles.item}>
                      'timestamp: ' + item.timestamp + '\n' + 'objectName: ' +
                      item.objectName + '\n' + 'eventSrc: ' + item.eventSrc +
                      '\n' + 'objectType: ' + item.objectType + '\n' + 'action:
                      ' + item.action + '\n' + 'eventValue: ' +
                      JSON.stringify(item.eventValue, null, 2) +
                      '\n-------------'
                    </Text>
                  )}
                />
                <View style={{height: 16}} />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setTrackingLogVisible(!isTrackingLogVisible)}>
                  <Text>Hide Popup</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: 'white',
  },

  child: {
    padding: 8,
  },

  titleText: {
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },

  inputStyle: {
    borderWidth: 1,
    height: 28,
    padding: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  image: {
    width: 120,
    height: 120,
  },
});

export default App;
