import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import DailyHabitsList from './js/components/DailyHabitsList'
import NavigationBar from 'react-native-navbar';
import StatusBarArea from './js/components/StatusBarArea';
import EditHabitView from './js/components/EditHabitView';
import Repo from './js/Repo.js';

export default class App extends React.Component {
    state = {
        habits: [],
        modalVisible: false,
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    componentWillMount() {
        console.log("componentWillMount()");
        this.updateHabits();
    }

    updateHabits = async () => {
        const habits = await Repo.loadItems();
        console.log("updating list with items: " + JSON.stringify(habits));
        this.setState({ habits: habits });
    }

    onSubmitHabit = async (habit) => {
        this.setModalVisible(false) 
        await Repo.addHabit(habit);
        this.updateHabits()
    }

    render() {
        const rightButtonConfig = {
            title: '+',
            handler: () => this.setModalVisible(!this.state.modalVisible)
        };
        
        const titleConfig = {
            title: 'Habits',
        };
        return (
            <View style={styles.container}>
                <StatusBarArea />
                <NavigationBar
                    title={titleConfig}
                    rightButton={rightButtonConfig}
                />
                <DailyHabitsList 
                    habits={this.state.habits} 
                />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose = {() => {
                        this.setModalVisible(false) 
                    }}
                    >
                    <EditHabitView 
                        onSubmit={(habit) => {
                            this.onSubmitHabit(habit)
                        }}
                    />
                </Modal>
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
