var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import DailyHabitsList from "./components/DailyHabitsList";
import NavigationBar from "react-native-navbar";
import StatusBarArea from "./components/StatusBarArea";
import EditHabitView from "./components/EditHabitView";
import Repo from "./Repo";
export default class App extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            habits: Array(),
            modalVisible: false
        };
        this.updateHabits = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const habits = yield Repo.loadItems();
                console.log("updating list with items: " + JSON.stringify(habits));
                this.setState({ habits: habits });
            }
            catch (error) {
                console.error("Error loading habits. ", error);
            }
        });
        this.submitHabit = (habit) => __awaiter(this, void 0, void 0, function* () {
            console.log("Submitting habit: " + JSON.stringify(habit));
            this.setModalVisible(false);
            yield Repo.addHabit(habit);
            this.updateHabits();
        });
    }
    componentWillMount() {
        this.updateHabits();
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    render() {
        const rightButtonConfig = {
            title: "+",
            handler: () => this.setModalVisible(!this.state.modalVisible)
        };
        const titleConfig = {
            title: "Habits"
        };
        return (React.createElement(View, { style: styles.container },
            React.createElement(StatusBarArea, null),
            React.createElement(NavigationBar, { title: titleConfig, rightButton: rightButtonConfig }),
            React.createElement(DailyHabitsList, { habits: this.state.habits }),
            React.createElement(Modal, { animationType: "slide", transparent: false, visible: this.state.modalVisible, onRequestClose: () => {
                    this.setModalVisible(false);
                } },
                React.createElement(EditHabitView, { onSubmit: (habit) => {
                        this.setModalVisible(false);
                        this.submitHabit(habit);
                    }, onClose: () => {
                        this.setModalVisible(false);
                    } }))));
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
});
//# sourceMappingURL=App.js.map