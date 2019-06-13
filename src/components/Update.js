import React from 'react';
import { Platform, View, Text, Image, StyleSheet, Linking, NativeModules, DeviceEventEmitter, AppState, NetInfo } from 'react-native';
import CodePush from 'react-native-code-push';

import { connect } from 'react-redux';
import updateVersion from '../actions/updateVersion';

class UpdateComponent extends React.Component {
  state = {
    currProgress: 0,
    syncMessage: '',
    disabledBtn: false,
  };

  downloadStatus = 0;

  // 0未下载 1下载中 2下载完成 3下载失败
  netStatus = '';

  componentWillMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    NetInfo.addEventListener('connectionChange', this._handleFirstConnectivityChange);
  }

  componentWillUnmount() {
    CodePush.allowRestart();
    AppState.removeEventListener('change', this._handleAppStateChange);
    NetInfo.removeEventListener('connectionChange', this._handleFirstConnectivityChange);
  }

  _handleFirstConnectivityChange = ({ type }) => {
    if (this.netStatus !== '' && this.netStatus !== type) {
      if (this.downloadStatus === 1) {
        this.confirm();
      }
    }
    this.netStatus = type;
  };

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active' && this.updated === true) {
      this.setState({
        syncMessage: '',
        disabledBtn: false,
      });
    }
  };

  confirm() {
    this.downloadStatus = 1;
    this.updated = false;
    this.setState({ currProgress: 0 });
    const { url, hotUpdate, downloadType } = this.props;
    if (hotUpdate) {
      CodePush.sync(
        {
          // 安装模式
          // ON_NEXT_RESUME 下次恢复到前台时
          // ON_NEXT_RESTART 下一次重启时
          // IMMEDIATE 马上更新
          installMode: CodePush.InstallMode.ON_NEXT_RESUME,
        },
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgress.bind(this)
      );
    } else if (downloadType === 2 && Platform.OS !== 'ios') {
      NativeModules.upgrade.upgrade(url);
      this.setState({
        syncMessage: '下载更新包中...',
        disabledBtn: true,
      });
      DeviceEventEmitter.addListener('LOAD_PROGRESS', msg => {
        if (msg === 100) {
          this.updated = true;
          this.downloadStatus = 2;
        }
        this.setState({ currProgress: msg });
      });
    } else {
      Linking.openURL(url);
    }
  }

  codePushStatusDidChange(syncStatus) {
    console.log('-codePushStatusDidChange-');
    console.log(syncStatus);
    const { cancel } = this.props;
    const syncMessage = '';
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({
          syncMessage: '正在检查更新...',
        });
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({
          syncMessage: '下载更新包中...',
          disabledBtn: true,
        });
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({
          syncMessage: '等待选择更新...',
        });
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({
          syncMessage: '安装更新中...',
        });
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({
          syncMessage: '更新成功...',
        });
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({
          syncMessage: '用户取消更新...',
        });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState(
          {
            syncMessage: '安装成功,等待重启!',
          },
          () => {
            cancel();
          }
        );
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({
          showUpdate: false,
          syncMessage: '更新出错，请重启应用！',
        });
        break;
    }
    console.log(syncMessage);
  }

  codePushDownloadDidProgress(progress) {
    console.log('-codePushDownloadDidProgress------');
    console.log(progress);
    const temp = (parseFloat(progress.receivedBytes / progress.totalBytes) * 100).toFixed(2);
    this.setState({ currProgress: temp });
  }

  render() {
    const { status, msg, cancel } = this.props;
    const { currProgress, syncMessage, disabledBtn } = this.state;
    let view = null;
    if (status !== 0) {
      view = (
        <View style={styles.tostBg}>
          <View style={styles.tostContent}>
            <Image style={styles.tostImg} source={{ uri: 'http://family-img.vxiaoke360.com/version-img.png' }} />
            <Text style={styles.tostInfo}>{syncMessage ? `${syncMessage}${currProgress}%` : msg}</Text>
            {!disabledBtn && (
              <View style={styles.toastBtn}>
                {status === 2 ? null : (
                  <Text style={styles.toastBtn1} onPress={() => cancel()}>
                    取消
                  </Text>
                )}
                <Text style={[styles.toastBtn1, styles.confirmBtn]} onPress={() => this.confirm()}>
                  确定
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }
    return view;
  }
}

export default connect(
  state => ({
    status: state.updateVersion.status,
    msg: state.updateVersion.msg,
    url: state.updateVersion.url,
    hotUpdate: state.updateVersion.hotUpdate,
    downloadType: state.updateVersion.downloadType,
  }),
  dispatch => ({
    cancel: () => dispatch(updateVersion({ status: 0 })),
  })
)(UpdateComponent);

const styles = StyleSheet.create({
  version: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999999',
  },
  tostBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1200,
    elevation: 1200,
  },
  tostContent: {
    width: 270,
    marginTop: -100,
  },
  tostImg: {
    width: '100%',
    height: 186,
  },
  tostInfo: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'center',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    backgroundColor: '#fff',
  },
  toastBtn: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#DDD',
    borderTopWidth: 0.5,
    backgroundColor: '#fff',
  },
  toastBtn1: {
    flex: 1,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    lineHeight: 48,
    textAlign: 'center',
  },
  confirmBtn: {
    color: '#EA4457',
    borderLeftColor: '#DDD',
    borderLeftWidth: 0.5,
  },
});
