import React from 'react';
import { Modal, StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import DailyHabitsList from './js/components/DailyHabitsList'
import NavigationBar from 'react-native-navbar';
import StatusBarArea from './js/components/StatusBarArea';
import EditHabitView from './js/components/EditHabitView';

export default class App extends React.Component {

    state = {
        modalVisible: false,
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
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
                <DailyHabitsList />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    >
                    <EditHabitView onClose={() =>
                        this.setModalVisible(false)
                    }/>
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
