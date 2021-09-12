/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RunTest from './network/TestHttpRequestManager';

const App = () => {
    useEffect(() => {
        // testHttpClient();
        RunTest();
    }, []);
    return (
        <View style={styles.container}>
            <Text>Hello world</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
});

export default App;
