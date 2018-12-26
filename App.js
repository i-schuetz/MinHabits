import React from 'react';
import { StyleSheet, View } from 'react-native';
import DailyHabitsList from './js/components/DailyHabitsList'
import NavigationBar from 'react-native-navbar';

export default class App extends React.Component {

    render() {
        const rightButtonConfig = {
            title: '+',
            handler: () => alert('hello!'),
        };
        
        const titleConfig = {
            title: 'Habits',
        };
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={titleConfig}
                    rightButton={rightButtonConfig}
                />
                <DailyHabitsList />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
});
