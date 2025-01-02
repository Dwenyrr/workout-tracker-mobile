import { SafeAreaView, View, StyleSheet } from "react-native";
import { Button, Card, PaperProvider, Text } from "react-native-paper";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Workout, WorkoutPlan } from "../redux/workoutSlice";
import { Router, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Preview of the workout plan selected
const workoutPreview : React.FC = () : React.ReactElement => {
    
    const currentWorkout : Workout | undefined = useSelector((state : RootState) => state.workoutList.currentWorkout);
    const workoutPlans : WorkoutPlan[] | undefined = useSelector((state : RootState) => state.workoutList.workoutPlans);

    const router : Router = useRouter();

    const selectedWorkoutPlan : WorkoutPlan | undefined = workoutPlans?.find((workoutPlan) => workoutPlan.id === currentWorkout?.workoutPlanId);
    
    return (
        <PaperProvider>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <View >
                        <Text variant="titleLarge" style={styles.Title}>Workout Preview</Text>
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text variant="titleMedium" style={styles.workoutPlanTitle}>
                                    {selectedWorkoutPlan?.name}
                                </Text>
                                {selectedWorkoutPlan?.exercises.map((exercise) => (
                                    <View key={exercise.id} style={styles.exerciseContainer}>
                                        <Text variant="bodyMedium" style={styles.exerciseText}>
                                            {exercise.name} - Sets: {exercise.amountOfSets}
                                        </Text>
                                    </View>
                                ))}
                            </Card.Content>
                        </Card>

                        <Button
                            mode="contained"
                            style={styles.startButton}
                            onPress={() => router.push('/workoutView')}
                        >
                            Start Workout
                        </Button>
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
    card: {
        marginBottom: 20,
        borderRadius: 10,
        elevation: 3, 
    },
    workoutPlanTitle: {
        fontWeight: 'bold',
        marginBottom: 15,
        fontSize: 20,
    },
    Title: {
        fontWeight: 'bold',
        marginBottom: 15,
        fontSize: 24,
    },
    exerciseContainer: {
        marginBottom: 10,
    },
    exerciseText: {
        fontSize: 16,
    },
    startButton: {
        alignSelf: 'center',
        width: '100%',
        padding: 10,
        borderRadius: 10,
    },
});


export default workoutPreview;