import React from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Image,
} from 'react-native';
import Layout from '@constants/Layout';

const styles = StyleSheet.create({
  categoryFour: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityItem: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryImg: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    marginBottom: 5,
  },
  activityImg: {
    width: 48,
    height: 48,
    resizeMode: 'cover',
    marginBottom: 5,
  },
  categoryImgText: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
    backgroundColor: 'transparent',
  },
  categoryText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activityText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
type Props = {
  activeCategory: Array,
  bannerJump: Function,
  categoryJump: Function,
};
export default class Index extends React.Component<Props> {
  activeCategoryList = () => {
    const { activeCategory } = this.props;
    return this.setCategory(activeCategory, 'activity');
  };

  setCategory = (category, type) => {
    const { bannerJump, categoryJump } = this.props;
    const array = [...category];
    const result = [];
    let itemNum = 4;
    if (type === 'activity') {
      itemNum = 5;
    }
    for (let i = 0, len = array.length; i < len; i += itemNum) {
      result.push(array.slice(i, i + itemNum));
    }
    return result.map((elem, index) => {
      if (elem.length < itemNum) {
        for (let index = 0; index <= itemNum - elem.length; index++) {
          elem.push({});
        }
      }
      return (
        <View key={index} style={styles.categoryFour}>
          {elem.map((item, i) => {
            const { name, title } = item;
            let emptyItem = '';
            let categoryItem = '';
            if (name || title) {
              if (type === 'activity') {
                categoryItem = (
                  <TouchableOpacity
                    style={[styles.activityItem]}
                    onPress={() => bannerJump(item, 'category')}
                    activeOpacity={Layout.activeOpacity}
                  >
                    <Image
                      style={styles.activityImg}
                      source={{ uri: item.imageUrl }}
                      roundAsCircle
                      imageStyle={{ borderRadius: 30 }}
                    />
                    <Text style={styles.activityText}>{item.title}</Text>
                  </TouchableOpacity>
                );
              } else {
                categoryItem = (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => categoryJump(item, i)}
                    activeOpacity={Layout.activeOpacity}
                  >
                    <Image
                      style={styles.categoryImg}
                      source={{ uri: item.icon }}
                      roundAsCircle
                      imageStyle={{ borderRadius: 30 }}
                    />
                    <Text style={styles.categoryText}>{item.name || ''}</Text>
                  </TouchableOpacity>
                );
              }
            } else if (type === 'activity') {
              emptyItem = (
                <View style={styles.activityItem}>
                  <View style={styles.activityImg} />
                  <Text style={styles.activityText}>{item.title || ''}</Text>
                </View>
              );
            } else {
              emptyItem = (
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryImgText} />
                  <Text style={styles.categoryText}>{item.name || ''}</Text>
                </View>
              );
            }
            return <View key={i}>{name || title ? categoryItem : emptyItem}</View>;
          })}
        </View>
      );
    });
  };

  render() {
    return this.activeCategoryList();
  }
}
