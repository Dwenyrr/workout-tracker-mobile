import { ScrollView, View, Image, StyleSheet } from "react-native";
import { Button, Card, List, PaperProvider, Text } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { deleteWorkout, Exercise, ExerciseSet, fetchWorkouts, Workout } from "../redux/workoutSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

//View for saved workouts
const workoutHistoryView : React.FC = () : React.ReactElement => {

    const workouts : Workout[] = useSelector((state : RootState) => state.workoutList.workouts);

    const dispatch : AppDispatch = useDispatch();

    const handleDeleteWorkout = (workoutId : string) : void => {
        dispatch(deleteWorkout(workoutId));
        dispatch(fetchWorkouts());
    };
    return (
        <PaperProvider>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <View>
                        <Text variant="titleLarge" style={styles.title}>Completed Workouts</Text>

                        <ScrollView contentContainerStyle={styles.scrollView}>
                            {workouts.map((workout: Workout, idx: number) => (
                                <Card key={idx} style={styles.workoutCard}>
                                    <List.AccordionGroup>
                                        <List.Accordion id={idx.toString()} title={workout.name} style={styles.accordion}>
                                            <View style={styles.workoutDetails}>
                                                <Text variant="bodyMedium" style={styles.dateText}>
                                                    Date: {new Date(workout.date).toLocaleDateString()} {' '}
                                                    Time: {new Date(workout.date).toLocaleTimeString()}
                                                </Text>
                                                
                                                {workout.exercises.map((exercise: Exercise, idx: number) => (
                                                    <View key={idx} style={styles.exerciseContainer}>
                                                        <Text variant="titleSmall" style={styles.exerciseTitle}>{exercise.name}</Text>
                                                        <Text variant="bodyMedium">Sets: {exercise.amountOfSets}</Text>
                                                        {exercise.sets.map((set: ExerciseSet, idx: number) => (
                                                            <Text key={idx} variant="bodyMedium" style={styles.setText}>
                                                                Set {idx + 1}: Reps {set.reps} Weight {set.weight}kg
                                                            </Text>
                                                        ))}
                                                    </View>
                                                ))}
                                                {workout.photo && (
                                                    <View style={styles.photoContainer}>
                                                        <Image source={{ uri: workout.photo }} style={styles.progressPhoto} />
                                                    </View>
                                                )}
                                                <Button 
                                                    icon='delete'
                                                    mode='contained'
                                                    onPress={() => handleDeleteWorkout(workout.id)}
                                                >
                                                    Delete Workout
                                                </Button>
                                            </View>
                                        </List.Accordion>
                                    </List.AccordionGroup>
                                </Card>
                            ))}
                        </ScrollView>
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
    title: {
        marginBottom: 20,
        fontWeight: 'bold',
    },
    scrollView: {
        paddingBottom: 20,
    },
    workoutCard: {
        marginBottom: 15,
        borderRadius: 10,
        elevation: 3,
    },
    accordion: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    workoutDetails: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
    },
    dateText: {
        marginBottom: 10,
    },
    exerciseContainer: {
        marginBottom: 10,
    },
    exerciseTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    setText: {
        marginLeft: 15,
        marginTop: 4,
        fontSize: 14,
        color: '#555',
    },
    photoContainer: {
        marginVertical: 15,
        alignItems: 'center',
    },
    photoText: {
        marginBottom: 10,
        fontSize: 14,
    },
    progressPhoto: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
});

export default workoutHistoryView;