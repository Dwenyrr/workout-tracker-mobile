import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import store, { AppDispatch } from '../redux/store';
import { fetchWorkoutPlans, fetchWorkouts, initializeDatabase } from '../redux/workoutSlice';
import CustomAppBar from '../src/components/CustomAppBar';

const Layout: React.FC = () : React.ReactElement => {

  const dispatch : AppDispatch = store.dispatch;

  // Initialize DB and fetch data on app start
  useEffect(() => {
    const initDBAndFetchData = async () : Promise<void> => {
      try {
        // Initialize the database
        await initializeDatabase();

        // Fetch data and update Redux store
        await dispatch(fetchWorkouts()); 
        await dispatch(fetchWorkoutPlans()); 
      } catch (error) {
        console.error('Error during initialization or data fetching:', error);
      }
    };

    initDBAndFetchData();
  }, [dispatch]);

  return (
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <Slot /> 
          <CustomAppBar/>
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
};

export default Layout;