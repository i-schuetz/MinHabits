import React, { Component } from 'react';

import { FlatList, StyleSheet, Text } from 'react-native';
import Repo from './Repo.js';

export default class DailyHabitsList extends Component {
    state = { items: [] };

    componentWillMount() {
        this.updateItems();
    }

    updateItems = async () => {
        const items = await Repo.loadItems();
        this.setState({ items: items });
    }
    
    render() {
        return (
            <FlatList 
                style={styles.list} 
                data={this.state.items}
                renderItem={({item}) => <Text style={styles.item}>{item.name}</Text>}
            />
        );
    }
}

const styles = StyleSheet.create({
    list: {},
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    }
});
