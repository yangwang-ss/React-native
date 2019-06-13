import React from 'react';
import { View, Text, StyleSheet, processColor } from 'react-native';
import { LineChart } from 'react-native-charts-wrapper';
import { lineChartData } from '@api';

const petrel = 'rgba(255, 0, 0, 0.2)';
export default class Chart extends React.Component {
  state = {
    lineData: {},
    xAxis: {},
    yAxis: {},
    chartData: {},
  };

  // eslint-disable-next-line react/sort-comp
  changeChartTab(params) {
    const { lineData } = this.state;
    console.log('数据重新渲染', lineData, params);
    if (params == 'login') {
      this.setState({
        chartData: {
          dataSets: [
            {
              label: '今日新增',
              values: lineData.todayLogin,
              config: this.itemConfig(1),
            },
            {
              label: '昨日新增',
              values: lineData.yesterdayLogin,
              config: this.itemConfig(2),
            },
          ],
        },
        xAxis: this.renderAxis('x'),
        yAxis: this.renderAxis('y', 'login'),
      });
    } else {
      this.setState({
        chartData: {
          dataSets: [
            {
              label: '今日活跃',
              values: lineData.todayActive,
              config: this.itemConfig(1),
            },
            {
              label: '昨日活跃',
              values: lineData.yesterdayActive,
              config: this.itemConfig(2, 'active'),
            },
          ],
        },
        xAxis: this.renderAxis('x'),
        yAxis: this.renderAxis('y'),
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  itemConfig(type) {
    if (type == 1) {
      return {
        drawValues: false, // 绘制拐点是否显示数据
        valueTextSize: 10, // 显示数据的文字大小
        lineWidth: 1, // 线条宽度
        drawCircles: true, // 拐点是否绘制原点
        circleColor: processColor(petrel),
        drawCircleHole: true, // 点是否空心
        circleRadius: 2, // 数据点的大小
        color: processColor('#FA4B91'), // 线条的颜色
        drawFilled: true, // 是否启用填充颜色
        fillColor: processColor('rgba(250,75,145, 0.3)'),
      };
    }
    return {
      drawValues: false,
      valueTextSize: 10, // 显示数据的文字大小
      lineWidth: 1, // 线条宽度
      drawCircles: true, // 拐点是否绘制原点
      circleColor: processColor('#7BA4FF'),
      drawCircleHole: true, // 点是否空心
      circleRadius: 2, // 数据点的大小
      color: processColor('#7BA4FF'), // 线条的颜色
      drawFilled: true, // 是否启用填充颜色
      fillColor: processColor('rgba(123,164,255,0.30)'),
    };
  }

  async getData() {
    const res = await lineChartData();
    console.log('表单数据====', res);
    if (res) {
      const todayLogin = this.resData(res.todayLogin);
      const yesterdayLogin = this.resData(res.yesterdayLogin);
      const todayActive = this.resData(res.todayActive);
      const yesterdayActive = this.resData(res.yesterdayActive);
      const maxNum1 = todayLogin.maxNum > yesterdayLogin.maxNum ? todayLogin.maxNum : yesterdayLogin.maxNum;
      const maxNum2 = todayActive.maxNum > yesterdayActive.maxNum ? todayActive.maxNum : yesterdayActive.maxNum;
      console.log('maxNums', maxNum1, maxNum2);
      this.maxLoginNum = maxNum1 > 10 ? maxNum1 : 10;
      this.maxActiveNum = maxNum2 > 10 ? maxNum1 : 10;
      this.setState({
        lineData: {
          todayLogin: todayLogin.data,
          yesterdayLogin: yesterdayLogin.data,
          todayActive: todayActive.data,
          yesterdayActive: yesterdayActive.data,
        },
        chartData: {
          dataSets: [
            {
              label: '今日新增',
              values: todayLogin.data,
              config: this.itemConfig(1),
            },
            {
              label: '昨日新增',
              values: yesterdayLogin.data,
              config: this.itemConfig(2),
            },
          ],
        },
        xAxis: this.renderAxis('x'),
        yAxis: this.renderAxis('y', 'login'),
      });
    }
  }

  resData = params => {
    let maxNum = 0;
    const data = [{ y: 0 }];
    params.map((item, index) => {
      if (+item.num > maxNum) {
        maxNum = +item.num;
      }
      return data.push({ y: item.num });
    });
    return { data, maxNum };
  };

  renderAxis(type, isLogin) {
    if (type == 'x') {
      return {
        drawGridLines: false,
        textColor: processColor('#333'),
        textSize: 11,
        axisLineColor: processColor('transparent'),
        avoidFirstLastClipping: true,
        // labelRotationAngle: 10,
        position: 'BOTTOM',
        valueFormatter: ['', '3时', '6时', '9时', '12时', '15时', '18时', '21时', ''],
        granularityEnabled: true,
        granularity: 1, // 点的间隔
      };
    }
    return {
      left: {
        textColor: processColor('#333'),
        textSize: 11,
        textAlign: 'center',
        drawGridLines: true,
        axisLineColor: processColor('transparent'),
        gridColor: processColor('#F0F0F0'),
        axisMaximum: isLogin === 'login' ? this.maxLoginNum : this.maxActiveNum,
        axisMinimum: 0,
      },
      right: {
        enabled: false,
      },
    };
  }

  render() {
    return (
      <LineChart
        style={styles.chart}
        data={this.state.chartData}
        xAxis={this.state.xAxis}
        yAxis={this.state.yAxis}
        chartDescription={{ text: '' }}
        legend={{
          enabled: true,
          textSize: 12,
          form: 'SQUARE',
          formSize: 12,
          xEntrySpace: 140,
          yEntrySpace: 20,
          formToTextSpace: 5,
          wordWrapEnabled: false,
          maxSizePercent: 0.5,
        }}
        animation={{ durationX: 300 }}
        drawValueAboveBar
        scaleEnabled={false}
        touchEnabled
      />
    );
  }
}

const styles = StyleSheet.create({
  chart: {
    flex: 1,
  },
});
