import React from 'react';
import { View, TextInput, Text, Keyboard, TouchableOpacity } from 'react-native';

export default class Index extends React.Component {
  render() {
    const { onConfirm, godUrl, setUrl, godModelStatus, onCancel } = this.props;
    return (
      <View
        style={{
          position: 'absolute',
          zIndex: 100,
          top: 0,
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          height: '100%',
          alignItems: 'center',
          paddingTop: '50%',
        }}
      >
        <View
          style={{
            width: '80%',
            backgroundColor: '#fff',
            alignContent: 'space-between',
          }}
        >
          <Text style={{ color: '#333', paddingLeft: 10, fontSize: 20 }}>上帝模式</Text>
          <TextInput
            placeholder="测试地址"
            value={godUrl}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
            onChangeText={value => setUrl({ godModelStatus, godUrl: value })}
            style={{ borderWidth: 0.5, height: 50 }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                height: 40,
                backgroundColor: '#f44',
              }}
            >
              <Text style={{ color: '#fff' }}>关闭</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfirm(godUrl)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                height: 40,
                backgroundColor: '#4b0',
              }}
            >
              <Text style={{ color: '#fff' }}>启用</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
