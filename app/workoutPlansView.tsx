import { ScrollView, View, StyleSheet } from "react-native";
import { Button, Card, IconButton, PaperProvider, Text } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { deleteWorkoutPlan, fetchWorkoutPlans, WorkoutPlan } from "../redux/workoutSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { Router, useRouter } from "expo-router";

// View for displaying all saved workout plans
const workoutPlansView : React.FC = () : React.ReactElement => {

    const workoutPlans : WorkoutPlan[] | undefined = useSelector((state : RootState) => state.workoutList.workoutPlans); 
    
    const router : Router = useRouter();
    const dispatch : AppDispatch = useDispatch();

    const handleDeleteWorkoutPlan = (workoutPlanId : string) : void => {
        dispatch(deleteWorkoutPlan(workoutPlanId));
        dispatch(fetchWorkoutPlans());
    };

    return (
        <PaperProvider>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <Text variant="titleLarge" style={styles.title}>Saved workout plans:</Text>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {workoutPlans?.map((workoutPlan: WorkoutPlan, idx: number) => (
                            <Card key={idx} style={styles.workoutPlanCard}>
                                <Card.Content>
                                    <View style={styles.cardHeader}>
                                        <Text variant="titleMedium" style={styles.workoutPlanTitle}>
                                            {workoutPlan.name} - Exercises: {workoutPlan.exercises.length}
                                        </Text>
                                        <IconButton
                                            icon="delete"
                                            size={20}
                                            onPress={() => handleDeleteWorkoutPlan(workoutPlan.id)}
                                            style={styles.deleteIcon}
                                        />
                                    </View>
                                    {workoutPlan.exercises.map((exercise) => (
                                        <Text key={exercise.id} variant="bodyMedium" style={styles.exerciseText}>
                                            {exercise.name} - Sets: {exercise.amountOfSets}
                                        </Text>
                                    ))}
                                </Card.Content>
                            </Card>
                        ))}
                    </ScrollView>

                    <Button
                        mode="contained"
                        style={styles.createButton}
                        onPress={() => router.push('/createWorkoutPlan')}
                    >
                        Create New Workout Plan
                    </Button>
                </SafeAreaView>
            </SafeAreaProvider>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    header: {
        marginBottom: 10,
    },
    title: {
        marginBottom: 20,
        fontWeight: 'bold',
    },
    scrollView: {
        flexGrow: 1,
    },
    workoutPlanCard: {
        marginBottom: 10,
        padding: 5,
        borderRadius: 8,
        elevation: 3,
    },
    workoutPlanTitle: {
        fontWeight: 'bold',
        marginBottom: 2,
    },
    exerciseText: {
        marginLeft: 10,
        marginTop: 2,
        fontSize: 14,
    },
    createButton: {
        marginTop: 10,
        marginBottom: 20,
        alignSelf: 'center',
        width: '100%',
        borderRadius: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,  
    },
    deleteIcon: {
        marginRight: -8,  
        padding: 0, 
    },
});

export default workoutPlansView;