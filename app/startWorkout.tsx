import { useState } from "react";
import { View, StyleSheet, ScrollView, } from "react-native";
import { Button, List, PaperProvider, RadioButton, Title, Text} from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {Router, useRouter} from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { startNewWorkout, WorkoutPlan } from "../redux/workoutSlice";

// Create a new workout
const createWorkout : React.FC = () : React.ReactElement => {

  const workoutPlans : WorkoutPlan[] | undefined = useSelector((state : RootState) => state.workoutList.workoutPlans);

  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('');

  const dispatch : AppDispatch = useDispatch();
  const router : Router = useRouter();

  // Function to handle the selection of a workout plan for new workout
  const handleSelectWorkout = () : void => {
    const selectedWorkoutPlan : WorkoutPlan | undefined = workoutPlans?.find((workoutPlan) => workoutPlan.id === selectedWorkoutId);

      if (selectedWorkoutPlan) {
        dispatch(startNewWorkout(selectedWorkoutPlan.id));
        router.push("/workoutPreview");
      }
  };

    return (
        <PaperProvider>
          <SafeAreaProvider>
            <SafeAreaView>
                <View style={{padding: 20}}>
                  <Title style={styles.title}>Start New Workout</Title>
                  <Text variant="titleMedium">Select a Workout Plan</Text>

                  <ScrollView>
                    <RadioButton.Group
                        onValueChange={(value) => setSelectedWorkoutId(value)}
                        value={selectedWorkoutId}
                    >
                      {workoutPlans?.map((workoutPlan : WorkoutPlan) => (
                        <List.Item
                          key={workoutPlan.id}
                          title={workoutPlan.name}
                          description={`${workoutPlan.exercises.length} exercise(s)`}
                          right={() => <RadioButton value={workoutPlan.id} />}
                        />
                      ))}
                    </RadioButton.Group>
                  </ScrollView>
                  
                  <Button
                      mode="contained"
                      onPress={handleSelectWorkout}
                      disabled={selectedWorkoutId === null}
                      style={styles.selectButton}
                  >
                      Start Selected Workout
                  </Button>

                  <Button 
                    mode="outlined"
                    onPress={() => router.push('/createWorkoutPlan')}
                    style={styles.newWorkoutButton}
                  >
                    Create New Workout Plan
                  </Button>
                </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
    textAlign: "center",
  },
  subheader: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    marginVertical: 20,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectButton: {
    marginVertical: 10,
    borderRadius: 10,
  },
  newWorkoutButton: {
    borderRadius: 10,
  },
});


export default createWorkout;