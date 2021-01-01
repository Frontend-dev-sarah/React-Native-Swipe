import React, { Component } from 'react';
import { View, LayoutAnimation, UIManager, Text, Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';
import { Card, Button } from 'react-native-elements';

const WIN_WIDTH = Dimensions.get('window').width;
const DURATION_TIME = 250;


class Deck extends Component {
    constructor(props) {
        super(props);
      
        const position  = new Animated.ValueXY();
        const panRespender = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({x: gesture.dx, y: gesture.dy})
            },
            onPanResponderRelease: (event, gesture) => {
                this.onPanResponderComplete(gesture)
            }
        })
        this.state = { panRespender, position, index: 0 }
    } 

    UNSAFE_componentWillUpdate () {
        UIManager.setLayoutAnimationEnabledExperimental&&UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    onPanResponderComplete = (gesture) => {
        const { position, index } = this.state;

        if(gesture.dx > WIN_WIDTH*0.25){
            Animated.timing(position, {toValue: {x: WIN_WIDTH, y: 0}, duration: DURATION_TIME}).start(() => {this.setState({ index: index+1 }), position.setValue({x: 0, y: 0})})
            this.setState({ index: index+1 })
        } else if(gesture.dx < -WIN_WIDTH*0.25) {
            Animated.timing(position, {toValue: {x: -WIN_WIDTH, y: 0}, duration: DURATION_TIME}).start(() => {this.setState({ index: index+1 }), position.setValue({x: 0, y: 0})})      
        } else {
            this.resetPosition()
        }
    }
    resetPosition = () => {
        Animated.spring(this.state.position, {toValue: {x: 0, y: 0}}).start();
    }
     animatedStyle = () => {
         const { position } = this.state;
         const rotation = position.x.interpolate({
             inputRange: [-WIN_WIDTH*2, 0, WIN_WIDTH*2],
             outputRange: ['-120deg', '0deg', '120deg']         
         })
        return { 
            ...position.getLayout(),
            transform: [{rotate: rotation}] 
        }          
    }
    

    renderCard = () => {
        if(this.state.index >= this.props.data.length) {
            return (
                <Card style>
                    <Card.Title>The End</Card.Title>
                    <Text style = {{marginVertical: 50}}>You reach my bottom</Text>
                    <Button 
                    title = 'Go Back to the Beginning'
                    onPress = {() => this.setState({index: 0})}
                    />
                </Card>
            );
        }
        return (
            this.props.data.map((item, index) => {
                if(index < this.state.index) { return null }
                if(index === this.state.index) {
                    return (
                        <Animated.View
                        key = {item.id}
                        {...this.state.panRespender.panHandlers}
                        style = {[this.animatedStyle(), styles.stack]}
                        >
                            {this.props.renderItem(item)}
                        </Animated.View>
                    );
                }
            return <View key = {item.id} style={styles.stack}>{this.props.renderItem(item)}</View>
            })
        ).reverse()
    }

    render () {
        return <Animated.View>
            {this.renderCard()}
        </Animated.View>
    }
}

const styles  = StyleSheet.create({
    stack: {
        position: 'absolute',
        // left: 0,
        // right: 0,
        width: WIN_WIDTH-40,
    }
})
export default Deck;
