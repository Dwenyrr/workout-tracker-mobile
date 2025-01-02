import { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Button, PaperProvider, Text, TextInput, } from "react-native-paper";
import * as Haptics from 'expo-haptics';
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { ExerciseSet, updateExerciseSet, Workout } from "../redux/workoutSlice";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Router, useRouter } from "expo-router";

// View for the current workout
const workoutView : React.FC = () : React.ReactElement => {

  const currentWorkout : Workout | undefined = useSelector((state : RootState) => state.workoutList.currentWorkout);

  const dispatch : AppDispatch = useDispatch();
  const router : Router = useRouter();

  const [exerciseIdx, setExerciseIdx] = useState<number>(0);
  const [setsData, setSetsData] = useState<ExerciseSet[]>(
    currentWorkout?.exercises[exerciseIdx].sets.map(() => ({ reps: '', weight: '' })) || []
  );

  const handleSaveSet = (setIdx : number, field : string, value : string) : void => {
    const updatedSets : ExerciseSet[] = [...setsData];
    updatedSets[setIdx] = {
      ...updatedSets[setIdx],
      [field] : value
    }
    setSetsData(updatedSets);
  };

  const handleSaveExercise = () : void => {
    if (currentWorkout && setsData) {

      dispatch(
        updateExerciseSet({
          exerciseId: currentWorkout.exercises[exerciseIdx].id,
          sets: setsData
        })
      );
  
      if (exerciseIdx < currentWorkout.exercises.length - 1) {
        setExerciseIdx(exerciseIdx + 1);
        setSetsData(
          currentWorkout?.exercises[exerciseIdx + 1].sets.map(() => ({reps: '', weight: ''}))
        )
      }
    }
  };

  const handleCompleteWorkout = () : void => {
    handleSaveExercise();
    router.push("/workoutSummary");
  };

  const handleRestPeriod = () : void => {
    setTimeout(() => {
      const intervalId : NodeJS.Timeout = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
      }, 5000);
    }, 60000);
  };

  return (
      <PaperProvider>
          <SafeAreaProvider>
              <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                  <Text variant="titleLarge" style={styles.exerciseTitle}>
                    {currentWorkout?.exercises[exerciseIdx].name}
                  </Text>
    
                  {setsData?.map((set, idx) => (
                    <View key={idx} style={styles.setRow}>
                      <View style={styles.inputGroup}>
                        <TextInput
                          mode="outlined"
                          placeholder="Reps"
                          value={set.reps}
                          keyboardType="numeric"
                          onChangeText={(value) => handleSaveSet(idx, "reps", value)}
                          style={styles.input}
                        />

                      </View>

                      <Text style={styles.label}>x</Text>

                      <View style={styles.inputGroup}>
                        <TextInput
                          mode="outlined"
                          placeholder="Weight"
                          value={set.weight}
                          keyboardType="numeric"
                          onChangeText={(value) => handleSaveSet(idx, "weight", value)}
                          style={styles.input}
                        />
                        <Text style={styles.label}>kg</Text>
                      </View>
                    </View>
                  ))}

                  <Button
                    mode='text'
                    icon='timer'
                    onPress={handleRestPeriod}
                  >
                    Start Rest Period
                  </Button>


                  {currentWorkout?.exercises &&
                    exerciseIdx === currentWorkout.exercises.length - 1 
                      ? <Button
                          mode="contained"
                          onPress={handleCompleteWorkout}
                          style={styles.completeButton}
                        >
                          End Workout
                        </Button>
                      : <Button 
                          mode="contained" 
                          onPress={handleSaveExercise} 
                          style={styles.saveButton} 
                          disabled={setsData.some((set) => set.reps === '' || set.weight === '')}
                        >
                          Save Exercise
                        </Button>
                    }
                    </View>
              </SafeAreaView>
          </SafeAreaProvider>
      </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  exerciseTitle: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    width: 100,
    height: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 10
  },
  completeButton: {
    marginTop: 10,
  },
});

export default workoutView;