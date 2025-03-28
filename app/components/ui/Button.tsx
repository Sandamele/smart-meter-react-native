import { StyleSheet, Text, TouchableHighlight } from 'react-native'
import React from 'react'

type Props = {
    title: string,
    onPress: () => void
}

export default function Button (props: Props) {
    return (
        <TouchableHighlight style={styles.containerButton} onPress={props.onPress}>
            <Text style={styles.buttonName}>{props.title}</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    containerButton: {
        backgroundColor: "#FF9825",
        padding: 10,
        borderRadius: 10,
        elevation: 5
    },
    buttonName: {
        fontSize: 18,
        color: "#FFF",
        textTransform: "uppercase",
        textAlign: "center",
        fontWeight: 500
    }
})