import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { getReceiving, getStoreOrderDetail } from '../../services/api';
import OrderDetail from '../../components/OrderDetail';
import ReceivingModal from '../../components/ReceivingModal';

export default class StoreOrderDetail extends Component {
  static navigationOptions = {
    title: '订单详情',
  }

  state = {
    data: {},
    orderId: '',
    isReceivingModal: false,
  };

  componentDidMount() {
    const id = this.props.navigation.getParam('id', '');
    this.setState({
      orderId: id,
    });
    this.getStoreOrderDetail(id);
  }

  isReceiving = () => {
    this.setState({
      isReceivingModal: true,
    });
  };

  cancelAlert = () => {
    this.setState({
      isReceivingModal: false,
    });
  };

  /**
   * 接口请求
   */
  async getStoreOrderDetail(id) {
    const res = await getStoreOrderDetail(id);

    if (res) {
      this.setState({
        data: res,
      });
    }
  }

  async receiving() {
    const { orderId } = this.state;
    const res = await getReceiving(orderId);
    if (res) {
      this.setState({
        isReceivingModal: false,
      });
      this.getStoreOrderDetail(orderId);
    }
  }

  render() {
    const { data, isReceivingModal } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
        <OrderDetail
          data={data}
          isStore
          isReceiving={this.isReceiving}
        />
        <ReceivingModal
          isReceivingModal={isReceivingModal}
          receiving={this.receiving.bind(this)}
          cancelAlert={this.cancelAlert}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
});
