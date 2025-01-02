import { View, StyleSheet, SafeAreaView, Image, ScrollView } from "react-native";
import { Button, PaperProvider, Text } from "react-native-paper";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkouts, saveWorkout, Workout, } from "../redux/workoutSlice";
import { Router, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// View for displaying the summary of the current workout
const workoutSummary : React.FC = () : React.ReactElement => {
    
    const currentWorkout : Workout | undefined = useSelector((state : RootState) => state.workoutList.currentWorkout);

    const dispatch : AppDispatch = useDispatch();
    const router : Router = useRouter();
    
    const endWorkout = () : void => {
        if (currentWorkout) {
            dispatch(saveWorkout(currentWorkout));
            dispatch(fetchWorkouts());
            router.push("/");
        }
    }

    return (
        <PaperProvider>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>

                    <View style={styles.summaryContainer}>
                        <Text style={styles.workoutTitle}>Workout Summary:  {currentWorkout?.name}</Text>

                        <ScrollView>
                            {currentWorkout?.exercises.map((exercise, idx: number) => (
                                <View key={idx} style={styles.exerciseContainer}>
                                    <Text variant="titleSmall" style={styles.exerciseName}>{exercise.name}</Text>
                                    {exercise.sets.map((set, idx: number) => (
                                        <Text key={idx} style={styles.setDetails}>
                                            Set {idx + 1}: {set.reps} reps, {set.weight} kg
                                        </Text>
                                    ))}
                                </View>
                            ))}

                            {currentWorkout?.photo
                                ? <Image source={{ uri: currentWorkout.photo }} style={styles.progressImage} />
                                : null
                            }
                        </ScrollView>

                        {currentWorkout?.photo
                                ? null
                                : <Button
                                    mode='outlined'
                                    icon='camera'
                                    onPress={() => router.push('/cameraView')}
                                    style={styles.addImageButton}
                                >
                                    Add Progress Image
                                </Button>
                        }

                        <Button
                            mode="contained"
                            onPress={endWorkout}
                            style={styles.completeButton}
                        >
                            Complete
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
    summaryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    workoutTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    exerciseContainer: {
        marginBottom: 15,
        width: '100%',
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    setDetails: {
        fontSize: 16,
        marginBottom: 5,
    },
    progressImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginVertical: 20,
    },
    addImageButton: {
        width: '100%',
        borderRadius: 10,
    },
    completeButton: {
        width: '100%',
        marginVertical: 10,
        borderRadius: 10,
    },
});


export default workoutSummary;