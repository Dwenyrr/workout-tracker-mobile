import { useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Button, Card, IconButton, List, PaperProvider, TextInput, Title } from "react-native-paper";
import ExerciseInput from "../src/components/ExerciseInput";
import { addCurrentWorkoutPlan, deleteExercise, Exercise, fetchWorkoutPlans, saveWorkoutPlan, WorkoutPlan } from "../redux/workoutSlice";
import { useDispatch, useSelector, } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Router, useRouter } from "expo-router";
import { AppDispatch, RootState } from "../redux/store";

//Create a new workout plan
const createWorkoutPlan : React.FC = () : React.ReactElement => {

    const currentWorkoutPlan : WorkoutPlan | undefined = useSelector((state : RootState) => state.workoutList.currentWorkoutPlan);

    const [planName, setPlanName] = useState<string>("");
    const [workoutNameConfirmed, setWorkoutNameConfirmed] = useState<boolean>(false);

    const dispatch : AppDispatch = useDispatch();
    const router : Router = useRouter();

    //Confirm workout name and add it to the current workout plan
    const handleConfirmWorkoutName = () : void => {
        dispatch(addCurrentWorkoutPlan(planName));
        setPlanName("");
        setWorkoutNameConfirmed(true);
    };

    //Save the workout plan to the database and fetch all workout plans
    const handleSaveWorkoutPlan = () : void => {
        if (!currentWorkoutPlan) return;
        dispatch(saveWorkoutPlan(currentWorkoutPlan));
        dispatch(fetchWorkoutPlans());

        setWorkoutNameConfirmed(false);
        router.push("/startWorkout");

    };

    //Delete an exercise from the current workout plan
    const handleDeleteExercise = (id : string) : void => {
        dispatch(deleteExercise(id));
    }

    return (
        <PaperProvider>
          <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>

              <View style={styles.container}>
                {!workoutNameConfirmed 
                  ? <Card style={styles.card}>
                      <Card.Content>
                        <Title style={styles.title}>Create New Workout Plan</Title>
                        <TextInput
                          label="Workout Name"
                          value={planName}
                          onChangeText={setPlanName}
                          style={styles.textInput}
                          mode="outlined"
                        />
                        <Button
                          mode="contained"
                          onPress={handleConfirmWorkoutName}
                          disabled={planName.length === 0}
                          style={styles.button}
                        >
                          Confirm Name
                        </Button>
                      </Card.Content>
                  </Card>
                 : <View style={styles.confirmedContainer}>
                    <Title style={styles.confirmedTitle}>Plan Name: {currentWorkoutPlan?.name}</Title>
                    <ExerciseInput />
                    <Title style={styles.listTitle}>Added Exercises</Title>
                    <ScrollView
                      style={styles.scrollView}
                      contentContainerStyle={styles.scrollViewContent}
                    >                  
                      <List.Section>
                        {currentWorkoutPlan?.exercises.map((exercise: Exercise, idx: number) => (
                          <List.Item
                            key={idx}
                            title={exercise.name}
                            description={`Sets: ${exercise.amountOfSets}`}
                            style={{ borderBottomWidth: 1, borderBottomColor: "#E0E0E0", paddingVertical: 5 }}
                            right={(props) => (
                              <IconButton
                                {...props}
                                icon="delete"
                                onPress={() => handleDeleteExercise(exercise.id)}
                              />
                            )}
                          />
                        ))}
                      </List.Section>
                    </ScrollView>

                    <View style={styles.saveButtonContainer}>
                      <Button
                        mode="contained"
                        onPress={handleSaveWorkoutPlan}
                        disabled={currentWorkoutPlan?.exercises.length === 0}
                        style={styles.saveButton}
                      >
                        Save Workout
                      </Button>
                    </View>
                  </View>
                }
                
              </View>
            </SafeAreaView>
          </SafeAreaProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 10,
    elevation: 4,
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  textInput: {
    marginBottom: 20,
  },
  button: {
    borderRadius: 10,
  },
  confirmedContainer: {
    flex: 1,
  },
  confirmedTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  saveButtonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  saveButton: {
    borderRadius: 10,
  },
});


export default createWorkoutPlan;