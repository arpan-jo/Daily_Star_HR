import {useNavigation} from '@react-navigation/native';
import React, { useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View} from 'react-native';
// import RNCallKeep from 'react-native-callkeep';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';

// import {makeCall, sessionCancel} from '../../sip_service/SipService';
import {COLORS} from '../../../../common/constant/Themes';

const edges: Edge[] = ['right', 'left'];

const DialPadWithContacts = () => {
  const navigation = useNavigation();
  const [number, setNumber] = useState('');

  const handlePress = (digit: string) => {
    setNumber(prev => prev + digit);
  };

  const handleDelete = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  // useEffect(() => {
  //   const setupCallKeepAndSIP = async () => {
  //     try {
  //       await setupCallKeepAndSIPFunc();

  //       RNCallKeep.addEventListener('didDisplayIncomingCall', data => {
  //         console.log('Incoming call displayed', data);
  //       });
  //       RNCallKeep.addEventListener('endCall', data => {
  //         // sessionCancel();
  //         setNumber('');
  //         RNCallKeep.endAllCalls();
  //         // RNCallKeep.clearInitialEvents();
  //       });
  //       RNCallKeep.addEventListener('answerCall', data => {
  //         RNCallKeep.setCurrentCallActive(data?.callUUID);
  //       });
  //       RNCallKeep.addEventListener('didReceiveStartCallAction', data => {
  //         console.log('Start call action ', data);
  //       });
  //     } catch (error) {
  //       // sessionCancel();
  //     }
  //   };
  //   setupCallKeepAndSIP();
  //   return () => {
  //     RNCallKeep.removeEventListener('didDisplayIncomingCall');
  //     RNCallKeep.removeEventListener('didReceiveStartCallAction');
  //     RNCallKeep.removeEventListener('endCall');
  //     RNCallKeep.removeEventListener('answerCall');
  //   };
  // }, []);

  return (
    <ContainerNew
      style={{
        backgroundColor: 'white',
        padding: 16,
        flex: 1,
      }}
      edges={edges}
      isRefresh={false}
      header={
        <CustomHeader
          coreModulesIcon={true}
          coreModulesIconPress={() => navigation.goBack()}
          title="Dial Pad"
        />
      }>
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        {/* Display typed number */}
        <View>
          <TextInput
            style={[
              styles.input,
              {color: COLORS.textNewColor, borderColor: COLORS.white},
            ]}
            value={number}
            editable={false}
            placeholder="Enter number"
          />

          <TouchableOpacity
            onPress={handleDelete}
            style={{
              position: 'absolute',
              right: 8,
              top: 13.5,
            }}>
            <Icon name={'close'} color={'gray'} size={30} />
          </TouchableOpacity>
        </View>

        {/* Dial Pad */}
        <View style={styles.dialPad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(
            digit => (
              <TouchableOpacity
                key={digit}
                style={[styles.key, {backgroundColor: COLORS.lightGray7}]}
                onPress={() => handlePress(digit)}>
                <Text style={[styles.keyText, {color: 'black'}]}>{digit}</Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => {
              // makeCall(number?.toString(), number, '');
            }}
            style={[
              styles.actionBtn,
              {
                backgroundColor: '#28a745',
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <MIcon name={'call'} color={'white'} size={25} />
            <Text style={{color: '#fff', paddingLeft: 6}}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ContainerNew>
  );
};

export default DialPadWithContacts;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  input: {
    fontSize: 24,
    textAlign: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    // marginTop: 30,
  },
  dialPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    height: 350,
  },
  key: {
    width: '30%',
    margin: '1.5%',
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
  },
  contactItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
  },
});
