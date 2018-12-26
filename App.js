import React from 'react';
import { Modal, StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import DailyHabitsList from './js/components/DailyHabitsList'
import NavigationBar from 'react-native-navbar';

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
                    <View style={{marginTop: 22}}>
                        <View>
                        <Text>Hello World!</Text>

                        <TouchableHighlight
                            onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <Text>Hide Modal</Text>
                        </TouchableHighlight>
                        </View>
                    </View>
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
