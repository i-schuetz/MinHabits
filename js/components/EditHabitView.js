import React, { Component } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import NavigationBar from 'react-native-navbar';

export default class EditHabitView extends Component {
    state = { habit: { name: "" } }

    render() {
        const leftButtonConfig = {
            title: 'x',
            handler: () => this.props.onClose()
        };
        
        const titleConfig = {
            title: 'Add habit',
        };
        return (
            <View>
                <NavigationBar
                    title={titleConfig}
                    leftButton={leftButtonConfig}
                />
                <View>
                <TextInput 
                    style={styles.nameInput} 
                    ref={input => (this.textInput = input)}
                    placeholder="Name" 
                    onSubmitEditing={event => {
                        this.setState({ habit: { name: event.nativeEvent.text }}, () => {
                            console.log("Habit added/edited: " + JSON.stringify(this.state.habit));
                        });
                    }}
                />

                <Text>Hello World!</Text>

                <Button 
                    title="Submit" 
                    onPress={() => {
                        this.props.onSubmit(this.state.habit);
                    }}
                />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    nameInput: {
        height: 40
    }
});
