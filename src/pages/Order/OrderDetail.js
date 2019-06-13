import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { getDeliverGoods, getOrderDetail } from '../../services/api';
import OrderDetail from '../../components/OrderDetail';

export default class OrderDetailIndex extends Component {
  static navigationOptions = {
    title: '订单详情',
  };

  state = {
    data: {},
    orderId: '',
  };

  componentDidMount() {
    const orderId = this.props.navigation.getParam('id', '');
    this.setState({
      orderId,
    });
    this.getOrderDetail(orderId);
  }

  /**
   * 接口请求
   */
  async getOrderDetail(id) {
    const res = await getOrderDetail(id);
    if (res) {
      this.setState({
        data: res,
      });
    }
  }

  async deliverGoods() {
    const { orderId } = this.state;

    const res = await getDeliverGoods(orderId);
    if (res) {
      this.getOrderDetail(orderId);
    }
  }

  render() {
    const { data } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
        <OrderDetail data={data} deliverGoods={this.deliverGoods.bind(this)} />
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
