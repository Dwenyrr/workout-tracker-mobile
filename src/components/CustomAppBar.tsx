import React from 'react';
import { Appbar } from 'react-native-paper';
import { Router, useRouter } from 'expo-router';

// Custom AppBar for the app
const CustomAppBar: React.FC = () : React.ReactElement => {
  
  const router : Router = useRouter();

  return (
    <Appbar.Header style={{justifyContent: 'space-around'}}>
        <Appbar.Action icon="home" onPress={() => router.push('/')} />
        <Appbar.Action icon='plus-circle' onPress={() => router.push('/startWorkout')} />
        <Appbar.Action icon="text-box" onPress={() => router.push('/workoutPlansView')} />
        <Appbar.Action icon="archive" onPress={() => router.push('/workoutHistoryView')} />
    </Appbar.Header>
  );
};

export default CustomAppBar;